import React from 'react'
import PortalLayout from './PortalLayout'
import { PORTAL_CONTRACT_TEST_PATH, PORTAL_DOC_INTEL_TEST_PATH } from '../utils/portalPage'

export default function HomePage() {
    return (
        <PortalLayout>
            <section className="portal-home-hero">
                <div className="portal-home-hero-content">
                    <p className="m-0 text-lg text-rh-text">Welcome</p>
                    <p className="mx-auto mt-3 mb-0 max-w-md text-sm text-rh-muted">
                        Create a new ticket with supporting documents. Tickets are stored in ServiceNow and
                        start in Draft status for downstream processing.
                    </p>
                    <p className="mx-auto mt-4 mb-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
                        <a href={PORTAL_DOC_INTEL_TEST_PATH} className="text-rh-green hover:underline">
                            Test Doc Intel endpoint
                        </a>
                        <a href={PORTAL_CONTRACT_TEST_PATH} className="text-rh-green hover:underline">
                            Test Contract API endpoint
                        </a>
                    </p>
                </div>
            </section>
        </PortalLayout>
    )
}
