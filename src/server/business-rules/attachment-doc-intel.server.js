(function () {
    var TICKET_TABLE = 'x_2058901_demo_ticket'
    var APPROVAL_TABLE = 'x_2058901_demo_ticket_approval'
    var DI_ERROR_MAX = 500

    function truncateError(message) {
        var text = message || 'Unknown Doc Intel error'
        if (text.length <= DI_ERROR_MAX) {
            return text
        }
        return text.substring(0, DI_ERROR_MAX)
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

        if (mapped.confidence && Object.keys(mapped.confidence).length) {
            approvalGr.field_confidence = JSON.stringify(mapped.confidence)
        }
    }

    if (current.table_name != TICKET_TABLE) {
        return
    }

    var contentType = (current.content_type || '').toLowerCase()
    if (contentType.indexOf('pdf') === -1) {
        return
    }

    var ticketSysId = current.table_sys_id
    var ticketGr = new GlideRecord(TICKET_TABLE)
    if (!ticketGr.get(ticketSysId)) {
        gs.error('attachment-doc-intel: ticket not found ' + ticketSysId)
        return
    }

    var approvalGr = findApprovalByTicket(ticketSysId)
    if (!approvalGr) {
        gs.error('attachment-doc-intel: approval row missing for ticket ' + ticketSysId)
        return
    }

    approvalGr.setWorkflow(false)

    if (ticketGr.stp_flag == true) {
        approvalGr.di_status = 'skipped'
        approvalGr.di_error = ''
        approvalGr.di_processed_at = new GlideDateTime()
        approvalGr.update()
        return
    }

    if (approvalGr.di_status == 'complete') {
        return
    }

    approvalGr.di_status = 'pending'
    approvalGr.di_error = ''
    approvalGr.update()

    try {
        var client = new x_2058901_demo.DocIntelClient()
        var result = client.analyzeInvoicePdf(current.sys_id)
        var documents = result.documents

        if (!documents || !documents.length) {
            throw new Error('Doc Intel returned no documents.')
        }

        var mapper = new x_2058901_demo.MapDocIntelToApproval()
        var mapped = mapper.mapDocument(documents[0])

        if (!approvalGr.get(approvalGr.getUniqueValue())) {
            throw new Error('Approval row disappeared during Doc Intel processing.')
        }

        approvalGr.setWorkflow(false)
        applyMappedValues(approvalGr, mapped)
        approvalGr.di_status = 'complete'
        approvalGr.di_error = ''
        approvalGr.di_processed_at = new GlideDateTime()
        approvalGr.update()
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error(
            'attachment-doc-intel failed ticket=' +
                ticketSysId +
                ' attachment=' +
                current.sys_id +
                ': ' +
                message
        )

        if (approvalGr.get(approvalGr.getUniqueValue())) {
            approvalGr.setWorkflow(false)
            approvalGr.di_status = 'failed'
            approvalGr.di_error = truncateError(message)
            approvalGr.di_processed_at = new GlideDateTime()
            approvalGr.update()
        }
    }
})()
