import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_read_acl = Acl({
    $id: Now.ID['ticket-read-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket',
    operation: 'read',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_create_acl = Acl({
    $id: Now.ID['ticket-create-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket',
    operation: 'create',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_write_acl = Acl({
    $id: Now.ID['ticket-write-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket',
    operation: 'write',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_delete_acl = Acl({
    $id: Now.ID['ticket-delete-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket',
    operation: 'delete',
    roles: ['itil'],
    adminOverrides: true,
})
