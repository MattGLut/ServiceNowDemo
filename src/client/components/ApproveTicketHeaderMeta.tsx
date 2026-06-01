import React from 'react'
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
            <div className="portal-approve-header-dl-item">
                <dt>Workflow type</dt>
                <dd title={workflowLabel}>{workflowLabel}</dd>
            </div>
            <div className="portal-approve-header-dl-item">
                <dt>Submitted by</dt>
                <dd title={ticket.submittedByDisplay || undefined}>
                    {ticket.submittedByDisplay || '—'}
                </dd>
            </div>
            <div className="portal-approve-header-dl-item">
                <dt>Sys ID</dt>
                <dd className="font-mono" title={ticket.sysId}>
                    {ticket.sysId}
                </dd>
            </div>
        </dl>
    )
}
