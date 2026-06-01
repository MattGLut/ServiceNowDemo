import type { TicketStatus } from '../types/ticket'

export function ticketStatusBadgeClass(status: TicketStatus): string {
    return `portal-ticket-status portal-ticket-status--${status}`
}
