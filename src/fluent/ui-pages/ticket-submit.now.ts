import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['ticket-submit-page'],
    endpoint: 'x_2058901_demo_ticket_submit.do',
    description: 'Ticket submission form',
    category: 'general',
    html: portalPage,
    direct: true,
})
