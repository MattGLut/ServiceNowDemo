import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const x_2058901_demo_doc_intel_client = ScriptInclude({
    $id: Now.ID['doc-intel-client-si'],
    name: 'DocIntelClient',
    apiName: 'x_2058901_demo.DocIntelClient',
    accessibleFrom: 'package_private',
    active: true,
    description: 'Calls Azure APIM Doc Intel invoice PDF endpoint via outbound REST message.',
    script: Now.include('../../server/script-includes/doc-intel-client.server.js'),
})
