import React from 'react'
import HomePage from './components/HomePage'
import TicketDetailPage from './components/TicketDetailPage'
import TicketListPage from './components/TicketListPage'
import TicketSubmitPage from './components/TicketSubmitPage'
import { getPortalPage, getTicketSysIdFromUrl } from './utils/portalPage'

export default function App() {
    const page = getPortalPage()

    if (page === 'ticket-detail') {
        return <TicketDetailPage sysId={getTicketSysIdFromUrl()} />
    }

    if (page === 'tickets') {
        return <TicketListPage />
    }

    if (page === 'submit') {
        return <TicketSubmitPage />
    }

    return <HomePage />
}