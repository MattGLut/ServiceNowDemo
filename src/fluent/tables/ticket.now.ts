import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    MultiLineTextColumn,
    ReferenceColumn,
    DateTimeColumn,
    ChoiceColumn,
    BooleanColumn,
} from '@servicenow/sdk/core'

export const x_2058901_demo_ticket = Table({
    name: 'x_2058901_demo_ticket',
    label: 'Ticket',
    display: 'title',
    allowWebServiceAccess: true,
    audit: true,
    schema: {
        title: StringColumn({
            label: 'Title',
            mandatory: true,
            maxLength: 200,
        }),
        description: MultiLineTextColumn({
            label: 'Description',
        }),
        workflow_type: ReferenceColumn({
            label: 'Workflow Type',
            referenceTable: 'x_2058901_demo_workflow_type',
            mandatory: true,
        }),
        external_id: StringColumn({
            label: 'Contract Number',
            mandatory: true,
            maxLength: 50,
        }),
        stp_flag: BooleanColumn({
            label: 'STP',
            default: false,
        }),
        status: ChoiceColumn({
            label: 'Status',
            readOnly: true,
            default: 'draft',
            choices: {
                draft: { label: 'Draft' },
                approved: { label: 'Approved' },
                posted: { label: 'Posted' },
            },
        }),
        submitted_by: ReferenceColumn({
            label: 'Submitted By',
            referenceTable: 'sys_user',
            readOnly: true,
        }),
        submitted_at: DateTimeColumn({
            label: 'Submitted At',
            readOnly: true,
        }),
    },
})
