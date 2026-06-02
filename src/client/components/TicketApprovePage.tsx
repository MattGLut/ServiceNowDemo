import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ApproveAttachmentViewer from './ApproveAttachmentViewer'
import ApproveForm from './ApproveForm'
import ApproveTicketHeaderMeta from './ApproveTicketHeaderMeta'
import PortalLayout from './PortalLayout'
import ProcessingPathBadge from './ProcessingPathBadge'
import { BTN_PRIMARY } from './formStyles'
import { TicketApprovalService } from '../services/TicketApprovalService'
import { TicketService } from '../services/TicketService'
import { ticketListUrl } from '../utils/ticketListFilter'
import { ticketStatusBadgeClass } from '../utils/ticketStatusStyle'
import type { DiStatus, TicketApprovalRecord, TicketApprovalUpdateInput } from '../types/ticketApproval'
import type { TicketAttachment, TicketRecord } from '../types/ticket'

const DI_POLL_INTERVAL_MS = 3000
const DI_POLL_MAX_ATTEMPTS = 20

function isDiExtracting(
    approval: TicketApprovalRecord,
    ticket: TicketRecord,
    attachmentCount: number
): boolean {
    if (ticket.stpFlag || attachmentCount === 0) {
        return false
    }
    if (approval.diStatus === 'pending') {
        return true
    }
    return !approval.diStatus
}

type DocIntelStatusBannerProps = {
    diStatus: DiStatus | ''
    diError: string
    extracting: boolean
    onRefresh: () => void
}

function DocIntelStatusBanner({ diStatus, diError, extracting, onRefresh }: DocIntelStatusBannerProps) {
    if (diStatus === 'failed') {
        return (
            <div className="portal-submit-banner portal-submit-banner-error mb-4" role="alert">
                <p className="m-0 text-sm font-medium">Invoice extraction failed</p>
                {diError && <p className="m-0 mt-1 text-sm">{diError}</p>}
                <p className="m-0 mt-2 text-sm text-rh-muted">
                    You can still review and edit fields manually, or re-upload the PDF after fixing
                    configuration.
                </p>
            </div>
        )
    }

    if (!extracting) {
        return null
    }

    return (
        <div className="portal-submit-banner mb-4 border border-amber-500/40 bg-amber-500/10 text-amber-100">
            <p className="m-0 text-sm">Extracting invoice data from the PDF…</p>
            <button type="button" className="portal-mobile-toggle mt-2 text-sm" onClick={onRefresh}>
                Refresh
            </button>
        </div>
    )
}

type TicketApprovePageProps = {
    sysId: string | null
}

type LoadState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'not-found' }
    | { status: 'not-draft'; ticket: TicketRecord }
    | {
          status: 'ready'
          ticket: TicketRecord
          attachments: TicketAttachment[]
          approval: TicketApprovalRecord
      }
    | { status: 'approval-missing'; ticket: TicketRecord; attachments: TicketAttachment[] }

type ApprovePageChromeProps = {
    backHref: string
    title?: string
    ticket?: TicketRecord
    children: React.ReactNode
}

function ApprovePageChrome({ backHref, title, ticket, children }: ApprovePageChromeProps) {
    return (
        <PortalLayout fullWidth>
            <div className="portal-approve-shell">
                <header className="portal-approve-toolbar">
                    <div className="portal-approve-toolbar-primary">
                        <a href={backHref} className="portal-approve-back">
                            ← Back to tickets
                        </a>
                        {title && <h1 className="portal-approve-title">{title}</h1>}
                        {ticket && (
                            <div className="portal-approve-header-meta-center">
                                <ApproveTicketHeaderMeta ticket={ticket} />
                            </div>
                        )}
                        {ticket && (
                            <div className="portal-approve-toolbar-badges">
                                <span className={ticketStatusBadgeClass(ticket.status)}>
                                    {ticket.statusLabel}
                                </span>
                                <ProcessingPathBadge stpFlag={ticket.stpFlag} />
                            </div>
                        )}
                    </div>
                </header>
                <div className="portal-approve-workspace">{children}</div>
            </div>
        </PortalLayout>
    )
}

type ApproveFormPanelProps = {
    approval: TicketApprovalRecord
    extracting: boolean
    onRefresh: () => void
    onApprove: (values: TicketApprovalUpdateInput) => Promise<void>
}

function ApproveFormPanel({ approval, extracting, onRefresh, onApprove }: ApproveFormPanelProps) {
    return (
        <section className="portal-approve-left">
            <DocIntelStatusBanner
                diStatus={approval.diStatus}
                diError={approval.diError}
                extracting={extracting}
                onRefresh={onRefresh}
            />
            <ApproveForm approval={approval} extracting={extracting} onApprove={onApprove} />
        </section>
    )
}

export default function TicketApprovePage({ sysId }: TicketApprovePageProps) {
    const ticketService = useMemo(() => new TicketService(), [])
    const approvalService = useMemo(() => new TicketApprovalService(), [])
    const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
    const backHref = ticketListUrl('draft')

    const loadTicket = useCallback(async () => {
        if (!sysId) {
            setLoadState({ status: 'not-found' })
            return
        }

        setLoadState({ status: 'loading' })

        try {
            const ticket = await ticketService.getById(sysId)

            if (!ticket) {
                setLoadState({ status: 'not-found' })
                return
            }

            if (ticket.status !== 'draft') {
                setLoadState({ status: 'not-draft', ticket })
                return
            }

            const [attachments, approval] = await Promise.all([
                ticketService.listAttachments(sysId),
                approvalService.getByTicketSysId(sysId),
            ])

            if (!approval) {
                setLoadState({ status: 'approval-missing', ticket, attachments })
                return
            }

            setLoadState({ status: 'ready', ticket, attachments, approval })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setLoadState({ status: 'error', message })
            console.error(err)
        }
    }, [sysId, ticketService, approvalService])

    useEffect(() => {
        void loadTicket()
    }, [loadTicket])

    useEffect(() => {
        if (loadState.status !== 'ready') {
            return
        }

        const { approval, ticket, attachments } = loadState
        if (!isDiExtracting(approval, ticket, attachments.length)) {
            return
        }

        let attempts = 0
        const intervalId = window.setInterval(() => {
            attempts += 1
            if (attempts > DI_POLL_MAX_ATTEMPTS) {
                window.clearInterval(intervalId)
                return
            }

            void (async () => {
                if (!sysId) {
                    return
                }

                const refreshed = await approvalService.getByTicketSysId(sysId)
                if (!refreshed) {
                    return
                }

                setLoadState((current) => {
                    if (current.status !== 'ready') {
                        return current
                    }
                    return { ...current, approval: refreshed }
                })
            })()
        }, DI_POLL_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [loadState, sysId, approvalService])

    const refreshApproval = useCallback(async () => {
        if (!sysId || loadState.status !== 'ready') {
            await loadTicket()
            return
        }

        const refreshed = await approvalService.getByTicketSysId(sysId)
        if (!refreshed) {
            await loadTicket()
            return
        }

        setLoadState({ ...loadState, approval: refreshed })
    }, [sysId, loadState, approvalService, loadTicket])

    const handleApprove = useCallback(
        async (values: TicketApprovalUpdateInput) => {
            if (loadState.status !== 'ready') {
                return
            }

            await approvalService.approve(loadState.approval.sysId, values)
            window.location.href = ticketListUrl('approved')
        },
        [approvalService, loadState]
    )

    if (loadState.status === 'loading') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <div className="portal-approve-split">
                    <section className="portal-approve-left">
                        <p className="portal-detail-message m-0 text-sm">Loading approval data…</p>
                    </section>
                    <div className="portal-approve-right" />
                </div>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'not-found') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <div className="portal-approve-message-panel">
                    <p className="portal-detail-message m-0">Ticket not found.</p>
                    <p className="portal-detail-submessage mt-2">
                        Open a ticket from the tickets list or provide a valid draft ticket sys_id.
                    </p>
                </div>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'not-draft') {
        const { ticket } = loadState

        return (
            <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
                <div className="portal-approve-message-panel">
                    <p className="portal-detail-message m-0">This ticket is not awaiting approval.</p>
                    <p className="portal-detail-submessage mt-2">
                        Only draft tickets can be reviewed here. Current status:{' '}
                        <strong className="text-rh-text">{ticket.statusLabel}</strong>.
                    </p>
                    <a href={backHref} className={`${BTN_PRIMARY} mt-6 inline-flex`}>
                        Return to tickets
                    </a>
                </div>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'error') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <div className="portal-approve-message-panel">
                    <p className="portal-detail-message m-0 text-red-400">{loadState.message}</p>
                    <button type="button" className="portal-mobile-toggle mt-4" onClick={() => void loadTicket()}>
                        Retry
                    </button>
                </div>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'approval-missing') {
        const { ticket, attachments } = loadState

        return (
            <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
                <div className="portal-approve-split">
                    <section className="portal-approve-left">
                        <p className="portal-detail-message m-0 text-sm text-red-400">
                            No approval record found for this ticket.
                        </p>
                        <p className="portal-detail-submessage mt-2 text-sm">
                            The create-on-insert business rule may not have run. Retry after deploy, or
                            recreate the ticket.
                        </p>
                        <button
                            type="button"
                            className="portal-mobile-toggle mt-4"
                            onClick={() => void loadTicket()}
                        >
                            Retry
                        </button>
                    </section>
                    <div className="portal-approve-right">
                        <ApproveAttachmentViewer attachments={attachments} />
                    </div>
                </div>
            </ApprovePageChrome>
        )
    }

    const { ticket, attachments, approval } = loadState
    const extracting = isDiExtracting(approval, ticket, attachments.length)

    return (
        <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
            <div className="portal-approve-split">
                <ApproveFormPanel
                    approval={approval}
                    extracting={extracting}
                    onRefresh={() => void refreshApproval()}
                    onApprove={handleApprove}
                />
                <div className="portal-approve-right">
                    <ApproveAttachmentViewer attachments={attachments} />
                </div>
            </div>
        </ApprovePageChrome>
    )
}
