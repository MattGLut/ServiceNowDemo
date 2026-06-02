import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['contract-test-page'],
    endpoint: 'x_2058901_demo_contract_test.do',
    description: 'Look up a contract number to test the UWF Contract Details outbound REST message',
    category: 'general',
    html: portalPage,
    direct: true,
})
