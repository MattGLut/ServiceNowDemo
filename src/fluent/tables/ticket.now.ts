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
        request_type: ChoiceColumn({
            label: 'Request Type',
            default: 'general',
            choices: {
                general: { label: 'General request' },
                document: { label: 'Document submission' },
                pickup: { label: 'Pickup request' },
            },
        }),
        external_id: StringColumn({
            label: 'External Reference',
            maxLength: 50,
        }),
        stp_flag: BooleanColumn({
            label: 'STP',
            default: false,
        }),
        status: ChoiceColumn({
            label: 'Status',
            readOnly: true,
            default: 'submitted',
            choices: {
                submitted: { label: 'Submitted' },
                stp_queued: { label: 'STP Queued' },
                di_processing: { label: 'DI Processing' },
                pending_review: { label: 'Pending Review' },
                approved: { label: 'Approved' },
                ready_for_pickup: { label: 'Ready for Pickup' },
                picked_up: { label: 'Picked Up' },
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
