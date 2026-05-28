import React from 'react'

export default function App() {
    return (
        <div className="min-h-screen w-full bg-rh-bg p-5 font-sans max-md:p-3">
            <header className="mb-8 border-b border-rh-border pb-6">
                <h1 className="m-0 text-2xl font-bold tracking-tight text-rh-text max-md:text-xl">
                    Ticket Intake Portal
                </h1>
                <p className="mt-2 mb-0 text-sm text-rh-muted">
                    Hybrid ticket processing — straight-through and document intelligence paths
                </p>
            </header>

            <main className="rounded-xl border border-rh-border bg-rh-panel px-8 py-12 text-center">
                <p className="m-0 text-lg text-rh-text">Under construction</p>
                <p className="mx-auto mt-3 max-w-md text-sm text-rh-muted">
                    Intake forms, file upload, and review workflows will be built here. See{' '}
                    <code className="rounded bg-rh-elevated px-1.5 py-0.5 text-rh-text">docs/architecture.md</code>{' '}
                    in the repository for the target design.
                </p>
            </main>
        </div>
    )
}
