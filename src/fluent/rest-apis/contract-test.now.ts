import '@servicenow/sdk/global'
import { Acl, RestApi } from '@servicenow/sdk/core'

export const x_2058901_demo_contract_test_rest_acl = Acl({
    $id: Now.ID['contract-test-rest-acl'],
    type: 'rest_endpoint',
    name: 'Contract Test API',
    operation: 'execute',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_contract_test_api = RestApi({
    $id: Now.ID['contract-test-api'],
    name: 'Contract Test API',
    serviceId: 'contract_test',
    shortDescription: 'Proxy contract number lookups to the TSC APIM UWF Contract Details endpoint.',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [x_2058901_demo_contract_test_rest_acl],
    routes: [
        {
            $id: Now.ID['contract-test-details-route'],
            name: 'Test Contract Details',
            path: '/details',
            method: 'POST',
            shortDescription:
                'Accepts contract_id in JSON body or query and returns Contract API data plus mapped approval values.',
            authentication: true,
            authorization: true,
            enforceAcl: [x_2058901_demo_contract_test_rest_acl],
            consumes: 'application/json',
            produces: 'application/json',
            script: Now.include('../../server/scripted-rest/contract-test-details.server.js'),
        },
    ],
})
