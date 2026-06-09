import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ImmersiveLayout from './ImmersiveLayout'
import ProcessingPathBadge from './ProcessingPathBadge'
import WrtPayloadPanel from './WrtPayloadPanel'
import { TicketApprovalService } from '../services/TicketApprovalService'
import { TicketService } from '../services/TicketService'
import { formatFileSize, formatSubmittedAt } from '../utils/formatDateTime'
import { ticketStatusBadgeClass } from '../utils/ticketStatusStyle'
import { formatWorkflowTypeLabel } from '../types/workflowType'
import type { TicketApprovalRecord } from '../types/ticketApproval'
import type { TicketAttachment, TicketRecord } from '../types/ticket'

type TicketDetailPageProps = {
    sysId: string | null
}

type LoadState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'not-found' }
    | { status: 'ready'; ticket: TicketRecord; attachments: TicketAttachment[]; approvals: TicketApprovalRecord[] }

export default function TicketDetailPage({ sysId }: TicketDetailPageProps) {
    const ticketService = useMemo(() => new TicketService(), [])
    const approvalService = useMemo(() => new TicketApprovalService(), [])
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
            const approvals = await approvalService.listByTicketSysId(sysId)
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

    const { ticket, attachments, approvals } = loadState
    const payloadApprovals = approvals.filter(
        (approval) => approval.payloadStatus === 'ready' || approval.payloadStatus === 'failed'
    )

    return (
        <ImmersiveLayout title={ticket.title}>
            <div className="portal-detail-panel">
                <div className="portal-detail-header">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={ticketStatusBadgeClass(ticket.status)}>{ticket.statusLabel}</span>
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
                            <dt>Workflow Type</dt>
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
                                <dt>Contract Number</dt>
                                <dd>{ticket.externalId}</dd>
                            </div>
                        )}
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

                <section className="portal-detail-section">
                    <h3 className="portal-detail-section-title">WRT payloads</h3>
                    {payloadApprovals.length === 0 ? (
                        <p className="portal-detail-submessage">No WRT payloads built for this ticket yet.</p>
                    ) : (
                        <div className="portal-detail-wrt-payloads">
                            {payloadApprovals.map((approval) => (
                                <WrtPayloadPanel
                                    key={approval.sysId}
                                    approval={approval}
                                    segmentLabel={approval.workflowTypeCode || undefined}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </ImmersiveLayout>
    )
}
