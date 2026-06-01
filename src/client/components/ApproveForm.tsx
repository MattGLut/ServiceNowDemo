import React, { useCallback, useEffect, useState } from 'react'
import { LABEL_CLASS, INPUT_CLASS, BTN_PRIMARY } from './formStyles'
import { approvalRecordToFormValues } from '../services/TicketApprovalService'
import type { TicketApprovalRecord, TicketApprovalUpdateInput } from '../types/ticketApproval'

const READONLY_INPUT_CLASS = `${INPUT_CLASS} portal-approve-field-readonly`
const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[4.5rem] resize-y`

type ApproveFormProps = {
    approval: TicketApprovalRecord
    onApprove: (values: TicketApprovalUpdateInput) => Promise<void>
}

function formatAmountDisplay(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) {
        return ''
    }

    const numeric = Number.parseFloat(trimmed.replace(/,/g, ''))
    if (Number.isNaN(numeric)) {
        return trimmed
    }

    return numeric.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

type FieldProps = {
    label: string
    id: string
    value: string
    onChange: (value: string) => void
    readOnly?: boolean
    type?: string
}

function FormField({ label, id, value, onChange, readOnly = false, type = 'text' }: FieldProps) {
    return (
        <div>
            <label htmlFor={id} className={LABEL_CLASS}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                className={readOnly ? READONLY_INPUT_CLASS : INPUT_CLASS}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                readOnly={readOnly}
            />
        </div>
    )
}

type TextAreaFieldProps = {
    label: string
    id: string
    value: string
    onChange: (value: string) => void
}

function TextAreaField({ label, id, value, onChange }: TextAreaFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={LABEL_CLASS}>
                {label}
            </label>
            <textarea
                id={id}
                rows={3}
                className={TEXTAREA_CLASS}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

export default function ApproveForm({ approval, onApprove }: ApproveFormProps) {
    const [values, setValues] = useState<TicketApprovalUpdateInput>(() =>
        approvalRecordToFormValues(approval)
    )
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setValues(approvalRecordToFormValues(approval))
    }, [approval])

    const setField = useCallback(
        <K extends keyof TicketApprovalUpdateInput>(key: K, value: TicketApprovalUpdateInput[K]) => {
            setValues((current) => ({ ...current, [key]: value }))
        },
        []
    )

    const handleApprove = async () => {
        setSubmitting(true)
        setError(null)

        try {
            await onApprove(values)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    const subtotalDisplay = formatAmountDisplay(values.subtotalAmount)
    const totalDisplay = formatAmountDisplay(values.totalAmount)

    return (
        <div className="portal-approve-form">
            <section className="portal-approve-form-section">
                <h3 className="portal-approve-form-section-title">Invoice &amp; amounts</h3>
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Company Code"
                        id="company_code"
                        value={values.companyCode}
                        onChange={(v) => setField('companyCode', v)}
                    />
                    <FormField
                        label="Invoice Number"
                        id="invoice_number"
                        value={values.invoiceNumber}
                        onChange={(v) => setField('invoiceNumber', v)}
                    />
                    <FormField
                        label="Profit Center"
                        id="profit_center"
                        value={values.profitCenter}
                        onChange={(v) => setField('profitCenter', v)}
                    />
                    <FormField
                        label="Currency"
                        id="currency"
                        value={values.currency}
                        onChange={(v) => setField('currency', v)}
                    />
                    <FormField
                        label="Subtotal Amount"
                        id="subtotal_amount"
                        value={subtotalDisplay}
                        onChange={() => {}}
                        readOnly
                    />
                    <FormField
                        label="Tax Amount"
                        id="tax_amount"
                        value={values.taxAmount}
                        onChange={(v) => setField('taxAmount', v)}
                    />
                    <FormField
                        label="Total Amount"
                        id="total_amount"
                        value={totalDisplay}
                        onChange={() => {}}
                        readOnly
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
                <h3 className="portal-approve-form-section-title">Approver &amp; payment</h3>
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Approver Name"
                        id="approver_name"
                        value={values.approverName}
                        onChange={(v) => setField('approverName', v)}
                    />
                    <FormField
                        label="Approver ID"
                        id="approver_id"
                        value={values.approverId}
                        onChange={(v) => setField('approverId', v)}
                    />
                    <FormField
                        label="Payment Method"
                        id="payment_method"
                        value={values.paymentMethod}
                        onChange={(v) => setField('paymentMethod', v)}
                    />
                    <FormField
                        label="Req Payment Date"
                        id="req_payment_date"
                        type="date"
                        value={values.reqPaymentDate}
                        onChange={(v) => setField('reqPaymentDate', v)}
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
                <h3 className="portal-approve-form-section-title">Charge payee</h3>
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Charge Payee ID"
                        id="charge_payee_id"
                        value={values.chargePayeeId}
                        onChange={(v) => setField('chargePayeeId', v)}
                    />
                    <FormField
                        label="Charge Payee Name"
                        id="charge_payee_name"
                        value={values.chargePayeeName}
                        onChange={(v) => setField('chargePayeeName', v)}
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
                <h3 className="portal-approve-form-section-title">Notes</h3>
                <div className="portal-approve-form-notes">
                    <TextAreaField
                        label="Reviewer Notes"
                        id="reviewer_notes"
                        value={values.reviewerNotes}
                        onChange={(v) => setField('reviewerNotes', v)}
                    />
                    <TextAreaField
                        label="Supervisor Notes"
                        id="supervisor_notes"
                        value={values.supervisorNotes}
                        onChange={(v) => setField('supervisorNotes', v)}
                    />
                    <TextAreaField
                        label="Approval/Rejection Notes from Operator"
                        id="operator_notes"
                        value={values.operatorNotes}
                        onChange={(v) => setField('operatorNotes', v)}
                    />
                </div>
            </section>

            {error && (
                <p className="m-0 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}

            <div className="portal-intake-form-actions mt-auto pt-2 pb-4">
                <button
                    type="button"
                    className={BTN_PRIMARY}
                    disabled={submitting || Boolean(approval.approvedAt)}
                    onClick={() => void handleApprove()}
                >
                    {submitting ? 'Approving…' : approval.approvedAt ? 'Already approved' : 'Approve ticket'}
                </button>
            </div>
        </div>
    )
}
