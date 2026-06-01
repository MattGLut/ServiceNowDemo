import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import ProcessingPathBadge from './ProcessingPathBadge'
import { BTN_PRIMARY } from './formStyles'
import { TicketService } from '../services/TicketService'
import { formatFileSize, formatSubmittedAt } from '../utils/formatDateTime'
import { formatWorkflowTypeLabel } from '../types/workflowType'
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
                    {ticket && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="portal-ticket-status">{ticket.statusLabel}</span>
                            <ProcessingPathBadge stpFlag={ticket.stpFlag} />
                            <span className="font-mono text-xs text-rh-muted">{ticket.sysId}</span>
                        </div>
                    )}
                </header>
                <div className="portal-approve-workspace">
                    <div className="portal-approve-panel">{children}</div>
                </div>
            </div>
        </PortalLayout>
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
                <p className="portal-detail-message m-0">Loading ticket…</p>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'not-found') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <p className="portal-detail-message m-0">Ticket not found.</p>
                <p className="portal-detail-submessage mt-2">
                    Open a ticket from the tickets list or provide a valid draft ticket sys_id.
                </p>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'not-draft') {
        const { ticket } = loadState

        return (
            <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
                <p className="portal-detail-message m-0">This ticket is not awaiting approval.</p>
                <p className="portal-detail-submessage mt-2">
                    Only draft tickets can be reviewed here. Current status:{' '}
                    <strong className="text-rh-text">{ticket.statusLabel}</strong>.
                </p>
                <a href={backHref} className={`${BTN_PRIMARY} mt-6 inline-flex`}>
                    Return to tickets
                </a>
            </ApprovePageChrome>
        )
    }

    if (loadState.status === 'error') {
        return (
            <ApprovePageChrome backHref={backHref} title="Review ticket">
                <p className="portal-detail-message m-0 text-red-400">{loadState.message}</p>
                <button type="button" className="portal-mobile-toggle mt-4" onClick={() => void loadTicket()}>
                    Retry
                </button>
            </ApprovePageChrome>
        )
    }

    const { ticket, attachments } = loadState

    return (
        <ApprovePageChrome backHref={backHref} title={ticket.title} ticket={ticket}>
            <div className="portal-approve-grid">
                <section className="portal-approve-section">
                    <h2 className="portal-detail-section-title">Submitted ticket</h2>
                    <dl className="portal-detail-meta">
                        <div className="portal-detail-meta-row">
                            <dt>Submitted</dt>
                            <dd>{formatSubmittedAt(ticket.submittedAt)}</dd>
                        </div>
                        <div className="portal-detail-meta-row">
                            <dt>Workflow type</dt>
                            <dd>
                                {ticket.workflowTypeCode && ticket.workflowTypeName
                                    ? formatWorkflowTypeLabel({
                                          code: ticket.workflowTypeCode,
                                          name: ticket.workflowTypeName,
                                      })
                                    : ticket.workflowTypeName || '—'}
                            </dd>
                        </div>
                        {ticket.externalId && (
                            <div className="portal-detail-meta-row">
                                <dt>Contract number</dt>
                                <dd>{ticket.externalId}</dd>
                            </div>
                        )}
                        <div className="portal-detail-meta-row">
                            <dt>Submitted by</dt>
                            <dd>{ticket.submittedByDisplay || '—'}</dd>
                        </div>
                    </dl>
                    <div className="portal-detail-description-block">
                        <h3 className="portal-detail-label">Description</h3>
                        {ticket.description.trim() ? (
                            <p className="portal-detail-description">{ticket.description}</p>
                        ) : (
                            <p className="portal-detail-description portal-detail-description-empty">
                                No description.
                            </p>
                        )}
                    </div>
                </section>

                <section className="portal-approve-section">
                    <h2 className="portal-detail-section-title">Attachments</h2>
                    {attachments.length === 0 ? (
                        <p className="portal-detail-submessage m-0">No files attached.</p>
                    ) : (
                        <ul className="portal-detail-attachments">
                            {attachments.map((attachment) => (
                                <li key={attachment.sysId} className="portal-detail-attachment-item">
                                    <a
                                        href={attachment.downloadUrl}
                                        className="portal-detail-attachment-link"
                                        download={attachment.fileName}
                                    >
                                        <span className="portal-detail-attachment-name">{attachment.fileName}</span>
                                        <span className="portal-detail-attachment-meta">
                                            {formatFileSize(attachment.sizeBytes)}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <section className="portal-approve-section min-h-[12rem] flex-1">
                <h2 className="portal-detail-section-title">Approval form</h2>
                <p className="portal-detail-submessage m-0 mb-4">
                    Placeholder for AI-filled approval fields. Approvers will validate extracted values and confirm
                    before the ticket moves to Approved status.
                </p>
                <div className="min-h-[8rem] flex-1 rounded-lg border border-dashed border-rh-border bg-rh-bg/50 p-4">
                    <p className="m-0 text-sm text-rh-muted">
                        Approval fields (contract details, amounts, vendor, etc.) will appear here after document
                        intelligence processing.
                    </p>
                </div>
                <div className="portal-intake-form-actions mt-6">
                    <button type="button" className={BTN_PRIMARY} disabled title="Coming soon">
                        Approve ticket
                    </button>
                </div>
            </section>
        </ApprovePageChrome>
    )
}
