import React from 'react'
import HomePage from './components/HomePage'
import TicketSubmitPage from './components/TicketSubmitPage'
import { getPortalPage } from './utils/portalPage'

export default function App() {
    const page = getPortalPage()

    if (page === 'submit') {
        return <TicketSubmitPage />
    }

    return <HomePage />
}
