import React from 'react'
import ProcessingPathBadge from './ProcessingPathBadge'
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
            <div className="portal-approve-header-meta-badges">
                <span className="portal-ticket-status">{ticket.statusLabel}</span>
                <ProcessingPathBadge stpFlag={ticket.stpFlag} />
                <span className="font-mono text-xs text-rh-muted">{ticket.sysId}</span>
            </div>
            <dl className="portal-approve-header-dl">
                <div>
                    <dt>Submitted</dt>
                    <dd>{formatSubmittedAt(ticket.submittedAt)}</dd>
                </div>
                <div>
                    <dt>Workflow type</dt>
                    <dd>{workflowLabel}</dd>
                </div>
                <div>
                    <dt>Contract number</dt>
                    <dd>{ticket.externalId || '—'}</dd>
                </div>
                <div>
                    <dt>Submitted by</dt>
                    <dd>{ticket.submittedByDisplay || '—'}</dd>
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
    )
}
