import { getCurrentUserSysId } from '../utils/currentUser'
import type { TicketCreateInput, TicketCreateResult, TicketRecord, TicketStatus } from '../types/ticket'

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

export class TicketService {
    private readonly tableName = 'x_2058901_demo_ticket'

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

    async create(input: TicketCreateInput): Promise<TicketCreateResult> {
        const payload: Record<string, string> = {
            title: input.title.trim(),
            description: input.description.trim(),
            status: 'submitted',
            submitted_at: formatGlideDateTime(new Date()),
        }

        const currentUserSysId = getCurrentUserSysId()
        if (currentUserSysId) {
            payload.submitted_by = currentUserSysId
        }

        const response = await fetch(`/api/now/table/${this.tableName}`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
        }

        const { result } = await response.json()
        const sysId = typeof result.sys_id === 'object' ? result.sys_id.value : result.sys_id

        return {
            sysId,
            title: input.title.trim(),
        }
    }

    async uploadAttachment(ticketSysId: string, file: File): Promise<void> {
        const formData = new FormData()
        formData.append('table_name', this.tableName)
        formData.append('table_sys_id', ticketSysId)
        formData.append('file_name', file.name)
        formData.append('uploadFile', file)

        const response = await fetch('/api/now/attachment/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-UserToken': window.g_ck,
            },
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `Failed to upload ${file.name}`)
        }
    }

    async uploadAttachments(ticketSysId: string, files: File[]): Promise<void> {
        for (const file of files) {
            await this.uploadAttachment(ticketSysId, file)
        }
    }

    async list(limit = 50): Promise<TicketRecord[]> {
        const params = new URLSearchParams({
            sysparm_display_value: 'all',
            sysparm_exclude_reference_link: 'true',
            sysparm_fields: 'sys_id,title,description,status,submitted_at,submitted_by',
            sysparm_limit: String(limit),
            sysparm_query: 'ORDERBYDESCsubmitted_at',
        })

        const currentUserSysId = getCurrentUserSysId()
        if (currentUserSysId) {
            params.set('sysparm_query', `submitted_by=${currentUserSysId}^ORDERBYDESCsubmitted_at`)
        }

        const response = await fetch(`/api/now/table/${this.tableName}?${params.toString()}`, {
            headers: this.getHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
        }

        const { result } = await response.json()
        if (!Array.isArray(result)) {
            return []
        }

        return result.map((row: Record<string, GlideFieldValue>) => {
            const sysId = unwrapGlideValue(row.sys_id)
            const statusValue = unwrapGlideValue(row.status) as TicketStatus
            const statusLabel = unwrapGlideField(row.status) || statusValue

            return {
                sysId,
                title: unwrapGlideField(row.title),
                description: unwrapGlideField(row.description),
                status: statusValue,
                statusLabel,
                submittedAt: unwrapGlideField(row.submitted_at),
                submittedByDisplay: unwrapGlideField(row.submitted_by),
            }
        })
    }
}
