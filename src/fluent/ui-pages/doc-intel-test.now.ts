import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import portalPage from '../../client/index.html'

UiPage({
    $id: Now.ID['doc-intel-test-page'],
    endpoint: 'x_2058901_demo_doc_intel_test.do',
    description: 'Upload a PDF to test the Doc Intel outbound REST message',
    category: 'general',
    html: portalPage,
    direct: true,
})
