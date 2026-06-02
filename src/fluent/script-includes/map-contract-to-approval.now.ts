import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const x_2058901_demo_map_contract_to_approval = ScriptInclude({
    $id: Now.ID['map-contract-to-approval-si'],
    name: 'MapContractToApproval',
    apiName: 'x_2058901_demo.MapContractToApproval',
    accessibleFrom: 'package_private',
    active: true,
    description: 'Maps UWF Contract Details data[0] fields to ticket approval column values.',
    script: Now.include('../../server/script-includes/map-contract-to-approval.server.js'),
})
