import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_incident_complaint_set_filer = BusinessRule({
    $id: Now.ID['incident-complaint-set-filer-br'],
    name: 'Set Filed By on Insert',
    table: 'x_2058901_demo_incident_complaint',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    description: 'Sets filed_by to the current user when a complaint is created via API or UI.',
    script: Now.include('../../server/business-rules/incident-complaint-set-filer.server.js'),
})
