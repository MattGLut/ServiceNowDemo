import React, { type ReactNode } from 'react'
import { PORTAL_TICKETS_PATH } from '../utils/portalPage'

type ImmersiveLayoutProps = {
    backHref?: string
    backLabel?: string
    title?: string
    children: ReactNode
}

export default function ImmersiveLayout({
    backHref = PORTAL_TICKETS_PATH,
    backLabel = 'Back to tickets',
    title,
    children,
}: ImmersiveLayoutProps) {
    return (
        <div className="portal-immersive-shell font-sans">
            <header className="portal-immersive-header">
                <a href={backHref} className="portal-immersive-back">
                    {backLabel}
                </a>
                {title && <h1 className="portal-immersive-title">{title}</h1>}
            </header>
            <main className="portal-immersive-main">{children}</main>
        </div>
    )
}
