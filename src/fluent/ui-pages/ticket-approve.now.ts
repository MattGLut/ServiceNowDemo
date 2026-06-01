import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['ticket-approve-page'],
    endpoint: 'x_2058901_demo_ticket_approve.do',
    description: 'Approver queue and approval form for draft tickets',
    category: 'general',
    html: portalPage,
    direct: true,
})
