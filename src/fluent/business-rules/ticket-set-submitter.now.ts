import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_set_submitter = BusinessRule({
    $id: Now.ID['ticket-set-submitter-br'],
    name: 'Set Submitted By on Insert',
    table: 'x_2058901_demo_ticket',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    description: 'Sets submitted_by to the current user when a ticket is created.',
    script: Now.include('../../server/business-rules/ticket-set-submitter.server.js'),
})
