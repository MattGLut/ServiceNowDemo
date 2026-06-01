import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    MultiLineTextColumn,
    ReferenceColumn,
    DateColumn,
    DateTimeColumn,
    DecimalColumn,
} from '@servicenow/sdk/core'

export const x_2058901_demo_ticket_approval = Table({
    name: 'x_2058901_demo_ticket_approval',
    label: 'Ticket Approval',
    display: 'invoice_number',
    allowWebServiceAccess: true,
    audit: true,
    schema: {
        ticket: ReferenceColumn({
            label: 'Ticket',
            referenceTable: 'x_2058901_demo_ticket',
            mandatory: true,
        }),
        company_code: StringColumn({
            label: 'Company Code',
            maxLength: 40,
        }),
        invoice_number: StringColumn({
            label: 'Invoice Number',
            maxLength: 80,
        }),
        profit_center: StringColumn({
            label: 'Profit Center',
            maxLength: 40,
        }),
        currency: StringColumn({
            label: 'Currency',
            maxLength: 10,
        }),
        subtotal_amount: DecimalColumn({
            label: 'Subtotal Amount',
        }),
        tax_amount: DecimalColumn({
            label: 'Tax Amount',
        }),
        total_amount: DecimalColumn({
            label: 'Total Amount',
        }),
        approver_name: StringColumn({
            label: 'Approver Name',
            maxLength: 200,
        }),
        approver_id: StringColumn({
            label: 'Approver ID',
            maxLength: 40,
        }),
        payment_method: StringColumn({
            label: 'Payment Method',
            maxLength: 20,
        }),
        req_payment_date: DateColumn({
            label: 'Req Payment Date',
        }),
        charge_payee_id: StringColumn({
            label: 'Charge Payee ID',
            maxLength: 40,
        }),
        charge_payee_name: StringColumn({
            label: 'Charge Payee Name',
            maxLength: 200,
        }),
        reviewer_notes: MultiLineTextColumn({
            label: 'Reviewer Notes',
        }),
        supervisor_notes: MultiLineTextColumn({
            label: 'Supervisor Notes',
        }),
        operator_notes: MultiLineTextColumn({
            label: 'Approval/Rejection Notes from Operator',
        }),
        approved_at: DateTimeColumn({
            label: 'Approved At',
        }),
    },
})
