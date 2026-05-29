export type PortalPage = 'home' | 'submit' | 'tickets' | 'ticket-detail'

export const PORTAL_HOME_PATH = '/x_2058901_demo_incident_manager.do'
export const PORTAL_SUBMIT_PATH = '/x_2058901_demo_ticket_submit.do'
export const PORTAL_TICKETS_PATH = '/x_2058901_demo_ticket_list.do'
export const PORTAL_TICKET_VIEW_PATH = '/x_2058901_demo_ticket_view.do'

const SYS_ID_PATTERN = /^[0-9a-f]{32}$/i

export function getPortalPage(): PortalPage {
    const path = window.location.pathname.toLowerCase()

    if (path.includes('ticket_view')) {
        return 'ticket-detail'
    }

    if (path.includes('ticket_list')) {
        return 'tickets'
    }

    if (path.includes('ticket_submit')) {
        return 'submit'
    }

    return 'home'
}

export function getTicketSysIdFromUrl(): string | null {
    const sysId = new URLSearchParams(window.location.search).get('sys_id')?.trim()

    if (!sysId || !SYS_ID_PATTERN.test(sysId)) {
        return null
    }

    return sysId
}

export function ticketViewUrl(sysId: string): string {
    return `${PORTAL_TICKET_VIEW_PATH}?sys_id=${encodeURIComponent(sysId)}`
}
