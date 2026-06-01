import React from 'react'
import { formatSubmittedAt } from '../utils/formatDateTime'
import { formatWorkflowTypeLabel } from '../types/workflowType'
import type { TicketRecord } from '../types/ticket'

type ApproveTicketHeaderMetaProps = {
    ticket: TicketRecord
}

export default function ApproveTicketHeaderMeta({ ticket }: ApproveTicketHeaderMetaProps) {
    const workflowLabel =
        ticket.workflowTypeCode && ticket.workflowTypeName
            ? formatWorkflowTypeLabel({
                  code: ticket.workflowTypeCode,
                  name: ticket.workflowTypeName,
              })
            : ticket.workflowTypeName || '—'

    return (
        <div className="portal-approve-header-meta">
            <p className="portal-approve-header-summary">
                {ticket.externalId && (
                    <span>
                        Contract <span className="text-rh-text">{ticket.externalId}</span>
                    </span>
                )}
                {ticket.externalId && ticket.submittedAt && <span aria-hidden="true"> · </span>}
                {ticket.submittedAt && (
                    <span>Submitted {formatSubmittedAt(ticket.submittedAt)}</span>
                )}
            </p>

            <details className="portal-approve-details">
                <summary className="portal-approve-details-summary">Ticket details</summary>
                <div className="portal-approve-details-body">
                    <dl className="portal-approve-header-dl">
                        <div>
                            <dt>Workflow type</dt>
                            <dd>{workflowLabel}</dd>
                        </div>
                        <div>
                            <dt>Submitted by</dt>
                            <dd>{ticket.submittedByDisplay || '—'}</dd>
                        </div>
                        <div className="lg:col-span-2">
                            <dt>Sys ID</dt>
                            <dd className="font-mono text-xs">{ticket.sysId}</dd>
                        </div>
                    </dl>
                    {ticket.description.trim() ? (
                        <p className="portal-approve-header-description">{ticket.description}</p>
                    ) : (
                        <p className="portal-approve-header-description portal-detail-description-empty m-0">
                            No description.
                        </p>
                    )}
                </div>
            </details>
        </div>
    )
}
