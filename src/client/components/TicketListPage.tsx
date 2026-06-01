import React, { useMemo } from 'react'
import PortalLayout from './PortalLayout'
import SubmitSuccessToastHost from './SubmitSuccessToastHost'
import TicketList from './TicketList'
import { TicketService } from '../services/TicketService'
import { getTicketSysIdFromUrl } from '../utils/portalPage'

export default function TicketListPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const highlightSysId = getTicketSysIdFromUrl()

    return (
        <PortalLayout>
            <div className="relative flex min-h-0 flex-1 flex-col">
                <SubmitSuccessToastHost />
                <section className="portal-panel portal-panel-full">
                    <TicketList
                        ticketService={ticketService}
                        refreshKey={0}
                        highlightSysId={highlightSysId}
                    />
                </section>
            </div>
        </PortalLayout>
    )
}
