import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['ticket-view-page'],
    endpoint: 'x_2058901_demo_ticket_view.do',
    description: 'Ticket detail view',
    category: 'general',
    html: portalPage,
    direct: true,
})
