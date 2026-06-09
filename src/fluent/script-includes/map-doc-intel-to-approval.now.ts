import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const x_2058901_demo_map_doc_intel_to_approval = ScriptInclude({
    $id: Now.ID['map-doc-intel-to-approval-si'],
    name: 'MapDocIntelToApproval',
    apiName: 'x_2058901_demo.MapDocIntelToApproval',
    accessibleFrom: 'package_private',
    active: true,
    description: 'Maps Doc Intel Documents[0] to ticket approval values; supports hybrid PI01/CH11 segment split.',
    script: Now.include('../../server/script-includes/map-doc-intel-to-approval.server.js'),
})
