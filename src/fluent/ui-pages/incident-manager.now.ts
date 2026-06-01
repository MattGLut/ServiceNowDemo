import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import incidentPage from '../../client/index.html'

UiPage({
    $id: Now.ID['incident-manager-page'],
    endpoint: 'x_2058901_demo_incident_manager.do',
    description: 'Workflow Management Portal home',
    category: 'general',
    html: incidentPage,
    direct: true,
})
