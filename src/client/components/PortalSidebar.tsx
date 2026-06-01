import React from 'react'
import { PORTAL_NAV_ACTIONS } from '../utils/portalNav'
import { getPortalPage } from '../utils/portalPage'

export default function PortalSidebar() {
    const currentPage = getPortalPage()

    return (
        <aside className="portal-sidebar">
            <p className="portal-sidebar-label">Actions</p>
            <nav aria-label="Portal actions">
                <ul className="portal-sidebar-list">
                    {PORTAL_NAV_ACTIONS.map((item) => {
                        const isActive = currentPage === item.page

                        return (
                            <li key={item.id}>
                                <a
                                    href={item.href}
                                    className={isActive ? 'portal-sidebar-link-active' : 'portal-sidebar-link'}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}
