import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ImmersiveLayout from './ImmersiveLayout'
import ProcessingPathBadge from './ProcessingPathBadge'
import { TicketService } from '../services/TicketService'
import { formatFileSize, formatSubmittedAt } from '../utils/formatDateTime'
import type { TicketAttachment, TicketRecord } from '../types/ticket'

type TicketDetailPageProps = {
    sysId: string | null
}

type LoadState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'not-found' }
    | { status: 'ready'; ticket: TicketRecord; attachments: TicketAttachment[] }

export default function TicketDetailPage({ sysId }: TicketDetailPageProps) {
    const ticketService = useMemo(() => new TicketService(), [])
    const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })

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
            <ImmersiveLayout>
                <div className="portal-detail-panel">
                    <p className="portal-detail-message">Loading ticket…</p>
                </div>
            </ImmersiveLayout>
        )
    }

    if (loadState.status === 'not-found') {
        return (
            <ImmersiveLayout>
                <div className="portal-detail-panel">
                    <p className="portal-detail-message">Ticket not found.</p>
                    <p className="portal-detail-submessage">Provide a valid sys_id in the URL.</p>
                </div>
            </ImmersiveLayout>
        )
    }

    if (loadState.status === 'error') {
        return (
            <ImmersiveLayout>
                <div className="portal-detail-panel">
                    <p className="portal-detail-message text-red-400">{loadState.message}</p>
                    <button type="button" className="portal-mobile-toggle mt-4" onClick={() => void loadTicket()}>
                        Retry
                    </button>
                </div>
            </ImmersiveLayout>
        )
    }

    const { ticket, attachments } = loadState

    return (
        <ImmersiveLayout title={ticket.title}>
            <div className="portal-detail-panel">
                <div className="portal-detail-header">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="portal-ticket-status">{ticket.statusLabel}</span>
                        <ProcessingPathBadge stpFlag={ticket.stpFlag} />
                    </div>
                    <p className="portal-detail-sys-id font-mono text-xs text-rh-muted">{ticket.sysId}</p>
                </div>

                <section className="portal-detail-section">
                    <h3 className="portal-detail-section-title">Details</h3>
                    <dl className="portal-detail-meta">
                        <div className="portal-detail-meta-row">
                            <dt>Submitted</dt>
                            <dd>{formatSubmittedAt(ticket.submittedAt)}</dd>
                        </div>
                        <div className="portal-detail-meta-row">
                            <dt>Submitted by</dt>
                            <dd>{ticket.submittedByDisplay || '—'}</dd>
                        </div>
                        <div className="portal-detail-meta-row">
                            <dt>Processing path</dt>
                            <dd>
                                {ticket.stpFlag
                                    ? 'Straight-through (STP)'
                                    : 'Document intelligence (DI)'}
                            </dd>
                        </div>
                    </dl>
                    <div className="portal-detail-description-block">
                        <h4 className="portal-detail-label">Description</h4>
                        {ticket.description.trim() ? (
                            <p className="portal-detail-description">{ticket.description}</p>
                        ) : (
                            <p className="portal-detail-description portal-detail-description-empty">No description.</p>
                        )}
                    </div>
                </section>

                <section className="portal-detail-section">
                    <h3 className="portal-detail-section-title">Attachments</h3>
                    {attachments.length === 0 ? (
                        <p className="portal-detail-submessage">No files attached.</p>
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
                                            {attachment.createdAt && (
                                                <> · {formatSubmittedAt(attachment.createdAt)}</>
                                            )}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="portal-detail-section portal-detail-future">
                    <h3 className="portal-detail-section-title">Document intelligence review</h3>
                    <p className="portal-detail-submessage">
                        Coming in a later phase: extracted fields for human validation and approval, plus a{' '}
                        <strong className="text-rh-text">Retry extraction</strong> action.
                    </p>
                </section>
            </div>
        </ImmersiveLayout>
    )
}
