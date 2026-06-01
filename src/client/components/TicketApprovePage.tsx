import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ApproveAttachmentViewer from './ApproveAttachmentViewer'
import ApproveTicketHeaderMeta from './ApproveTicketHeaderMeta'
import PortalLayout from './PortalLayout'
import { BTN_PRIMARY } from './formStyles'
import { TicketService } from '../services/TicketService'
import { ticketListUrl } from '../utils/ticketListFilter'
import type { TicketAttachment, TicketRecord } from '../types/ticket'

type TicketApprovePageProps = {
    sysId: string | null
}

type LoadState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'not-found' }
    | { status: 'not-draft'; ticket: TicketRecord }
    | { status: 'ready'; ticket: TicketRecord; attachments: TicketAttachment[] }

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
                    <div className="portal-approve-toolbar-top">
                        <a href={backHref} className="portal-approve-back">
                            ← Back to tickets
                        </a>
                        {title && <h1 className="portal-approve-title">{title}</h1>}
                    </div>
                    {ticket && <ApproveTicketHeaderMeta ticket={ticket} />}
                </header>
                <div className="portal-approve-workspace">{children}</div>
            </div>
        </PortalLayout>
    )
}

function ApproveFormPanel() {
    return (
        <section className="portal-approve-left">
            <h2 className="portal-detail-section-title">Approval form</h2>
            <p className="portal-detail-submessage m-0">
                Placeholder for AI-filled approval fields. Approvers will validate extracted values and confirm
                before the ticket moves to Approved status.
            </p>
            <div className="portal-approve-form-placeholder">
                <p className="m-0 text-sm text-rh-muted">
                    Approval fields (contract details, amounts, vendor, etc.) will appear here after document
                    intelligence processing.
                </p>
            </div>
            <div className="portal-intake-form-actions mt-auto pt-6">
                <button type="button" className={BTN_PRIMARY} disabled title="Coming soon">
                    Approve ticket
                </button>
            </div>
        </section>
    )
}

export default function TicketApprovePage({ sysId }: TicketApprovePageProps) {
    const ticketService = useMemo(() => new TicketService(), [])
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

            const attachments = await ticketService.listAttachments(sysId)
            setLoadState({ status: 'ready', ticket, attachments })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setLoadState({ status: 'error', message })
            console.error(err)
        }
    }, [sysId, ticketService])

    useEffect(() => {
        void loadTicket()
    }, [loadTicket])

    if (loadState.status === 'loading') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <div className="portal-approve-message-panel">
                    <p className="portal-detail-message m-0">Loading ticket…</p>
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

    const { ticket, attachments } = loadState

    return (
        <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
            <div className="portal-approve-split">
                <ApproveFormPanel />
                <div className="portal-approve-right">
                    <ApproveAttachmentViewer attachments={attachments} />
                </div>
            </div>
        </ApprovePageChrome>
    )
}
