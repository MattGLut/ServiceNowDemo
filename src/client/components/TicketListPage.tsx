import React, { useMemo } from 'react'
import PortalLayout from './PortalLayout'
import TicketList from './TicketList'
import { TicketService } from '../services/TicketService'

export default function TicketListPage() {
    const ticketService = useMemo(() => new TicketService(), [])

    return (
        <PortalLayout>
            <section className="portal-panel portal-panel-full">
                <TicketList ticketService={ticketService} refreshKey={0} />
            </section>
        </PortalLayout>
    )
}
