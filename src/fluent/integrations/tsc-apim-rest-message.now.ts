import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * Azure APIM outbound REST suite. After deploy, paste the subscription key on the
 * parent HTTP header Ocp-Apim-Subscription-Key (leave empty in source).
 */
export const tscApimRestMessage = Record({
    $id: Now.ID['tsc-apim-rest-message'],
    table: 'sys_rest_message',
    data: {
        name: 'x_2058901_demo TSC APIM',
        rest_endpoint: 'https://tsc-api.azure-api.net',
        authentication_type: 'no_authentication',
        access: 'package_private',
        description:
            'Azure APIM outbound REST suite (Doc Intel, contract/vendor). Set Ocp-Apim-Subscription-Key header on instance after deploy.',
    },
})

export const tscApimHeaderSubscriptionKey = Record({
    $id: Now.ID['tsc-apim-header-subscription-key'],
    table: 'sys_rest_message_headers',
    data: {
        rest_message: tscApimRestMessage,
        name: 'Ocp-Apim-Subscription-Key',
        value: '',
    },
})

export const tscApimHeaderAccept = Record({
    $id: Now.ID['tsc-apim-header-accept'],
    table: 'sys_rest_message_headers',
    data: {
        rest_message: tscApimRestMessage,
        name: 'Accept',
        value: 'application/json',
    },
})

export const tscApimMethodPostDocIntelInvoice = Record({
    $id: Now.ID['tsc-apim-method-post-doc-intel-invoice'],
    table: 'sys_rest_message_fn',
    data: {
        function_name: 'post_doc_intel_invoice',
        http_method: 'post',
        rest_endpoint: 'https://tsc-api.azure-api.net/DocIntel/v1/trained/invoice/pdf',
        rest_message: tscApimRestMessage,
        authentication_type: 'inherit_from_parent',
    },
})

export const tscApimHeaderDocIntelContentType = Record({
    $id: Now.ID['tsc-apim-header-doc-intel-content-type'],
    table: 'sys_rest_message_headers',
    data: {
        rest_message: tscApimRestMessage,
        rest_message_fn: tscApimMethodPostDocIntelInvoice,
        name: 'Content-Type',
        value: 'application/pdf',
    },
})

/** Placeholder — update rest_endpoint when contract lookup API is defined. */
export const tscApimMethodGetContract = Record({
    $id: Now.ID['tsc-apim-method-get-contract'],
    table: 'sys_rest_message_fn',
    data: {
        function_name: 'get_contract',
        http_method: 'get',
        rest_endpoint: '/TBD/contract/${contract_number}',
        rest_message: tscApimRestMessage,
        authentication_type: 'inherit_from_parent',
    },
})

/** Placeholder — update rest_endpoint when vendor lookup API is defined. */
export const tscApimMethodGetVendor = Record({
    $id: Now.ID['tsc-apim-method-get-vendor'],
    table: 'sys_rest_message_fn',
    data: {
        function_name: 'get_vendor',
        http_method: 'get',
        rest_endpoint: '/TBD/vendor/${vendor_name}',
        rest_message: tscApimRestMessage,
        authentication_type: 'inherit_from_parent',
    },
})
