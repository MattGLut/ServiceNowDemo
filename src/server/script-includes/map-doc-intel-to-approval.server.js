var MapDocIntelToApproval = Class.create()
MapDocIntelToApproval.prototype = {
    initialize: function () {},

    getFieldObject: function (fields, name) {
        if (!fields || !name) {
            return null
        }
        return fields[name] || null
    },

    getFieldString: function (fields, name) {
        var field = this.getFieldObject(fields, name)
        if (!field) {
            return ''
        }
        var value = field.ValueString
        if (value === null || value === undefined || String(value).trim() === '') {
            value = field.Content
        }
        if (value === null || value === undefined) {
            return ''
        }
        return String(value).trim()
    },

    getFieldConfidence: function (fields, name) {
        var field = this.getFieldObject(fields, name)
        if (!field || field.Confidence === null || field.Confidence === undefined) {
            return null
        }
        return field.Confidence
    },

    parseUsDateToGlideDate: function (value) {
        var trimmed = (value || '').trim()
        if (!trimmed) {
            return ''
        }

        var parts = trimmed.split('/')
        if (parts.length !== 3) {
            return ''
        }

        var month = parts[0]
        var day = parts[1]
        var year = parts[2]

        if (month.length === 1) {
            month = '0' + month
        }
        if (day.length === 1) {
            day = '0' + day
        }

        return year + '-' + month + '-' + day
    },

    parseAmount: function (value) {
        var trimmed = (value || '').trim()
        if (!trimmed) {
            return ''
        }

        var normalized = trimmed.replace(/[$,\s]/g, '')
        if (!normalized) {
            return ''
        }

        var amount = parseFloat(normalized)
        if (isNaN(amount)) {
            return ''
        }

        return String(amount)
    },

    inferCurrencyFromAmount: function (amountString) {
        var value = (amountString || '').trim()
        if (!value) {
            return ''
        }
        if (value.indexOf('$') !== -1) {
            return 'USD'
        }
        if (value.indexOf('€') !== -1) {
            return 'EUR'
        }
        if (value.indexOf('£') !== -1) {
            return 'GBP'
        }
        return ''
    },

    parseChargesSubTable: function (fields) {
        var chargesField = this.getFieldObject(fields, 'ChargesSubTable')
        if (!chargesField || !chargesField.ValueList || !chargesField.ValueList.length) {
            return { subtotal: '', tax: '', confidence: null }
        }

        var subtotalSum = 0
        var taxSum = 0
        var hasSubtotalLines = false
        var hasTaxLines = false
        var lineConfidence = null
        var index

        for (index = 0; index < chargesField.ValueList.length; index++) {
            var row = chargesField.ValueList[index]
            var rowDict = row && row.ValueDictionary ? row.ValueDictionary : null
            if (!rowDict) {
                continue
            }

            var amountField = rowDict.ChargesAmount
            var amountString =
                amountField && amountField.ValueString != null
                    ? String(amountField.ValueString)
                    : amountField && amountField.Content
                      ? String(amountField.Content)
                      : ''
            var parsedAmount = this.parseAmount(amountString)
            if (!parsedAmount) {
                continue
            }

            var amount = parseFloat(parsedAmount)
            if (isNaN(amount)) {
                continue
            }

            var description = ''
            if (rowDict.ChargesDescription) {
                if (rowDict.ChargesDescription.ValueString) {
                    description = String(rowDict.ChargesDescription.ValueString)
                } else if (rowDict.ChargesDescription.Content) {
                    description = String(rowDict.ChargesDescription.Content)
                }
            }
            description = description.toLowerCase()

            var isTaxLine = /(^|\s)(tax|vat|gst|hst|pst)(\s|$)/.test(description)

            if (isTaxLine) {
                taxSum += amount
                hasTaxLines = true
            } else {
                subtotalSum += amount
                hasSubtotalLines = true
            }

            if (amountField && amountField.Confidence !== null && amountField.Confidence !== undefined) {
                lineConfidence =
                    lineConfidence === null
                        ? amountField.Confidence
                        : Math.min(lineConfidence, amountField.Confidence)
            }
        }

        if (lineConfidence === null && chargesField.Confidence !== null && chargesField.Confidence !== undefined) {
            lineConfidence = chargesField.Confidence
        }

        return {
            subtotal: hasSubtotalLines ? String(subtotalSum) : '',
            tax: hasTaxLines ? String(taxSum) : '',
            confidence: lineConfidence,
        }
    },

    deriveTaxFromTotals: function (totalAmount, subtotalAmount, existingTax) {
        if (existingTax) {
            return existingTax
        }
        if (!totalAmount || !subtotalAmount) {
            return ''
        }

        var total = parseFloat(totalAmount)
        var subtotal = parseFloat(subtotalAmount)
        if (isNaN(total) || isNaN(subtotal) || total <= subtotal) {
            return ''
        }

        return String(total - subtotal)
    },

    setMappedValue: function (values, confidence, column, value, confScore) {
        if (value) {
            values[column] = value
        }
        if (confScore !== null && confScore !== undefined && (value || confScore)) {
            confidence[column] = confScore
        }
    },

    copyMappedFields: function (source, target) {
        var key
        if (!source) {
            return
        }
        for (key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    },

    mergeMapped: function (shared, segment) {
        var values = {}
        var confidence = {}
        this.copyMappedFields(shared && shared.values ? shared.values : {}, values)
        this.copyMappedFields(segment && segment.values ? segment.values : {}, values)
        this.copyMappedFields(shared && shared.confidence ? shared.confidence : {}, confidence)
        this.copyMappedFields(segment && segment.confidence ? segment.confidence : {}, confidence)
        return { values: values, confidence: confidence }
    },

    sumInvoiceDetailsAmounts: function (fields) {
        var detailsField = this.getFieldObject(fields, 'InvoiceDetails')
        if (!detailsField || !detailsField.ValueList || !detailsField.ValueList.length) {
            return { sum: '', confidence: null }
        }

        var sum = 0
        var hasLines = false
        var lineConfidence = null
        var index

        for (index = 0; index < detailsField.ValueList.length; index++) {
            var row = detailsField.ValueList[index]
            var rowDict = row && row.ValueDictionary ? row.ValueDictionary : null
            if (!rowDict) {
                continue
            }

            var amountField = rowDict.ProductAmount
            var amountString =
                amountField && amountField.ValueString != null
                    ? String(amountField.ValueString)
                    : amountField && amountField.Content
                      ? String(amountField.Content)
                      : ''
            var parsedAmount = this.parseAmount(amountString)
            if (!parsedAmount) {
                continue
            }

            var amount = parseFloat(parsedAmount)
            if (isNaN(amount)) {
                continue
            }

            sum += amount
            hasLines = true

            if (amountField && amountField.Confidence !== null && amountField.Confidence !== undefined) {
                lineConfidence =
                    lineConfidence === null
                        ? amountField.Confidence
                        : Math.min(lineConfidence, amountField.Confidence)
            }
        }

        if (lineConfidence === null && detailsField.Confidence !== null && detailsField.Confidence !== undefined) {
            lineConfidence = detailsField.Confidence
        }

        return {
            sum: hasLines ? String(sum) : '',
            confidence: lineConfidence,
        }
    },

    sumChargesSubTableAmounts: function (fields) {
        var chargesField = this.getFieldObject(fields, 'ChargesSubTable')
        if (!chargesField || !chargesField.ValueList || !chargesField.ValueList.length) {
            return { sum: '', confidence: null }
        }

        var sum = 0
        var hasLines = false
        var lineConfidence = null
        var index

        for (index = 0; index < chargesField.ValueList.length; index++) {
            var row = chargesField.ValueList[index]
            var rowDict = row && row.ValueDictionary ? row.ValueDictionary : null
            if (!rowDict) {
                continue
            }

            var amountField = rowDict.ChargesAmount
            var amountString =
                amountField && amountField.ValueString != null
                    ? String(amountField.ValueString)
                    : amountField && amountField.Content
                      ? String(amountField.Content)
                      : ''
            var parsedAmount = this.parseAmount(amountString)
            if (!parsedAmount) {
                continue
            }

            var amount = parseFloat(parsedAmount)
            if (isNaN(amount)) {
                continue
            }

            sum += amount
            hasLines = true

            if (amountField && amountField.Confidence !== null && amountField.Confidence !== undefined) {
                lineConfidence =
                    lineConfidence === null
                        ? amountField.Confidence
                        : Math.min(lineConfidence, amountField.Confidence)
            }
        }

        if (lineConfidence === null && chargesField.Confidence !== null && chargesField.Confidence !== undefined) {
            lineConfidence = chargesField.Confidence
        }

        return {
            sum: hasLines ? String(sum) : '',
            confidence: lineConfidence,
        }
    },

    isHybridDocument: function (fields) {
        if (!fields) {
            return false
        }

        var piAmounts = this.sumInvoiceDetailsAmounts(fields)
        var chAmounts = this.sumChargesSubTableAmounts(fields)

        if (!piAmounts.sum || !chAmounts.sum) {
            return false
        }

        var piTotal = parseFloat(piAmounts.sum)
        var chTotal = parseFloat(chAmounts.sum)

        return !isNaN(piTotal) && piTotal > 0 && !isNaN(chTotal) && chTotal > 0
    },

    mapSharedFields: function (document, values, confidence) {
        var fields = document && document.Fields ? document.Fields : null
        if (!fields) {
            return
        }

        var invoiceNumber = this.getFieldString(fields, 'InvoiceNumber')
        this.setMappedValue(
            values,
            confidence,
            'invoice_number',
            invoiceNumber,
            this.getFieldConfidence(fields, 'InvoiceNumber')
        )

        var invoiceDate = this.getFieldString(fields, 'InvoiceDate')
        if (!invoiceDate) {
            invoiceDate = this.getFieldString(fields, 'InvoiceDueDate')
        }
        var glideDate = this.parseUsDateToGlideDate(invoiceDate)
        this.setMappedValue(
            values,
            confidence,
            'req_payment_date',
            glideDate,
            this.getFieldConfidence(fields, 'InvoiceDate') ||
                this.getFieldConfidence(fields, 'InvoiceDueDate')
        )

        var invoiceTotalRaw = this.getFieldString(fields, 'InvoiceTotalAmount')
        var currency = this.getFieldString(fields, 'InvoiceTotalCurrency')
        if (!currency) {
            currency = this.inferCurrencyFromAmount(invoiceTotalRaw)
        }
        if (!currency) {
            currency = this.getFieldString(fields, 'DiscountCurrency')
        }
        this.setMappedValue(
            values,
            confidence,
            'currency',
            currency,
            this.getFieldConfidence(fields, 'InvoiceTotalCurrency') ||
                this.getFieldConfidence(fields, 'InvoiceTotalAmount')
        )

        var vendorName = this.getFieldString(fields, 'VendorName')
        this.setMappedValue(
            values,
            confidence,
            'charge_payee_name',
            vendorName,
            this.getFieldConfidence(fields, 'VendorName')
        )

        if (document.Confidence !== null && document.Confidence !== undefined) {
            confidence._document = document.Confidence
        }
    },

    mapDocumentSegments: function (document) {
        var fields = document && document.Fields ? document.Fields : null

        if (!fields) {
            return {
                hybrid: false,
                mapped: { values: {}, confidence: {} },
            }
        }

        if (!this.isHybridDocument(fields)) {
            return {
                hybrid: false,
                mapped: this.mapDocument(document),
            }
        }

        var shared = { values: {}, confidence: {} }
        this.mapSharedFields(document, shared.values, shared.confidence)

        var piAmounts = this.sumInvoiceDetailsAmounts(fields)
        var chAmounts = this.sumChargesSubTableAmounts(fields)

        var piSegment = {
            workflowCode: 'PI01',
            values: {},
            confidence: {},
        }
        this.copyMappedFields(shared.values, piSegment.values)
        this.copyMappedFields(shared.confidence, piSegment.confidence)
        this.setMappedValue(
            piSegment.values,
            piSegment.confidence,
            'subtotal_amount',
            piAmounts.sum,
            piAmounts.confidence
        )
        this.setMappedValue(
            piSegment.values,
            piSegment.confidence,
            'total_amount',
            piAmounts.sum,
            piAmounts.confidence
        )

        var chSegment = {
            workflowCode: 'CH11',
            values: {},
            confidence: {},
        }
        this.copyMappedFields(shared.values, chSegment.values)
        this.copyMappedFields(shared.confidence, chSegment.confidence)
        this.setMappedValue(
            chSegment.values,
            chSegment.confidence,
            'subtotal_amount',
            chAmounts.sum,
            chAmounts.confidence
        )
        this.setMappedValue(
            chSegment.values,
            chSegment.confidence,
            'total_amount',
            chAmounts.sum,
            chAmounts.confidence
        )

        return {
            hybrid: true,
            shared: shared,
            segments: [piSegment, chSegment],
        }
    },

    mapDocument: function (document) {
        var values = {}
        var confidence = {}
        var fields = document && document.Fields ? document.Fields : null

        if (!fields) {
            return { values: values, confidence: confidence }
        }

        var invoiceNumber = this.getFieldString(fields, 'InvoiceNumber')
        this.setMappedValue(
            values,
            confidence,
            'invoice_number',
            invoiceNumber,
            this.getFieldConfidence(fields, 'InvoiceNumber')
        )

        var invoiceDate = this.getFieldString(fields, 'InvoiceDate')
        if (!invoiceDate) {
            invoiceDate = this.getFieldString(fields, 'InvoiceDueDate')
        }
        var glideDate = this.parseUsDateToGlideDate(invoiceDate)
        this.setMappedValue(
            values,
            confidence,
            'req_payment_date',
            glideDate,
            this.getFieldConfidence(fields, 'InvoiceDate') ||
                this.getFieldConfidence(fields, 'InvoiceDueDate')
        )

        var invoiceTotalRaw = this.getFieldString(fields, 'InvoiceTotalAmount')
        var totalAmount = this.parseAmount(invoiceTotalRaw)
        this.setMappedValue(
            values,
            confidence,
            'total_amount',
            totalAmount,
            this.getFieldConfidence(fields, 'InvoiceTotalAmount')
        )

        var charges = this.parseChargesSubTable(fields)
        this.setMappedValue(
            values,
            confidence,
            'subtotal_amount',
            charges.subtotal,
            charges.confidence
        )

        var taxAmount = this.deriveTaxFromTotals(totalAmount, charges.subtotal, charges.tax)
        this.setMappedValue(values, confidence, 'tax_amount', taxAmount, charges.confidence)

        var currency = this.getFieldString(fields, 'InvoiceTotalCurrency')
        if (!currency) {
            currency = this.inferCurrencyFromAmount(invoiceTotalRaw)
        }
        if (!currency) {
            currency = this.getFieldString(fields, 'DiscountCurrency')
        }
        this.setMappedValue(
            values,
            confidence,
            'currency',
            currency,
            this.getFieldConfidence(fields, 'InvoiceTotalCurrency') ||
                this.getFieldConfidence(fields, 'InvoiceTotalAmount')
        )

        var vendorName = this.getFieldString(fields, 'VendorName')
        this.setMappedValue(
            values,
            confidence,
            'charge_payee_name',
            vendorName,
            this.getFieldConfidence(fields, 'VendorName')
        )

        if (document.Confidence !== null && document.Confidence !== undefined) {
            confidence._document = document.Confidence
        }

        return { values: values, confidence: confidence }
    },

    type: 'MapDocIntelToApproval',
}
