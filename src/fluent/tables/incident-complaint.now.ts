import '@servicenow/sdk/global'
import {
    Table,
    MultiLineTextColumn,
    ReferenceColumn,
    DateTimeColumn,
} from '@servicenow/sdk/core'

export const x_2058901_demo_incident_complaint = Table({
    name: 'x_2058901_demo_incident_complaint',
    label: 'Incident Complaint',
    display: 'complaint_text',
    allowWebServiceAccess: true,
    audit: true,
    schema: {
        incident: ReferenceColumn({
            label: 'Incident',
            referenceTable: 'incident',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        complaint_text: MultiLineTextColumn({
            label: 'Complaint',
            mandatory: true,
        }),
        filed_by: ReferenceColumn({
            label: 'Filed By',
            referenceTable: 'sys_user',
            readOnly: true,
        }),
        filed_at: DateTimeColumn({
            label: 'Filed At',
            readOnly: true,
        }),
    },
})
