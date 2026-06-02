var ContractClient = Class.create()
ContractClient.prototype = {
    REST_MESSAGE_NAME: 'x_2058901_demo TSC APIM',
    REST_METHOD_NAME: 'get_contract',
    APIM_KEY_HEADER: 'Ocp-Apim-Subscription-Key',
    HTTP_TIMEOUT_MS: 60000,

    initialize: function () {},

    getRestMessageHeaderValue: function (messageName, headerName) {
        var messageGr = new GlideRecord('sys_rest_message')
        messageGr.addQuery('name', messageName)
        messageGr.query()
        if (!messageGr.next()) {
            return ''
        }

        var headerGr = new GlideRecord('sys_rest_message_headers')
        headerGr.addQuery('rest_message', messageGr.getUniqueValue())
        headerGr.addQuery('name', headerName)
        headerGr.setLimit(1)
        headerGr.query()
        if (!headerGr.next()) {
            return ''
        }

        return headerGr.getValue('value') || ''
    },

    getContractDetails: function (contractNumber) {
        var subscriptionKey = this.getRestMessageHeaderValue(
            this.REST_MESSAGE_NAME,
            this.APIM_KEY_HEADER
        ).trim()

        if (!subscriptionKey) {
            throw new Error(
                'Ocp-Apim-Subscription-Key is empty on outbound REST message x_2058901_demo TSC APIM.'
            )
        }

        var contractId = (contractNumber || '').trim()
        if (!contractId) {
            throw new Error('contractNumber is required.')
        }

        var restMessage = new sn_ws.RESTMessageV2(this.REST_MESSAGE_NAME, this.REST_METHOD_NAME)
        restMessage.setHttpMethod('get')
        restMessage.setHttpTimeout(this.HTTP_TIMEOUT_MS)
        restMessage.setRequestHeader(this.APIM_KEY_HEADER, subscriptionKey)
        restMessage.setQueryParameter('id', contractId)

        var apiResponse = restMessage.execute()
        var statusCode = apiResponse.getStatusCode()
        var responseBody = apiResponse.getBody() || ''
        var haveError = apiResponse.haveError()
        var restErrorMessage = haveError ? apiResponse.getErrorMessage() : ''

        if (statusCode < 200 || statusCode >= 300 || haveError) {
            throw new Error(
                'Contract API HTTP ' +
                    statusCode +
                    (restErrorMessage ? ': ' + restErrorMessage : '') +
                    (responseBody ? ' body=' + responseBody.substring(0, 500) : '')
            )
        }

        var parsed
        try {
            parsed = JSON.parse(responseBody)
        } catch {
            throw new Error('Contract API response was not valid JSON.')
        }

        if (!parsed || !parsed.data || !parsed.data.length) {
            throw new Error('Contract API returned no contract data for id=' + contractId + '.')
        }

        return { contracts: parsed.data, contractId: contractId }
    },

    type: 'ContractClient',
}
