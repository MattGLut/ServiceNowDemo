import { getCurrentUserSysId } from '../utils/currentUser'

declare global {
    interface Window {
        g_ck: string
    }
}

function formatGlideDateTime(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const COMPLAINT_FIELDS = 'sys_id,incident,complaint_text,filed_by,filed_at'
const CHUNK_SIZE = 50

function chunkArray(items, size) {
    const chunks = []

    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size))
    }

    return chunks
}

export class IncidentComplaintService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_2058901_demo_incident_complaint'
    }

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

    async listByIncidents(incidentSysIds) {
        if (!incidentSysIds.length) {
            return []
        }

        const chunks = chunkArray(incidentSysIds, CHUNK_SIZE)
        const allResults = []

        try {
            for (const chunk of chunks) {
                const searchParams = new URLSearchParams()
                searchParams.set('sysparm_display_value', 'all')
                searchParams.set('sysparm_fields', COMPLAINT_FIELDS)
                searchParams.set('sysparm_query', `incidentIN${chunk.join(',')}^ORDERBYDESCfiled_at`)

                const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                    method: 'GET',
                    headers: this.getHeaders(),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
                }

                const { result } = await response.json()
                if (result?.length) {
                    allResults.push(...result)
                }
            }

            return allResults
        } catch (error) {
            console.error('Error fetching complaints for incidents:', error)
            throw error
        }
    }

    async create(incidentSysId: string, complaintText: string) {
        try {
            const payload: Record<string, string> = {
                incident: incidentSysId,
                complaint_text: complaintText,
                filed_at: formatGlideDateTime(new Date()),
            }

            const currentUserSysId = getCurrentUserSysId()
            if (currentUserSysId) {
                payload.filed_by = currentUserSysId
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

            return response.json()
        } catch (error) {
            console.error('Error creating incident complaint:', error)
            throw error
        }
    }

    async delete(sysId: string) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.ok
        } catch (error) {
            console.error(`Error deleting incident complaint ${sysId}:`, error)
            throw error
        }
    }
}
