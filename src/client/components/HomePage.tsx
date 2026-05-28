import React from 'react'
import PortalLayout from './PortalLayout'
import { PORTAL_SUBMIT_PATH } from '../utils/portalPage'

export default function HomePage() {
    return (
        <PortalLayout subtitle="Hybrid ticket processing for straight-through and document intelligence paths.">
            <main className="portal-home-hero mx-auto max-w-xl text-center">
                <p className="m-0 text-lg text-rh-text">Welcome</p>
                <p className="mx-auto mt-3 mb-8 max-w-md text-sm text-rh-muted">
                    Create a new ticket with supporting documents. Tickets are stored in ServiceNow and
                    start in Submitted status for downstream processing.
                </p>
                <a href={PORTAL_SUBMIT_PATH} className="portal-cta inline-block no-underline">
                    Submit a ticket
                </a>
            </main>
        </PortalLayout>
    )
}
