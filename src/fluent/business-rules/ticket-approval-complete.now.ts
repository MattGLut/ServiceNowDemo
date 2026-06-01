import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_approval_complete = BusinessRule({
    $id: Now.ID['ticket-approval-complete-br'],
    name: 'Set Ticket Approved When Approval Complete',
    table: 'x_2058901_demo_ticket_approval',
    when: 'after',
    action: ['update'],
    active: true,
    order: 100,
    description: 'When approved_at is set on the approval record, sets the parent ticket status to approved.',
    script: Now.include('../../server/business-rules/ticket-approval-complete.server.js'),
})
