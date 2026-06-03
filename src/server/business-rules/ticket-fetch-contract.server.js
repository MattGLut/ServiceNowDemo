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

    function forEachApprovalByTicket(ticketSysId, callback) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.query()
        while (approvalGr.next()) {
            callback(approvalGr)
        }
    }

    function allApprovalsContractComplete(ticketSysId) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.query()
        if (!approvalGr.hasNext()) {
            return false
        }
        while (approvalGr.next()) {
            if (approvalGr.contract_status != 'complete') {
                return false
            }
        }
        return true
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
    var hasApproval = false

    forEachApprovalByTicket(ticketSysId, function () {
        hasApproval = true
    })

    if (!hasApproval) {
        gs.error('ticket-fetch-contract: approval row missing for ticket ' + ticketSysId)
        return
    }

    if (current.stp_flag == true) {
        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            approvalGr.contract_status = 'skipped'
            approvalGr.contract_error = ''
            approvalGr.contract_processed_at = new GlideDateTime()
            approvalGr.update()
        })
        return
    }

    var contractNumber = (current.external_id || '').trim()
    if (!contractNumber) {
        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            approvalGr.contract_status = 'failed'
            approvalGr.contract_error = truncateError('Contract number (external_id) is required.')
            approvalGr.contract_processed_at = new GlideDateTime()
            approvalGr.update()
        })
        return
    }

    if (allApprovalsContractComplete(ticketSysId)) {
        return
    }

    forEachApprovalByTicket(ticketSysId, function (approvalGr) {
        approvalGr.setWorkflow(false)
        approvalGr.contract_status = 'pending'
        approvalGr.contract_error = ''
        approvalGr.update()
    })

    try {
        var client = new x_2058901_demo.ContractClient()
        var result = client.getContractDetails(contractNumber)
        var mapper = new x_2058901_demo.MapContractToApproval()
        var mapped = mapper.mapContracts(result.contracts, result.contractId)

        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            applyMappedValues(approvalGr, mapped)
            approvalGr.contract_status = 'complete'
            approvalGr.contract_error = ''
            approvalGr.contract_processed_at = new GlideDateTime()
            approvalGr.update()
        })
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error('ticket-fetch-contract failed ticket=' + ticketSysId + ': ' + message)

        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            approvalGr.contract_status = 'failed'
            approvalGr.contract_error = truncateError(message)
            approvalGr.contract_processed_at = new GlideDateTime()
            approvalGr.update()
        })
    }
})()
