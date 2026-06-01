import React from 'react'
import PortalSidebar from './PortalSidebar'
import { PORTAL_HOME_PATH } from '../utils/portalPage'

type PortalLayoutProps = {
    children: React.ReactNode
    /** Full-width main area below the site header (no sidebar). */
    fullWidth?: boolean
}

export default function PortalLayout({ children, fullWidth = false }: PortalLayoutProps) {
    return (
        <div className="portal-shell font-sans">
            <header className="portal-header">
                <a href={PORTAL_HOME_PATH} className="portal-header-title">
                    Workflow Management Portal
                </a>
            </header>
            {fullWidth ? (
                <main className="portal-main portal-main-full">{children}</main>
            ) : (
                <div className="portal-body">
                    <PortalSidebar />
                    <main className="portal-main">{children}</main>
                </div>
            )}
        </div>
    )
}
