import '@servicenow/sdk/global'
import { Table, StringColumn } from '@servicenow/sdk/core'

export const x_2058901_demo_workflow_type = Table({
    name: 'x_2058901_demo_workflow_type',
    label: 'Workflow Type',
    display: 'name',
    allowWebServiceAccess: true,
    audit: true,
    schema: {
        code: StringColumn({
            label: 'Code',
            mandatory: true,
            maxLength: 40,
            unique: true,
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            maxLength: 100,
        }),
    },
})
