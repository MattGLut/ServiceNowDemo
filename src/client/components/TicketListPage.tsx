import React, { useEffect, useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import SubmitSuccessToastHost from './SubmitSuccessToastHost'
import TicketList from './TicketList'
import { TicketService } from '../services/TicketService'
import { getTicketSysIdFromUrl } from '../utils/portalPage'
import { SUBMIT_SUCCESS_TOAST_TOTAL_MS } from '../utils/submitSuccessToast'
import { clearTicketListHighlightFromUrl } from '../utils/ticketListFilter'

export default function TicketListPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [highlightSysId, setHighlightSysId] = useState(() => getTicketSysIdFromUrl())

    useEffect(() => {
        if (!highlightSysId) {
            return
        }

        clearTicketListHighlightFromUrl()

        const timer = window.setTimeout(() => {
            setHighlightSysId(null)
        }, SUBMIT_SUCCESS_TOAST_TOTAL_MS)

        return () => window.clearTimeout(timer)
    }, [highlightSysId])

    return (
        <PortalLayout>
            <div className="relative flex min-h-0 flex-1 flex-col">
                <SubmitSuccessToastHost onDismiss={() => setHighlightSysId(null)} />
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
