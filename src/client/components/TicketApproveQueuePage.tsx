import React, { useMemo } from 'react'
import PortalLayout from './PortalLayout'
import TicketApproveList from './TicketApproveList'
import { TicketService } from '../services/TicketService'

export default function TicketApproveQueuePage() {
    const ticketService = useMemo(() => new TicketService(), [])

    return (
        <PortalLayout>
            <section className="portal-panel portal-panel-full">
                <TicketApproveList ticketService={ticketService} />
            </section>
        </PortalLayout>
    )
}
