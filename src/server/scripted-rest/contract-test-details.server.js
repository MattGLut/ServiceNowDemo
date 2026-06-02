(function process(/* RESTAPIRequest */ request, /* RESTAPIResponse */ response) {
    try {
        var contractId = ''
        var bodyString = request.body.dataString

        if (bodyString) {
            var payload = JSON.parse(bodyString)
            contractId = (payload.contract_id || '').trim()
        }

        if (!contractId) {
            contractId = (request.queryParams.contract_id || '').trim()
        }

        if (!contractId) {
            response.setStatus(400)
            response.setBody({ error: 'contract_id is required (query param or JSON body).' })
            return
        }

        var client = new x_2058901_demo.ContractClient()
        var result = client.getContractDetails(contractId)
        var mapper = new x_2058901_demo.MapContractToApproval()
        var mapped = mapper.mapContracts(result.contracts, result.contractId)

        response.setStatus(200)
        response.setBody({
            status: 200,
            contract_id: contractId,
            contracts: result.contracts,
            mapped_values: mapped.values,
        })
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error('Contract test endpoint failed: ' + message)

        if (message.indexOf('Ocp-Apim-Subscription-Key is empty') !== -1) {
            response.setStatus(400)
            response.setBody({
                error:
                    'Ocp-Apim-Subscription-Key is empty on the outbound REST message. Set it under System Web Services → Outbound → REST Message → x_2058901_demo TSC APIM → HTTP Headers.',
            })
            return
        }

        if (message.indexOf('Contract API HTTP') === 0) {
            response.setStatus(502)
            response.setBody({
                error: 'Contract API request failed.',
                rest_error_message: message,
            })
            return
        }

        response.setStatus(500)
        response.setBody({ error: message, step: 'unexpected' })
    }
})(request, response)
