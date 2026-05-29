import type { WorkflowType } from '../types/workflowType'

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

export class WorkflowTypeService {
    private readonly tableName = 'x_2058901_demo_workflow_type'

    private getHeaders(): HeadersInit {
        return {
            Accept: 'application/json',
            'X-UserToken': window.g_ck,
        }
    }

    async list(): Promise<WorkflowType[]> {
        const params = new URLSearchParams({
            sysparm_display_value: 'all',
            sysparm_exclude_reference_link: 'true',
            sysparm_fields: 'sys_id,code,name',
            sysparm_query: 'ORDERBYcode',
            sysparm_limit: '100',
        })

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

        return result.map((row: Record<string, GlideFieldValue>) => ({
            sysId: unwrapGlideValue(row.sys_id),
            code: unwrapGlideField(row.code),
            name: unwrapGlideField(row.name),
        }))
    }
}
