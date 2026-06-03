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
import type { TicketApprovalRecord, TicketApprovalUpdateInput } from '../types/ticketApproval'
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

function isContractLoading(approval: TicketApprovalRecord, ticket: TicketRecord): boolean {
    if (ticket.stpFlag) {
        return false
    }
    if (!ticket.externalId.trim()) {
        return false
    }
    if (approval.contractStatus === 'pending') {
        return true
    }
    return !approval.contractStatus
}

function isHybridTicket(approvals: TicketApprovalRecord[]): boolean {
    return approvals.length > 1 || approvals.some((approval) => approval.isHybridSegment)
}

function sortApprovals(approvals: TicketApprovalRecord[]): TicketApprovalRecord[] {
    return [...approvals].sort((left, right) =>
        (left.workflowTypeCode || 'ZZZ').localeCompare(right.workflowTypeCode || 'ZZZ')
    )
}

function isAnyDiExtracting(
    approvals: TicketApprovalRecord[],
    ticket: TicketRecord,
    attachmentCount: number
): boolean {
    return approvals.some((approval) => isDiExtracting(approval, ticket, attachmentCount))
}

function isAnyContractLoading(approvals: TicketApprovalRecord[], ticket: TicketRecord): boolean {
    return approvals.some((approval) => isContractLoading(approval, ticket))
}

function shouldPollApprovals(
    approvals: TicketApprovalRecord[],
    ticket: TicketRecord,
    attachmentCount: number
): boolean {
    return isAnyDiExtracting(approvals, ticket, attachmentCount) || isAnyContractLoading(approvals, ticket)
}

function pickInitialApprovalSysId(approvals: TicketApprovalRecord[]): string {
    const sorted = sortApprovals(approvals)
    return sorted.find((approval) => !approval.approvedAt)?.sysId ?? sorted[0]?.sysId ?? ''
}

type DocIntelStatusBannerProps = {
    approvals: TicketApprovalRecord[]
    extracting: boolean
    onRefresh: () => void
}

type ContractStatusBannerProps = {
    approvals: TicketApprovalRecord[]
    loading: boolean
    onRefresh: () => void
}

function ContractStatusBanner({ approvals, loading, onRefresh }: ContractStatusBannerProps) {
    const failed = approvals.find((approval) => approval.contractStatus === 'failed')

    if (failed) {
        return (
            <div className="portal-submit-banner portal-submit-banner-error mb-4" role="alert">
                <p className="m-0 text-sm font-medium">Contract lookup failed</p>
                {failed.contractError && <p className="m-0 mt-1 text-sm">{failed.contractError}</p>}
                <p className="m-0 mt-2 text-sm text-rh-muted">
                    You can still review and edit contract fields manually.
                </p>
            </div>
        )
    }

    if (!loading) {
        return null
    }

    return (
        <div className="portal-submit-banner mb-4 border border-sky-500/40 bg-sky-500/10 text-sky-100">
            <p className="m-0 text-sm">Loading contract data…</p>
            <button type="button" className="portal-mobile-toggle mt-2 text-sm" onClick={onRefresh}>
                Refresh
            </button>
        </div>
    )
}

function DocIntelStatusBanner({ approvals, extracting, onRefresh }: DocIntelStatusBannerProps) {
    const failed = approvals.find((approval) => approval.diStatus === 'failed')

    if (failed) {
        return (
            <div className="portal-submit-banner portal-submit-banner-error mb-4" role="alert">
                <p className="m-0 text-sm font-medium">Invoice extraction failed</p>
                {failed.diError && <p className="m-0 mt-1 text-sm">{failed.diError}</p>}
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

type HybridSegmentTabsProps = {
    approvals: TicketApprovalRecord[]
    activeApprovalSysId: string
    onSelect: (sysId: string) => void
}

function HybridSegmentTabs({ approvals, activeApprovalSysId, onSelect }: HybridSegmentTabsProps) {
    return (
        <div className="portal-approve-segment-tabs" role="tablist" aria-label="Workflow segments">
            {sortApprovals(approvals).map((approval) => {
                const label = approval.workflowTypeCode || 'Segment'
                const isActive = approval.sysId === activeApprovalSysId
                const isApproved = Boolean(approval.approvedAt)

                return (
                    <button
                        key={approval.sysId}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`portal-approve-segment-tab${isActive ? ' portal-approve-segment-tab-active' : ''}`}
                        onClick={() => onSelect(approval.sysId)}
                    >
                        <span>{label}</span>
                        {isApproved ? (
                            <span className="portal-approve-segment-tab-badge">Approved</span>
                        ) : (
                            <span className="portal-approve-segment-tab-badge portal-approve-segment-tab-badge-pending">
                                Pending
                            </span>
                        )}
                    </button>
                )
            })}
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
          approvals: TicketApprovalRecord[]
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
    ticket: TicketRecord
    attachments: TicketAttachment[]
    approvals: TicketApprovalRecord[]
    activeApprovalSysId: string
    onSelectApproval: (sysId: string) => void
    onRefresh: () => void
    onApprove: (approvalSysId: string, values: TicketApprovalUpdateInput) => Promise<void>
}

function ApproveFormPanel({
    ticket,
    attachments,
    approvals,
    activeApprovalSysId,
    onSelectApproval,
    onRefresh,
    onApprove,
}: ApproveFormPanelProps) {
    const hybrid = isHybridTicket(approvals)
    const extracting = isAnyDiExtracting(approvals, ticket, attachments.length)
    const contractLoading = isAnyContractLoading(approvals, ticket)
    const activeApproval =
        approvals.find((approval) => approval.sysId === activeApprovalSysId) ?? sortApprovals(approvals)[0]

    if (!activeApproval) {
        return (
            <section className="portal-approve-left">
                <p className="portal-detail-message m-0 text-sm">No approval segment selected.</p>
            </section>
        )
    }

    return (
        <section className="portal-approve-left">
            {hybrid && (
                <p className="portal-approve-hybrid-note mb-4 text-sm text-rh-muted">
                    Hybrid invoice — review and approve each workflow segment separately.
                </p>
            )}
            <ContractStatusBanner approvals={approvals} loading={contractLoading} onRefresh={onRefresh} />
            <DocIntelStatusBanner approvals={approvals} extracting={extracting} onRefresh={onRefresh} />
            {hybrid && (
                <HybridSegmentTabs
                    approvals={approvals}
                    activeApprovalSysId={activeApproval.sysId}
                    onSelect={onSelectApproval}
                />
            )}
            <ApproveForm
                key={activeApproval.sysId}
                approval={activeApproval}
                extracting={extracting || contractLoading}
                segmentLabel={hybrid ? activeApproval.workflowTypeCode : undefined}
                onApprove={(values) => onApprove(activeApproval.sysId, values)}
            />
        </section>
    )
}

export default function TicketApprovePage({ sysId }: TicketApprovePageProps) {
    const ticketService = useMemo(() => new TicketService(), [])
    const approvalService = useMemo(() => new TicketApprovalService(), [])
    const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
    const [activeApprovalSysId, setActiveApprovalSysId] = useState('')
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

            const [attachments, approvals] = await Promise.all([
                ticketService.listAttachments(sysId),
                approvalService.listByTicketSysId(sysId),
            ])

            if (approvals.length === 0) {
                setLoadState({ status: 'approval-missing', ticket, attachments })
                return
            }

            setActiveApprovalSysId(pickInitialApprovalSysId(approvals))
            setLoadState({ status: 'ready', ticket, attachments, approvals })
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

        const { approvals, ticket, attachments } = loadState
        if (!shouldPollApprovals(approvals, ticket, attachments.length)) {
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

                const refreshed = await approvalService.listByTicketSysId(sysId)
                if (refreshed.length === 0) {
                    return
                }

                setLoadState((current) => {
                    if (current.status !== 'ready') {
                        return current
                    }
                    return { ...current, approvals: refreshed }
                })
            })()
        }, DI_POLL_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [loadState, sysId, approvalService])

    const refreshApprovals = useCallback(async () => {
        if (!sysId || loadState.status !== 'ready') {
            await loadTicket()
            return
        }

        const refreshed = await approvalService.listByTicketSysId(sysId)
        if (refreshed.length === 0) {
            await loadTicket()
            return
        }

        setActiveApprovalSysId((current) =>
            refreshed.some((approval) => approval.sysId === current)
                ? current
                : pickInitialApprovalSysId(refreshed)
        )
        setLoadState({ ...loadState, approvals: refreshed })
    }, [sysId, loadState, approvalService, loadTicket])

    const handleApprove = useCallback(
        async (approvalSysId: string, values: TicketApprovalUpdateInput) => {
            if (loadState.status !== 'ready' || !sysId) {
                return
            }

            await approvalService.approve(approvalSysId, values)
            const refreshed = await approvalService.listByTicketSysId(sysId)
            const allApproved =
                refreshed.length > 0 && refreshed.every((approval) => Boolean(approval.approvedAt))

            if (allApproved) {
                window.location.href = ticketListUrl('approved')
                return
            }

            setActiveApprovalSysId(pickInitialApprovalSysId(refreshed))
            setLoadState({
                status: 'ready',
                ticket: loadState.ticket,
                attachments: loadState.attachments,
                approvals: refreshed,
            })
        },
        [approvalService, loadState, sysId]
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

    const { ticket, attachments, approvals } = loadState

    return (
        <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
            <div className="portal-approve-split">
                <ApproveFormPanel
                    ticket={ticket}
                    attachments={attachments}
                    approvals={approvals}
                    activeApprovalSysId={activeApprovalSysId}
                    onSelectApproval={setActiveApprovalSysId}
                    onRefresh={() => void refreshApprovals()}
                    onApprove={handleApprove}
                />
                <div className="portal-approve-right">
                    <ApproveAttachmentViewer attachments={attachments} />
                </div>
            </div>
        </ApprovePageChrome>
    )
}
