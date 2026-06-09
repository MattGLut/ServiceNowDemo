(function () {
    var TICKET_TABLE = 'x_2058901_demo_ticket'
    var PAYLOAD_ERROR_MAX = 500

    function truncateError(message) {
        var text = message || 'Unknown payload build error'
        if (text.length <= PAYLOAD_ERROR_MAX) {
            return text
        }
        return text.substring(0, PAYLOAD_ERROR_MAX)
    }

    function loadTicketAttachments(ticketSysId) {
        var attachments = []
        var attachmentGr = new GlideRecord('sys_attachment')
        attachmentGr.addQuery('table_name', TICKET_TABLE)
        attachmentGr.addQuery('table_sys_id', ticketSysId)
        attachmentGr.orderByDesc('sys_created_on')
        attachmentGr.query()

        while (attachmentGr.next()) {
            attachments.push({
                sysId: attachmentGr.getUniqueValue(),
                fileName: attachmentGr.getValue('file_name') || 'attachment',
                contentType: attachmentGr.getValue('content_type') || 'application/pdf',
            })
        }

        return attachments
    }

    if (!current.approved_at) {
        return
    }

    if (previous && previous.approved_at) {
        return
    }

    var ticketSysId = current.ticket.toString()
    if (!ticketSysId) {
        gs.error('ticket-approval-build-rtm-payload: missing ticket reference')
        return
    }

    var ticketGr = new GlideRecord(TICKET_TABLE)
    if (!ticketGr.get(ticketSysId)) {
        gs.error('ticket-approval-build-rtm-payload: ticket not found ' + ticketSysId)
        return
    }

    var attachments = loadTicketAttachments(ticketSysId)
    var mapper = new x_2058901_demo.MapApprovalToRtmData()
    var result = mapper.buildRtmPayload(current, ticketGr, attachments)

    current.setWorkflow(false)
    current.payload_built_at = new GlideDateTime()

    if (result.error) {
        current.payload_status = 'failed'
        current.payload_error = truncateError(result.error)
        current.update()
        return
    }

    current.rtm_payload_json = JSON.stringify(result.payload)
    current.payload_status = 'ready'
    current.payload_error = ''
    current.update()
})()
