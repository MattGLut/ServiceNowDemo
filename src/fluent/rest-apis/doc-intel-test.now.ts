import '@servicenow/sdk/global'
import { Acl, RestApi } from '@servicenow/sdk/core'

export const x_2058901_demo_doc_intel_test_rest_acl = Acl({
    $id: Now.ID['doc-intel-test-rest-acl'],
    type: 'rest_endpoint',
    name: 'Doc Intel Test API',
    operation: 'execute',
    roles: ['itil'],
    adminOverrides: true,
})

export const x_2058901_demo_doc_intel_test_api = RestApi({
    $id: Now.ID['doc-intel-test-api'],
    name: 'Doc Intel Test API',
    serviceId: 'doc_intel_test',
    shortDescription: 'Proxy PDF uploads to the TSC APIM Doc Intel invoice endpoint for testing.',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [x_2058901_demo_doc_intel_test_rest_acl],
    routes: [
        {
            $id: Now.ID['doc-intel-test-invoice-route'],
            name: 'Test Doc Intel invoice',
            path: '/invoice',
            method: 'POST',
            shortDescription: 'Accepts a base64-encoded PDF and returns Doc Intel Documents output.',
            authentication: true,
            authorization: true,
            enforceAcl: [x_2058901_demo_doc_intel_test_rest_acl],
            consumes: 'application/json',
            produces: 'application/json',
            script: Now.include('../../server/scripted-rest/doc-intel-test-invoice.server.js'),
        },
    ],
})
