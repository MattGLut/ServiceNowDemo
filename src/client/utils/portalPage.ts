export type PortalPage = 'home' | 'submit'

export const PORTAL_HOME_PATH = '/x_2058901_demo_incident_manager.do'
export const PORTAL_SUBMIT_PATH = '/x_2058901_demo_ticket_submit.do'

export function getPortalPage(): PortalPage {
    const path = window.location.pathname.toLowerCase()

    if (path.includes('ticket_submit')) {
        return 'submit'
    }

    return 'home'
}
