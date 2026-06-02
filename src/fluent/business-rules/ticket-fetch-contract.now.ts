import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_fetch_contract = BusinessRule({
    $id: Now.ID['ticket-fetch-contract-br'],
    name: 'Fetch contract data on ticket insert',
    table: 'x_2058901_demo_ticket',
    when: 'async',
    action: ['insert'],
    active: true,
    order: 300,
    description:
        'Async: loads UWF Contract Details for ticket external_id and maps values onto the linked approval row (outbound HTTP requires async).',
    script: Now.include('../../server/business-rules/ticket-fetch-contract.server.js'),
})
