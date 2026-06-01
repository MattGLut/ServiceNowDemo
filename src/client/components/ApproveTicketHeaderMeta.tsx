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
        <dl className="portal-approve-header-dl">
            {ticket.externalId && (
                <div className="portal-approve-header-dl-item">
                    <dt>Contract</dt>
                    <dd title={ticket.externalId}>{ticket.externalId}</dd>
                </div>
            )}
            {ticket.submittedAt && (
                <div className="portal-approve-header-dl-item">
                    <dt>Submitted</dt>
                    <dd>{formatSubmittedAt(ticket.submittedAt)}</dd>
                </div>
            )}
            <div className="portal-approve-header-dl-item portal-approve-header-dl-item-wide">
                <dt>Workflow type</dt>
                <dd title={workflowLabel}>{workflowLabel}</dd>
            </div>
            <div className="portal-approve-header-dl-item">
                <dt>Submitted by</dt>
                <dd title={ticket.submittedByDisplay || undefined}>
                    {ticket.submittedByDisplay || '—'}
                </dd>
            </div>
            <div className="portal-approve-header-dl-item portal-approve-header-dl-item-sysid">
                <dt>Sys ID</dt>
                <dd className="font-mono" title={ticket.sysId}>
                    {ticket.sysId}
                </dd>
            </div>
        </dl>
    )
}
