var MapApprovalToRtmData = Class.create()
MapApprovalToRtmData.prototype = {
    CONTRACT_PATTERN: /^[A-Z]{3}[0-9]{7}$/,

    initialize: function () {},

    getString: function (gr, field) {
        if (!gr || !field) {
            return ''
        }
        var value = gr.getValue(field)
        if (value === null || value === undefined) {
            return ''
        }
        return String(value).trim()
    },

    getWorkflowTypeCode: function (approvalGr) {
        var workflowSysId = approvalGr.getValue('workflow_type')
        if (!workflowSysId) {
            return ''
        }

        var workflowGr = new GlideRecord('x_2058901_demo_workflow_type')
        if (!workflowGr.get(workflowSysId)) {
            return ''
        }

        return this.getString(workflowGr, 'code')
    },

    formatGlideDate: function (value) {
        if (!value) {
            return ''
        }

        var text = String(value)
        if (text.length >= 10) {
            return text.substring(0, 10)
        }

        return text
    },

    parseAmount: function (value) {
        if (value === null || value === undefined || value === '') {
            return null
        }

        var numeric = parseFloat(String(value).replace(/,/g, ''))
        if (isNaN(numeric)) {
            return null
        }

        return Math.round(numeric * 100) / 100
    },

    buildTransactionsShell: function () {
        return {
            urgent: false,
            goodsMovements: {
                tradeType: '1',
                totalCountRZ01: 0,
                transactionItems: [],
            },
            payments: {
                approverId: '',
                approverName: '',
                transactionItems: [],
            },
            chargePayables: {
                approverId: '',
                approverName: '',
                transactionItems: [],
            },
            chargeReceivables: {
                approverId: '',
                approverName: '',
                transactionItems: [],
            },
            attachments: [],
        }
    },

    buildAttachmentPlaceholders: function (attachments) {
        var result = []
        var index

        if (attachments && attachments.length) {
            for (index = 0; index < attachments.length; index++) {
                var attachment = attachments[index]
                result.push({
                    originalFileName: attachment.fileName || 'attachment',
                    source: 'servicenow',
                    attachmentSysId: attachment.sysId || '',
                    contentType: attachment.contentType || 'application/pdf',
                })
            }
        }

        if (result.length === 0) {
            result.push({
                originalFileName: 'invoice.pdf',
                source: 'servicenow',
                attachmentSysId: '',
                contentType: 'application/pdf',
            })
        }

        return result
    },

    getUserContext: function () {
        var user = gs.getUser()

        return {
            lastUpdatedById: user.getValue('user_name') || '',
            lastUpdatedByName: user.getDisplayName() || '',
            lastUpdatedByEmail: user.getEmail() || '',
        }
    },

    buildEnvelope: function (approvalGr, ticketGr, workflowTypeCode, userCtx) {
        var idNbr = this.getString(ticketGr, 'external_id') || ticketGr.getUniqueValue()

        return {
            idNbr: idNbr,
            ticketNumber: idNbr,
            ticketSubject: this.getString(ticketGr, 'title'),
            ticketPrefix: 'SN',
            lastUpdatedById: userCtx.lastUpdatedById,
            lastUpdatedByName: userCtx.lastUpdatedByName,
            lastUpdatedByEmail: userCtx.lastUpdatedByEmail,
            uwfSubmissionId: 1,
            uwfVersionId: 1,
            lastUpdated: new Date().toISOString(),
            sourceSystem: 'servicenow',
            workflowTypeCode: workflowTypeCode,
            transactions: this.buildTransactionsShell(),
        }
    },

    buildPi01Section: function (approvalGr, ticketGr, attachments, comments) {
        var contractNumber =
            this.getString(approvalGr, 'contract_number') || this.getString(ticketGr, 'external_id')
        var invoiceDate = this.formatGlideDate(approvalGr.getValue('invoice_date'))
        var requestedPaymentDate = this.formatGlideDate(approvalGr.getValue('req_payment_date'))
        var amount = this.parseAmount(approvalGr.getValue('total_amount'))
        var paymentMethod = this.getString(approvalGr, 'payment_method')

        return {
            approverId: this.getString(approvalGr, 'approver_id'),
            approverName: this.getString(approvalGr, 'approver_name'),
            transactionItems: [
                {
                    name: 'PMT1',
                    transactionId: '',
                    urgent: false,
                    companyCode: this.getString(approvalGr, 'company_code'),
                    profitCenter: this.getString(approvalGr, 'profit_center'),
                    requestedPaymentDate: requestedPaymentDate || null,
                    requestedPostingDate: null,
                    paymentMethod: paymentMethod,
                    currency: this.getString(approvalGr, 'currency'),
                    invoicingPartyId: this.getString(approvalGr, 'invoicing_party_id'),
                    invoicingPartyName: this.getString(approvalGr, 'charge_payee_name'),
                    partnerBankId: '',
                    partnerBankDetails: '',
                    alternatePayeeId: '',
                    alternatePayeeName: '',
                    alternatePayee: { payeeId: '', payeeName: '', index: '' },
                    checkSubaddress: { subaddressCode: '', companyCode: '', index: null },
                    totalAmount: amount,
                    attachments: attachments,
                    comments: comments,
                    addNumLineItems: 1,
                    transactionLineItems: [
                        {
                            contractNumber: contractNumber,
                            realizeNumber: this.getString(approvalGr, 'realize_number'),
                            invoiceNumber: this.getString(approvalGr, 'invoice_number'),
                            invoiceSubnumber: this.getString(approvalGr, 'invoice_subnumber'),
                            invoiceDate: invoiceDate,
                            amount: amount,
                            taxCode: this.getString(approvalGr, 'tax_code'),
                            specialCases: '',
                            remarks: this.getString(approvalGr, 'reviewer_notes').substring(0, 50),
                            remarks2: this.getString(approvalGr, 'supervisor_notes').substring(0, 50),
                            cashDiscountAmount: 0,
                            cashDiscountIsPercent: false,
                            advanceOrOffsetAmount: 0,
                            advancedReceipt: false,
                            advancedReceiptWorkflowId: '',
                            lineItemId: null,
                            checked: false,
                        },
                    ],
                },
            ],
        }
    },

    buildCh11Section: function (approvalGr, ticketGr, attachments, comments) {
        var contractNumber =
            this.getString(approvalGr, 'contract_number') || this.getString(ticketGr, 'external_id')
        var requestedPaymentDate = this.formatGlideDate(approvalGr.getValue('req_payment_date'))
        var amount = this.parseAmount(approvalGr.getValue('total_amount'))
        var lineProfitCenter =
            this.getString(approvalGr, 'line_profit_center') || this.getString(approvalGr, 'profit_center')

        return {
            approverId: this.getString(approvalGr, 'approver_id'),
            approverName: this.getString(approvalGr, 'approver_name'),
            transactionItems: [
                {
                    name: 'CHP1',
                    transactionId: '',
                    urgent: false,
                    companyCode: this.getString(approvalGr, 'company_code'),
                    profitCenter: this.getString(approvalGr, 'profit_center'),
                    chargePayeeId: this.getString(approvalGr, 'charge_payee_id'),
                    chargePayeeName: this.getString(approvalGr, 'charge_payee_name'),
                    paymentMethod: this.getString(approvalGr, 'payment_method'),
                    currency: this.getString(approvalGr, 'currency'),
                    requestedPaymentDate: requestedPaymentDate || null,
                    requestedPostingDate: null,
                    partnerBankId: '',
                    alternatePayeeId: '',
                    alternatePayeeName: '',
                    checkSubaddressCode: '',
                    totalAmount: amount,
                    attachments: attachments,
                    comments: comments,
                    transactionLineItems: [
                        {
                            contractNumber: contractNumber,
                            realizeNumber: this.getString(approvalGr, 'realize_number'),
                            profitCenter: lineProfitCenter,
                            chargeType: this.getString(approvalGr, 'charge_type'),
                            invoiceNumber: this.getString(approvalGr, 'invoice_number'),
                            invoiceSubnumber: this.getString(approvalGr, 'invoice_subnumber'),
                            salesOrPurchase: this.getString(approvalGr, 'sales_or_purchase'),
                            amount: amount,
                            taxCode: this.getString(approvalGr, 'tax_code'),
                            text: '',
                            remarks: this.getString(approvalGr, 'reviewer_notes').substring(0, 50),
                            remarks2: this.getString(approvalGr, 'supervisor_notes').substring(0, 50),
                            cashDiscountAmount: 0,
                            offsetAmount: 0,
                            taxWithholdingAmount: 0,
                            lineItemId: null,
                        },
                    ],
                },
            ],
        }
    },

    validatePi01: function (payload) {
        var payments = payload.transactions.payments
        var item = payments.transactionItems[0]
        var line = item.transactionLineItems[0]
        var errors = []

        if (!item.companyCode) errors.push('companyCode is required')
        if (!item.profitCenter) errors.push('profitCenter is required')
        if (!item.paymentMethod) errors.push('paymentMethod is required')
        if (!item.currency) errors.push('currency is required')
        if (!item.requestedPaymentDate) errors.push('requestedPaymentDate is required')
        if (!line.contractNumber || !this.CONTRACT_PATTERN.test(line.contractNumber)) {
            errors.push('contractNumber must match pattern AAA9999999')
        }
        if (!line.realizeNumber || !/^[A-Za-z0-9]{1,2}$/.test(line.realizeNumber)) {
            errors.push('realizeNumber must be 1-2 alphanumeric characters')
        }
        if (!line.invoiceNumber) errors.push('invoiceNumber is required')
        if (!line.invoiceDate) errors.push('invoiceDate is required')
        if (!line.amount || line.amount <= 0) errors.push('amount must be greater than 0')
        if (!line.taxCode) errors.push('taxCode is required')
        if (!item.invoicingPartyId) errors.push('invoicingPartyId is required')

        return errors.length ? errors.join('; ') : ''
    },

    validateCh11: function (payload) {
        var chargePayables = payload.transactions.chargePayables
        var item = chargePayables.transactionItems[0]
        var line = item.transactionLineItems[0]
        var errors = []

        if (!chargePayables.approverId) errors.push('approverId is required')
        if (!item.chargePayeeId) errors.push('chargePayeeId is required')
        if (!item.paymentMethod) errors.push('paymentMethod is required')
        if (!item.currency) errors.push('currency is required')
        if (!item.requestedPaymentDate) errors.push('requestedPaymentDate is required')
        if (!item.companyCode) errors.push('companyCode is required')
        if (!item.profitCenter) errors.push('profitCenter is required')
        if (!line.contractNumber || !this.CONTRACT_PATTERN.test(line.contractNumber)) {
            errors.push('contractNumber must match pattern AAA9999999')
        }
        if (line.realizeNumber && !/^[A-Za-z0-9]{0,2}$/.test(line.realizeNumber)) {
            errors.push('realizeNumber must be 0-2 alphanumeric characters')
        }
        if (!line.profitCenter) errors.push('line profitCenter is required')
        if (!line.chargeType) errors.push('chargeType is required')
        if (!line.invoiceNumber) errors.push('invoiceNumber is required')
        if (!line.amount || line.amount <= 0) errors.push('amount must be greater than 0')
        if (!line.taxCode) errors.push('taxCode is required')
        if (line.salesOrPurchase !== 'S' && line.salesOrPurchase !== 'P') {
            errors.push('salesOrPurchase must be S or P')
        }

        return errors.length ? errors.join('; ') : ''
    },

    buildRtmPayload: function (approvalGr, ticketGr, attachments) {
        var workflowTypeCode = this.getWorkflowTypeCode(approvalGr)

        if (workflowTypeCode !== 'PI01' && workflowTypeCode !== 'CH11') {
            return {
                payload: null,
                error: 'Unsupported workflow type: ' + (workflowTypeCode || 'unknown'),
            }
        }

        var userCtx = this.getUserContext()
        var payload = this.buildEnvelope(approvalGr, ticketGr, workflowTypeCode, userCtx)
        var attachmentPlaceholders = this.buildAttachmentPlaceholders(attachments)
        var comments = userCtx.lastUpdatedByName ? '[' + userCtx.lastUpdatedByName + ']' : ''
        var validationError = ''

        if (workflowTypeCode === 'PI01') {
            payload.transactions.payments = this.buildPi01Section(
                approvalGr,
                ticketGr,
                attachmentPlaceholders,
                comments
            )
            validationError = this.validatePi01(payload)
        } else {
            payload.transactions.chargePayables = this.buildCh11Section(
                approvalGr,
                ticketGr,
                attachmentPlaceholders,
                comments
            )
            validationError = this.validateCh11(payload)
        }

        if (validationError) {
            return { payload: null, error: validationError }
        }

        return { payload: payload, error: '' }
    },

    type: 'MapApprovalToRtmData',
}
