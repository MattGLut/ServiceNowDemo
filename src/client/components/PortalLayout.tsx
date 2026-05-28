import React, { type ReactNode } from 'react'
import PortalSidebar from './PortalSidebar'
import { PORTAL_HOME_PATH } from '../utils/portalPage'

type PortalLayoutProps = {
    children: React.ReactNode
    toast?: ReactNode
}

export default function PortalLayout({ children, toast }: PortalLayoutProps) {
    return (
        <div className="portal-shell font-sans">
            <header className="portal-header">
                <a href={PORTAL_HOME_PATH} className="portal-header-title">
                    Ticket Intake Portal
                </a>
                {toast && <div className="portal-toast-region">{toast}</div>}
            </header>
            <div className="portal-body">
                <PortalSidebar />
                <main className="portal-main">{children}</main>
            </div>
        </div>
    )
}
