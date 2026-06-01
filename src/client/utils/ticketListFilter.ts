import { PORTAL_TICKETS_PATH, getTicketSysIdFromUrl } from './portalPage'
import type { TicketStatus } from '../types/ticket'

export type TicketListStatusFilter = 'all' | TicketStatus

export const TICKET_STATUS_FILTER_OPTIONS: { value: TicketListStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'approved', label: 'Approved' },
    { value: 'posted', label: 'Posted' },
]

export function getTicketListStatusFilterFromUrl(): TicketListStatusFilter {
    const path = window.location.pathname.toLowerCase()

    if (path.includes('ticket_approve') && !getTicketSysIdFromUrl()) {
        return 'draft'
    }

    const raw = new URLSearchParams(window.location.search).get('status')?.trim().toLowerCase()

    if (raw === 'draft' || raw === 'approved' || raw === 'posted') {
        return raw
    }

    return 'all'
}

export function ticketListUrl(
    statusFilter: TicketListStatusFilter = 'all',
    options?: { highlightSysId?: string }
): string {
    const params = new URLSearchParams()

    if (statusFilter !== 'all') {
        params.set('status', statusFilter)
    }

    if (options?.highlightSysId) {
        params.set('sys_id', options.highlightSysId)
    }

    const query = params.toString()
    return query ? `${PORTAL_TICKETS_PATH}?${query}` : PORTAL_TICKETS_PATH
}

export function syncTicketListStatusInUrl(statusFilter: TicketListStatusFilter): void {
    const url = new URL(ticketListUrl(statusFilter), window.location.origin)
    window.history.replaceState({}, '', `${url.pathname}${url.search}`)
}

export function clearTicketListHighlightFromUrl(): void {
    const url = new URL(window.location.href)

    if (!url.searchParams.has('sys_id')) {
        return
    }

    url.searchParams.delete('sys_id')
    const query = url.searchParams.toString()
    window.history.replaceState({}, '', query ? `${url.pathname}?${query}` : url.pathname)
}

export function emptyTicketListMessage(statusFilter: TicketListStatusFilter): string {
    switch (statusFilter) {
        case 'draft':
            return 'No draft tickets.'
        case 'approved':
            return 'No approved tickets.'
        case 'posted':
            return 'No posted tickets.'
        default:
            return 'No tickets found.'
    }
}
