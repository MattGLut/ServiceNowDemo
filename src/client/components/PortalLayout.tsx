import React from 'react'
import PortalSidebar from './PortalSidebar'
import { PORTAL_HOME_PATH } from '../utils/portalPage'

type PortalLayoutProps = {
    children: React.ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
    return (
        <div className="portal-shell font-sans">
            <header className="portal-header">
                <a href={PORTAL_HOME_PATH} className="portal-header-title">
                    Workflow Management Portal
                </a>
            </header>
            <div className="portal-body">
                <PortalSidebar />
                <main className="portal-main">{children}</main>
            </div>
        </div>
    )
}
