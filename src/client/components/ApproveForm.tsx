import React, { useCallback, useEffect, useState } from 'react'
import ConfidenceHint from './ConfidenceHint'
import { LABEL_CLASS, INPUT_CLASS, BTN_PRIMARY } from './formStyles'
import { approvalRecordToFormValues, getFieldConfidenceScore } from '../services/TicketApprovalService'
import { APPROVAL_FIELD_SOURCE_CLASS, type ApprovalFieldSource } from '../types/approvalFieldSource'
import type { TicketApprovalFormValues, TicketApprovalRecord, TicketApprovalUpdateInput } from '../types/ticketApproval'

/** Same as INPUT_CLASS but without bg — source classes supply tinted backgrounds. */
const APPROVE_INPUT_BASE =
    'w-full rounded-lg border px-3 py-2.5 text-sm text-rh-text placeholder:text-rh-muted focus:outline-none focus:ring-2'

const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[4.5rem] resize-y`

type ApproveFormProps = {
    approval: TicketApprovalRecord
    extracting?: boolean
    segmentLabel?: string
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

function inputClassForSource(source: ApprovalFieldSource, readOnly: boolean): string {
    const sourceClass = APPROVAL_FIELD_SOURCE_CLASS[source]
    const parts = [APPROVE_INPUT_BASE, sourceClass]
    if (readOnly) {
        parts.push('portal-approve-field-readonly')
    }
    return parts.filter(Boolean).join(' ')
}

type FieldProps = {
    label: string
    id: string
    value: string
    onChange: (value: string) => void
    source: ApprovalFieldSource
    readOnly?: boolean
    type?: string
    confidence?: number
}

function FormField({
    label,
    id,
    value,
    onChange,
    source,
    readOnly = false,
    type = 'text',
    confidence,
}: FieldProps) {
    return (
        <div>
            <div className="portal-approve-field-label-row">
                <label htmlFor={id} className={LABEL_CLASS}>
                    {label}
                </label>
                {confidence != null && <ConfidenceHint score={confidence} fieldLabel={label} />}
            </div>
            <input
                id={id}
                type={type}
                className={inputClassForSource(source, readOnly)}
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

export default function ApproveForm({
    approval,
    extracting = false,
    segmentLabel,
    onApprove,
}: ApproveFormProps) {
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
    const fieldConfidence = approval.fieldConfidence

    const confidenceFor = (key: keyof TicketApprovalFormValues) =>
        getFieldConfidenceScore(fieldConfidence, key)

    const approveLabel = approval.approvedAt
        ? 'Already approved'
        : segmentLabel
          ? `Approve ${segmentLabel} segment`
          : 'Approve ticket'

    return (
        <div className="portal-approve-form">
            <section className="portal-approve-form-section">
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Company Code"
                        id="company_code"
                        source="contract"
                        value={values.companyCode}
                        onChange={(v) => setField('companyCode', v)}
                    />
                    <FormField
                        label="Invoice Number"
                        id="invoice_number"
                        source="docIntel"
                        value={values.invoiceNumber}
                        onChange={(v) => setField('invoiceNumber', v)}
                        confidence={confidenceFor('invoiceNumber')}
                    />
                    <FormField
                        label="Profit Center"
                        id="profit_center"
                        source="contract"
                        value={values.profitCenter}
                        onChange={(v) => setField('profitCenter', v)}
                    />
                    <FormField
                        label="Currency"
                        id="currency"
                        source="docIntel"
                        value={values.currency}
                        onChange={(v) => setField('currency', v)}
                        confidence={confidenceFor('currency')}
                    />
                    <FormField
                        label="Subtotal Amount"
                        id="subtotal_amount"
                        source="docIntel"
                        value={subtotalDisplay}
                        onChange={() => {}}
                        readOnly
                        confidence={confidenceFor('subtotalAmount')}
                    />
                    <FormField
                        label="Tax Amount"
                        id="tax_amount"
                        source="docIntel"
                        value={values.taxAmount}
                        onChange={(v) => setField('taxAmount', v)}
                        confidence={confidenceFor('taxAmount')}
                    />
                    <FormField
                        label="Total Amount"
                        id="total_amount"
                        source="docIntel"
                        value={totalDisplay}
                        onChange={() => {}}
                        readOnly
                        confidence={confidenceFor('totalAmount')}
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Approver Name"
                        id="approver_name"
                        source="contract"
                        value={values.approverName}
                        onChange={(v) => setField('approverName', v)}
                    />
                    <FormField
                        label="Approver ID"
                        id="approver_id"
                        source="contract"
                        value={values.approverId}
                        onChange={(v) => setField('approverId', v)}
                    />
                    <FormField
                        label="Payment Method"
                        id="payment_method"
                        source="contract"
                        value={values.paymentMethod}
                        onChange={(v) => setField('paymentMethod', v)}
                    />
                    <FormField
                        label="Req Payment Date"
                        id="req_payment_date"
                        source="docIntel"
                        type="date"
                        value={values.reqPaymentDate}
                        onChange={(v) => setField('reqPaymentDate', v)}
                        confidence={confidenceFor('reqPaymentDate')}
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
                <div className="portal-approve-form-grid">
                    <FormField
                        label="Charge Payee ID"
                        id="charge_payee_id"
                        source="vendor"
                        value={values.chargePayeeId}
                        onChange={(v) => setField('chargePayeeId', v)}
                    />
                    <FormField
                        label="Charge Payee Name"
                        id="charge_payee_name"
                        source="docIntel"
                        value={values.chargePayeeName}
                        onChange={(v) => setField('chargePayeeName', v)}
                        confidence={confidenceFor('chargePayeeName')}
                    />
                </div>
            </section>

            <section className="portal-approve-form-section">
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
                    disabled={submitting || extracting || Boolean(approval.approvedAt)}
                    onClick={() => void handleApprove()}
                >
                    {submitting ? 'Approving…' : approveLabel}
                </button>
            </div>
        </div>
    )
}
