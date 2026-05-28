import React, { type ReactNode } from 'react'
import { PORTAL_SUBMIT_TICKETS_PATH } from '../utils/portalPage'

type ImmersiveLayoutProps = {
    backLabel?: string
    title?: string
    children: ReactNode
}

export default function ImmersiveLayout({
    backLabel = 'Back to tickets',
    title,
    children,
}: ImmersiveLayoutProps) {
    return (
        <div className="portal-immersive-shell font-sans">
            <header className="portal-immersive-header">
                <a href={PORTAL_SUBMIT_TICKETS_PATH} className="portal-immersive-back">
                    {backLabel}
                </a>
                {title && <h1 className="portal-immersive-title">{title}</h1>}
            </header>
            <main className="portal-immersive-main">{children}</main>
        </div>
    )
}
