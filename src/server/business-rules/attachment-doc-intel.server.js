(function () {
    var TICKET_TABLE = 'x_2058901_demo_ticket'
    var APPROVAL_TABLE = 'x_2058901_demo_ticket_approval'
    var WORKFLOW_TYPE_TABLE = 'x_2058901_demo_workflow_type'
    var DI_ERROR_MAX = 500

    var CONTRACT_COPY_COLUMNS = [
        'company_code',
        'profit_center',
        'approver_name',
        'approver_id',
        'payment_method',
        'charge_payee_id',
        'charge_payee_name',
        'contract_status',
        'contract_error',
        'contract_processed_at',
    ]

    function truncateError(message) {
        var text = message || 'Unknown Doc Intel error'
        if (text.length <= DI_ERROR_MAX) {
            return text
        }
        return text.substring(0, DI_ERROR_MAX)
    }

    function copyRowFields(fromGr, toGr, columns) {
        var index
        for (index = 0; index < columns.length; index++) {
            toGr.setValue(columns[index], fromGr.getValue(columns[index]))
        }
    }

    function findApprovalByTicket(ticketSysId) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.orderBy('sys_created_on')
        approvalGr.setLimit(1)
        approvalGr.query()
        if (!approvalGr.next()) {
            return null
        }
        return approvalGr
    }

    function findApprovalByWorkflowCode(ticketSysId, workflowCode) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.addQuery('workflow_type.code', workflowCode)
        approvalGr.setLimit(1)
        approvalGr.query()
        if (!approvalGr.next()) {
            return null
        }
        return approvalGr
    }

    function resolveWorkflowTypeSysId(code) {
        var workflowGr = new GlideRecord(WORKFLOW_TYPE_TABLE)
        workflowGr.addQuery('code', code)
        workflowGr.setLimit(1)
        workflowGr.query()
        if (!workflowGr.next()) {
            throw new Error('Workflow type not found: ' + code)
        }
        return workflowGr.getUniqueValue()
    }

    function forEachApprovalByTicket(ticketSysId, callback) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.query()
        while (approvalGr.next()) {
            callback(approvalGr)
        }
    }

    function allApprovalsDiComplete(ticketSysId) {
        var approvalGr = new GlideRecord(APPROVAL_TABLE)
        approvalGr.addQuery('ticket', ticketSysId)
        approvalGr.query()
        if (!approvalGr.hasNext()) {
            return false
        }
        while (approvalGr.next()) {
            if (approvalGr.di_status != 'complete') {
                return false
            }
        }
        return true
    }

    function setAllDiPending(ticketSysId) {
        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            approvalGr.di_status = 'pending'
            approvalGr.di_error = ''
            approvalGr.update()
        })
    }

    function setAllDiFailed(ticketSysId, message) {
        forEachApprovalByTicket(ticketSysId, function (approvalGr) {
            approvalGr.setWorkflow(false)
            approvalGr.di_status = 'failed'
            approvalGr.di_error = truncateError(message)
            approvalGr.di_processed_at = new GlideDateTime()
            approvalGr.update()
        })
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

    function ensureHybridApprovals(ticketSysId, placeholderGr) {
        var pi01TypeId = resolveWorkflowTypeSysId('PI01')
        var ch11TypeId = resolveWorkflowTypeSysId('CH11')

        var pi01Gr = findApprovalByWorkflowCode(ticketSysId, 'PI01')
        var ch11Gr = findApprovalByWorkflowCode(ticketSysId, 'CH11')

        if (pi01Gr && ch11Gr) {
            return { pi01: pi01Gr, ch11: ch11Gr }
        }

        if (!pi01Gr) {
            if (!placeholderGr) {
                placeholderGr = findApprovalByTicket(ticketSysId)
            }
            if (!placeholderGr) {
                throw new Error('Approval row missing for hybrid split.')
            }

            placeholderGr.setWorkflow(false)
            placeholderGr.workflow_type = pi01TypeId
            placeholderGr.is_hybrid_segment = true
            placeholderGr.update()
            pi01Gr = placeholderGr
        }

        if (!ch11Gr) {
            ch11Gr = new GlideRecord(APPROVAL_TABLE)
            ch11Gr.initialize()
            ch11Gr.ticket = ticketSysId
            ch11Gr.workflow_type = ch11TypeId
            ch11Gr.is_hybrid_segment = true
            copyRowFields(pi01Gr, ch11Gr, CONTRACT_COPY_COLUMNS)
            ch11Gr.insert()
        }

        return { pi01: pi01Gr, ch11: ch11Gr }
    }

    function applyHybridSegments(ticketSysId, placeholderGr, mapper, segmentResult) {
        var hybridRows = ensureHybridApprovals(ticketSysId, placeholderGr)
        var segments = segmentResult.segments || []
        var shared = segmentResult.shared || { values: {}, confidence: {} }
        var index

        for (index = 0; index < segments.length; index++) {
            var segment = segments[index]
            var approvalGr =
                segment.workflowCode === 'PI01'
                    ? hybridRows.pi01
                    : segment.workflowCode === 'CH11'
                      ? hybridRows.ch11
                      : null

            if (!approvalGr) {
                continue
            }

            if (!approvalGr.get(approvalGr.getUniqueValue())) {
                throw new Error('Approval row disappeared during hybrid Doc Intel processing.')
            }

            approvalGr.setWorkflow(false)
            applyMappedValues(approvalGr, mapper.mergeMapped(shared, segment))
            approvalGr.di_status = 'complete'
            approvalGr.di_error = ''
            approvalGr.di_processed_at = new GlideDateTime()
            approvalGr.update()
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

    if (ticketGr.stp_flag == true) {
        forEachApprovalByTicket(ticketSysId, function (row) {
            row.setWorkflow(false)
            row.di_status = 'skipped'
            row.di_error = ''
            row.di_processed_at = new GlideDateTime()
            row.update()
        })
        return
    }

    if (allApprovalsDiComplete(ticketSysId)) {
        return
    }

    setAllDiPending(ticketSysId)

    try {
        var client = new x_2058901_demo.DocIntelClient()
        var result = client.analyzeInvoicePdf(current.sys_id)
        var documents = result.documents

        if (!documents || !documents.length) {
            throw new Error('Doc Intel returned no documents.')
        }

        var mapper = new x_2058901_demo.MapDocIntelToApproval()
        var segmentResult = mapper.mapDocumentSegments(documents[0])

        if (segmentResult.hybrid) {
            applyHybridSegments(ticketSysId, approvalGr, mapper, segmentResult)
            return
        }

        if (!approvalGr.get(approvalGr.getUniqueValue())) {
            throw new Error('Approval row disappeared during Doc Intel processing.')
        }

        if (!approvalGr.workflow_type) {
            approvalGr.workflow_type = ticketGr.workflow_type
        }

        approvalGr.setWorkflow(false)
        applyMappedValues(approvalGr, segmentResult.mapped)
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
        setAllDiFailed(ticketSysId, message)
    }
})()
