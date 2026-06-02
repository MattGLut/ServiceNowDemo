import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const x_2058901_demo_contract_client = ScriptInclude({
    $id: Now.ID['contract-client-si'],
    name: 'ContractClient',
    apiName: 'x_2058901_demo.ContractClient',
    accessibleFrom: 'package_private',
    active: true,
    description: 'Calls TSC APIM UWF Contract Details by contract number.',
    script: Now.include('../../server/script-includes/contract-client.server.js'),
})
