(function () {
    var APPROVAL_TABLE = 'x_2058901_demo_ticket_approval'
    var CONTRACT_ERROR_MAX = 500

    function truncateError(message) {
        var text = message || 'Unknown Contract API error'
        if (text.length <= CONTRACT_ERROR_MAX) {
            return text
        }
        return text.substring(0, CONTRACT_ERROR_MAX)
    }

    function findApprovalByTicket(ticketSysId) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.setLimit(1)
        approvalGr.query()
        if (!approvalGr.next()) {
            return null
        }
        return approvalGr
    }

    function applyMappedValues(approvalGr, mapped) {
        var values = mapped.values || {}
        var column

        for (column in values) {
            if (Object.prototype.hasOwnProperty.call(values, column) && values[column]) {
                approvalGr.setValue(column, values[column])
            }
        }
    }

    var ticketSysId = current.sys_id
    var approvalGr = findApprovalByTicket(ticketSysId)
    if (!approvalGr) {
        gs.error('ticket-fetch-contract: approval row missing for ticket ' + ticketSysId)
        return
    }

    approvalGr.setWorkflow(false)

    if (current.stp_flag == true) {
        approvalGr.contract_status = 'skipped'
        approvalGr.contract_error = ''
        approvalGr.contract_processed_at = new GlideDateTime()
        approvalGr.update()
        return
    }

    var contractNumber = (current.external_id || '').trim()
    if (!contractNumber) {
        approvalGr.contract_status = 'failed'
        approvalGr.contract_error = truncateError('Contract number (external_id) is required.')
        approvalGr.contract_processed_at = new GlideDateTime()
        approvalGr.update()
        return
    }

    if (approvalGr.contract_status == 'complete') {
        return
    }

    approvalGr.contract_status = 'pending'
    approvalGr.contract_error = ''
    approvalGr.update()

    try {
        var client = new x_2058901_demo.ContractClient()
        var result = client.getContractDetails(contractNumber)
        var mapper = new x_2058901_demo.MapContractToApproval()
        var mapped = mapper.mapContracts(result.contracts, result.contractId)

        if (!approvalGr.get(approvalGr.getUniqueValue())) {
            throw new Error('Approval row disappeared during Contract API processing.')
        }

        approvalGr.setWorkflow(false)
        applyMappedValues(approvalGr, mapped)
        approvalGr.contract_status = 'complete'
        approvalGr.contract_error = ''
        approvalGr.contract_processed_at = new GlideDateTime()
        approvalGr.update()
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error('ticket-fetch-contract failed ticket=' + ticketSysId + ': ' + message)

        if (approvalGr.get(approvalGr.getUniqueValue())) {
            approvalGr.setWorkflow(false)
            approvalGr.contract_status = 'failed'
            approvalGr.contract_error = truncateError(message)
            approvalGr.contract_processed_at = new GlideDateTime()
            approvalGr.update()
        }
    }
})()
