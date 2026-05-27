import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_incident_response_set_responder = BusinessRule({
    $id: Now.ID['incident-response-set-responder-br'],
    name: 'Set Responded By on Insert',
    table: 'x_2058901_demo_incident_response',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    description: 'Sets responded_by to the current user when a response is created via API or UI.',
    script: Now.include('../../server/business-rules/incident-response-set-responder.server.js'),
})
