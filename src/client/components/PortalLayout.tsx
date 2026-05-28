import React from 'react'

type PortalLayoutProps = {
    subtitle: string
    backHref?: string
    backLabel?: string
    children: React.ReactNode
}

export default function PortalLayout({ subtitle, backHref, backLabel, children }: PortalLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-rh-bg p-5 font-sans max-md:p-3">
            <header className="mb-8 border-b border-rh-border pb-6">
                {backHref && (
                    <a
                        href={backHref}
                        className="mb-3 inline-block text-sm text-rh-muted no-underline hover:text-rh-text"
                    >
                        {backLabel ?? 'Back'}
                    </a>
                )}
                <h1 className="m-0 text-2xl font-bold tracking-tight text-rh-text max-md:text-xl">
                    Ticket Intake Portal
                </h1>
                <p className="mt-2 mb-0 text-sm text-rh-muted">{subtitle}</p>
            </header>
            {children}
        </div>
    )
}
