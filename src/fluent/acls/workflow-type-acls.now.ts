import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

export const x_2058901_demo_workflow_type_read_acl = Acl({
    $id: Now.ID['workflow-type-read-acl'],
    type: 'record',
    table: 'x_2058901_demo_workflow_type',
    operation: 'read',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_workflow_type_write_acl = Acl({
    $id: Now.ID['workflow-type-write-acl'],
    type: 'record',
    table: 'x_2058901_demo_workflow_type',
    operation: 'write',
    roles: ['admin'],
    adminOverrides: true,
})

export const x_2058901_demo_workflow_type_create_acl = Acl({
    $id: Now.ID['workflow-type-create-acl'],
    type: 'record',
    table: 'x_2058901_demo_workflow_type',
    operation: 'create',
    roles: ['admin'],
    adminOverrides: true,
})

export const x_2058901_demo_workflow_type_delete_acl = Acl({
    $id: Now.ID['workflow-type-delete-acl'],
    type: 'record',
    table: 'x_2058901_demo_workflow_type',
    operation: 'delete',
    roles: ['admin'],
    adminOverrides: true,
})
