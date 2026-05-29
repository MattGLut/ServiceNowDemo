import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['ticket-list-page'],
    endpoint: 'x_2058901_demo_ticket_list.do',
    description: 'Submitted tickets list',
    category: 'general',
    html: portalPage,
    direct: true,
})
