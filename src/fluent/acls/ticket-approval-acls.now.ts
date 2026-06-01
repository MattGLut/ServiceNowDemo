import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_approval_read_acl = Acl({
    $id: Now.ID['ticket-approval-read-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket_approval',
    operation: 'read',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_approval_create_acl = Acl({
    $id: Now.ID['ticket-approval-create-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket_approval',
    operation: 'create',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_approval_write_acl = Acl({
    $id: Now.ID['ticket-approval-write-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket_approval',
    operation: 'write',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_ticket_approval_delete_acl = Acl({
    $id: Now.ID['ticket-approval-delete-acl'],
    type: 'record',
    table: 'x_2058901_demo_ticket_approval',
    operation: 'delete',
    roles: ['itil'],
    adminOverrides: true,
})
