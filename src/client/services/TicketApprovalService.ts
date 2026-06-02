import type {
    ApprovalFieldConfidence,
    ContractStatus,
    DiStatus,
    TicketApprovalFormValues,
    TicketApprovalRecord,
    TicketApprovalUpdateInput,
} from '../types/ticketApproval'

declare global {
    interface Window {
        g_ck: string
    }
}

type GlideFieldValue = string | { value?: string; display_value?: string } | undefined

function unwrapGlideField(field: GlideFieldValue): string {
    if (!field) {
        return ''
    }
    if (typeof field === 'string') {
        return field
    }
    return field.display_value || field.value || ''
}

function unwrapGlideValue(field: GlideFieldValue): string {
    if (!field) {
        return ''
    }
    if (typeof field === 'string') {
        return field
    }
    return field.value || field.display_value || ''
}

function formatGlideDateTime(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const APPROVAL_FIELDS =
    'sys_id,ticket,company_code,invoice_number,profit_center,currency,subtotal_amount,tax_amount,total_amount,approver_name,approver_id,payment_method,req_payment_date,charge_payee_id,charge_payee_name,reviewer_notes,supervisor_notes,operator_notes,approved_at,di_status,di_error,di_processed_at,contract_status,contract_error,contract_processed_at,field_confidence'

const DI_STATUSES: DiStatus[] = ['pending', 'complete', 'failed', 'skipped']
const CONTRACT_STATUSES: ContractStatus[] = ['pending', 'complete', 'failed', 'skipped']

function parseDiStatus(value: string): DiStatus | '' {
    if (DI_STATUSES.includes(value as DiStatus)) {
        return value as DiStatus
    }
    return ''
}

function parseContractStatus(value: string): ContractStatus | '' {
    if (CONTRACT_STATUSES.includes(value as ContractStatus)) {
        return value as ContractStatus
    }
    return ''
}

const CONFIDENCE_SNAKE_TO_CAMEL: Record<string, keyof TicketApprovalFormValues> = {
    company_code: 'companyCode',
    invoice_number: 'invoiceNumber',
    profit_center: 'profitCenter',
    currency: 'currency',
    subtotal_amount: 'subtotalAmount',
    tax_amount: 'taxAmount',
    total_amount: 'totalAmount',
    approver_name: 'approverName',
    approver_id: 'approverId',
    payment_method: 'paymentMethod',
    req_payment_date: 'reqPaymentDate',
    charge_payee_id: 'chargePayeeId',
    charge_payee_name: 'chargePayeeName',
    reviewer_notes: 'reviewerNotes',
    supervisor_notes: 'supervisorNotes',
    operator_notes: 'operatorNotes',
}

function toConfidenceScore(value: unknown): number | undefined {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return undefined
    }
    return value
}

function normalizeFieldConfidence(parsed: Record<string, unknown>): ApprovalFieldConfidence {
    const normalized: ApprovalFieldConfidence = {}

    for (const [key, raw] of Object.entries(parsed)) {
        const score = toConfidenceScore(raw)
        if (score === undefined) {
            continue
        }

        if (key === '_document') {
            normalized._document = score
            continue
        }

        const camelKey = CONFIDENCE_SNAKE_TO_CAMEL[key]
        if (camelKey) {
            normalized[camelKey] = score
        }
    }

    return normalized
}

function parseFieldConfidence(raw: GlideFieldValue): ApprovalFieldConfidence {
    const text = unwrapGlideField(raw)
    if (!text) {
        return {}
    }

    try {
        const parsed: unknown = JSON.parse(text)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {}
        }
        return normalizeFieldConfidence(parsed as Record<string, unknown>)
    } catch {
        return {}
    }
}

export function getFieldConfidenceScore(
    confidence: ApprovalFieldConfidence,
    key: keyof TicketApprovalFormValues
): number | undefined {
    return toConfidenceScore(confidence[key])
}

function mapApprovalRow(row: Record<string, GlideFieldValue>): TicketApprovalRecord {
    return {
        sysId: unwrapGlideValue(row.sys_id),
        ticketSysId: unwrapGlideValue(row.ticket),
        companyCode: unwrapGlideField(row.company_code),
        invoiceNumber: unwrapGlideField(row.invoice_number),
        profitCenter: unwrapGlideField(row.profit_center),
        currency: unwrapGlideField(row.currency),
        subtotalAmount: unwrapGlideField(row.subtotal_amount),
        taxAmount: unwrapGlideField(row.tax_amount),
        totalAmount: unwrapGlideField(row.total_amount),
        approverName: unwrapGlideField(row.approver_name),
        approverId: unwrapGlideField(row.approver_id),
        paymentMethod: unwrapGlideField(row.payment_method),
        reqPaymentDate: unwrapGlideValue(row.req_payment_date),
        chargePayeeId: unwrapGlideField(row.charge_payee_id),
        chargePayeeName: unwrapGlideField(row.charge_payee_name),
        reviewerNotes: unwrapGlideField(row.reviewer_notes),
        supervisorNotes: unwrapGlideField(row.supervisor_notes),
        operatorNotes: unwrapGlideField(row.operator_notes),
        approvedAt: unwrapGlideField(row.approved_at),
        diStatus: parseDiStatus(unwrapGlideValue(row.di_status)),
        diError: unwrapGlideField(row.di_error),
        diProcessedAt: unwrapGlideField(row.di_processed_at),
        contractStatus: parseContractStatus(unwrapGlideValue(row.contract_status)),
        contractError: unwrapGlideField(row.contract_error),
        contractProcessedAt: unwrapGlideField(row.contract_processed_at),
        fieldConfidence: parseFieldConfidence(row.field_confidence),
    }
}

function toApiPayload(input: TicketApprovalUpdateInput): Record<string, string> {
    const payload: Record<string, string> = {}

    const setIfPresent = (key: string, value: string) => {
        payload[key] = value
    }

    setIfPresent('company_code', input.companyCode.trim())
    setIfPresent('invoice_number', input.invoiceNumber.trim())
    setIfPresent('profit_center', input.profitCenter.trim())
    setIfPresent('currency', input.currency.trim())
    setIfPresent('subtotal_amount', input.subtotalAmount.trim())
    setIfPresent('tax_amount', input.taxAmount.trim())
    setIfPresent('total_amount', input.totalAmount.trim())
    setIfPresent('approver_name', input.approverName.trim())
    setIfPresent('approver_id', input.approverId.trim())
    setIfPresent('payment_method', input.paymentMethod.trim())
    setIfPresent('req_payment_date', input.reqPaymentDate.trim())
    setIfPresent('charge_payee_id', input.chargePayeeId.trim())
    setIfPresent('charge_payee_name', input.chargePayeeName.trim())
    setIfPresent('reviewer_notes', input.reviewerNotes.trim())
    setIfPresent('supervisor_notes', input.supervisorNotes.trim())
    setIfPresent('operator_notes', input.operatorNotes.trim())

    return payload
}

export class TicketApprovalService {
    private readonly tableName = 'x_2058901_demo_ticket_approval'

    private getHeaders(includeContentType = false): HeadersInit {
        const headers: HeadersInit = {
            Accept: 'application/json',
            'X-UserToken': window.g_ck,
        }

        if (includeContentType) {
            headers['Content-Type'] = 'application/json'
        }

        return headers
    }

    async getByTicketSysId(ticketSysId: string): Promise<TicketApprovalRecord | null> {
        const params = new URLSearchParams({
            sysparm_display_value: 'all',
            sysparm_exclude_reference_link: 'true',
            sysparm_fields: APPROVAL_FIELDS,
            sysparm_query: `ticket=${ticketSysId}`,
            sysparm_limit: '1',
        })

        const response = await fetch(`/api/now/table/${this.tableName}?${params.toString()}`, {
            headers: this.getHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
        }

        const { result } = await response.json()
        if (!Array.isArray(result) || result.length === 0) {
            return null
        }

        return mapApprovalRow(result[0] as Record<string, GlideFieldValue>)
    }

    async update(sysId: string, input: TicketApprovalUpdateInput): Promise<void> {
        const response = await fetch(`/api/now/table/${this.tableName}/${encodeURIComponent(sysId)}`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(toApiPayload(input)),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
        }
    }

    async approve(sysId: string, input: TicketApprovalUpdateInput): Promise<void> {
        const payload = {
            ...toApiPayload(input),
            approved_at: formatGlideDateTime(new Date()),
        }

        const response = await fetch(`/api/now/table/${this.tableName}/${encodeURIComponent(sysId)}`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
        }
    }
}

export function approvalRecordToFormValues(
    record: TicketApprovalRecord
): TicketApprovalUpdateInput {
    return {
        companyCode: record.companyCode,
        invoiceNumber: record.invoiceNumber,
        profitCenter: record.profitCenter,
        currency: record.currency,
        subtotalAmount: record.subtotalAmount,
        taxAmount: record.taxAmount,
        totalAmount: record.totalAmount,
        approverName: record.approverName,
        approverId: record.approverId,
        paymentMethod: record.paymentMethod,
        reqPaymentDate: record.reqPaymentDate,
        chargePayeeId: record.chargePayeeId,
        chargePayeeName: record.chargePayeeName,
        reviewerNotes: record.reviewerNotes,
        supervisorNotes: record.supervisorNotes,
        operatorNotes: record.operatorNotes,
    }
}

export function emptyApprovalFormValues(): TicketApprovalUpdateInput {
    return {
        companyCode: '',
        invoiceNumber: '',
        profitCenter: '',
        currency: '',
        subtotalAmount: '',
        taxAmount: '',
        totalAmount: '',
        approverName: '',
        approverId: '',
        paymentMethod: '',
        reqPaymentDate: '',
        chargePayeeId: '',
        chargePayeeName: '',
        reviewerNotes: '',
        supervisorNotes: '',
        operatorNotes: '',
    }
}
