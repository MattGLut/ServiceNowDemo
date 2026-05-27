import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

export const x_2058901_demo_incident_complaint_read_acl = Acl({
    $id: Now.ID['incident-complaint-read-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_complaint',
    operation: 'read',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_complaint_create_acl = Acl({
    $id: Now.ID['incident-complaint-create-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_complaint',
    operation: 'create',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_complaint_write_acl = Acl({
    $id: Now.ID['incident-complaint-write-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_complaint',
    operation: 'write',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_incident_complaint_delete_acl = Acl({
    $id: Now.ID['incident-complaint-delete-acl'],
    type: 'record',
    table: 'x_2058901_demo_incident_complaint',
    operation: 'delete',
    roles: ['itil'],
    adminOverrides: true,
})
