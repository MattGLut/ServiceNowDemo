import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

export const x_2058901_demo_incident_response_read_acl = Acl({
    $id: Now.ID['incident-response-read-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_response',
    operation: 'read',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_response_create_acl = Acl({
    $id: Now.ID['incident-response-create-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_response',
    operation: 'create',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_response_write_acl = Acl({
    $id: Now.ID['incident-response-write-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_response',
    operation: 'write',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_response_delete_acl = Acl({
    $id: Now.ID['incident-response-delete-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_response',
    operation: 'delete',
    roles: ['itil'],
    adminOverrides: true,
})
