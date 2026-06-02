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

    setMappedValue: function (values, confidence, column, value, confScore) {
        if (value) {
            values[column] = value
        }
        if (confScore !== null && confScore !== undefined && (value || confScore)) {
            confidence[column] = confScore
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

        var totalAmount = this.parseAmount(this.getFieldString(fields, 'InvoiceTotalAmount'))
        this.setMappedValue(
            values,
            confidence,
            'total_amount',
            totalAmount,
            this.getFieldConfidence(fields, 'InvoiceTotalAmount')
        )

        var currency = this.getFieldString(fields, 'InvoiceTotalCurrency')
        this.setMappedValue(
            values,
            confidence,
            'currency',
            currency,
            this.getFieldConfidence(fields, 'InvoiceTotalCurrency')
        )

        var vendorName = this.getFieldString(fields, 'VendorName')
        this.setMappedValue(
            values,
            confidence,
            'charge_payee_name',
            vendorName,
            this.getFieldConfidence(fields, 'VendorName')
        )

        var paymentTerms = this.getFieldString(fields, 'PaymentTerms')
        this.setMappedValue(
            values,
            confidence,
            'payment_method',
            paymentTerms,
            this.getFieldConfidence(fields, 'PaymentTerms')
        )

        if (document.Confidence !== null && document.Confidence !== undefined) {
            confidence._document = document.Confidence
        }

        return { values: values, confidence: confidence }
    },

    type: 'MapDocIntelToApproval',
}
