import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_approval_build_rtm_payload = BusinessRule({
    $id: Now.ID['ticket-approval-build-rtm-payload-br'],
    name: 'Build RTM payload on approval',
    table: 'x_2058901_demo_ticket_approval',
    when: 'after',
    action: ['update'],
    active: true,
    order: 50,
    description:
        'When approved_at is set, validates and writes RtmData JSON to rtm_payload_json on the approval row.',
    script: Now.include('../../server/business-rules/ticket-approval-build-rtm-payload.server.js'),
})
