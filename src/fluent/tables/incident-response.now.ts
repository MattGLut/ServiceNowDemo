import '@servicenow/sdk/global'
import {
    Table,
    MultiLineTextColumn,
    ReferenceColumn,
    DateTimeColumn,
} from '@servicenow/sdk/core'

export const x_2058901_demo_incident_response = Table({
    name: 'x_2058901_demo_incident_response',
    label: 'Incident Response',
    display: 'response_text',
    allowWebServiceAccess: true,
    audit: true,
    schema: {
        incident: ReferenceColumn({
            label: 'Incident',
            referenceTable: 'incident',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        response_text: MultiLineTextColumn({
            label: 'Response',
            mandatory: true,
        }),
        responded_by: ReferenceColumn({
            label: 'Responded By',
            referenceTable: 'sys_user',
            readOnly: true,
        }),
        responded_at: DateTimeColumn({
            label: 'Responded At',
            readOnly: true,
        }),
    },
})
