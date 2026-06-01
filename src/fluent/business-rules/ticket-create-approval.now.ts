import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_create_approval = BusinessRule({
    $id: Now.ID['ticket-create-approval-br'],
    name: 'Create Ticket Approval on Insert',
    table: 'x_2058901_demo_ticket',
    when: 'after',
    action: ['insert'],
    active: true,
    order: 200,
    description: 'Creates an empty ticket approval row linked to the new ticket.',
    script: Now.include('../../server/business-rules/ticket-create-approval.server.js'),
})
