import { PORTAL_SUBMIT_PATH, type PortalPage } from './portalPage'

export type PortalNavItem = {
    id: string
    label: string
    href: string
    page: PortalPage
}

export const PORTAL_NAV_ACTIONS: PortalNavItem[] = [
    {
        id: 'submit',
        label: 'Submit a ticket',
        href: PORTAL_SUBMIT_PATH,
        page: 'submit',
    },
]
