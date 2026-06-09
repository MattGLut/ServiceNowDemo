import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const x_2058901_demo_map_approval_to_rtm_data = ScriptInclude({
    $id: Now.ID['map-approval-to-rtm-data-si'],
    name: 'MapApprovalToRtmData',
    apiName: 'x_2058901_demo.MapApprovalToRtmData',
    accessibleFrom: 'package_private',
    active: true,
    description: 'Builds RtmData JSON from a ticket approval record for WRT payload handoff.',
    script: Now.include('../../server/script-includes/map-approval-to-rtm-data.server.js'),
})
