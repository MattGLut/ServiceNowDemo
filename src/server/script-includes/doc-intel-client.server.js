var DocIntelClient = Class.create()
DocIntelClient.prototype = {
    REST_MESSAGE_NAME: 'x_2058901_demo TSC APIM',
    REST_METHOD_NAME: 'post_doc_intel_invoice',
    APIM_KEY_HEADER: 'Ocp-Apim-Subscription-Key',
    HTTP_TIMEOUT_MS: 120000,

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

    getDocuments: function (parsed) {
        if (!parsed) {
            return null
        }
        if (parsed.Documents && parsed.Documents.length) {
            return parsed.Documents
        }
        if (parsed.documents && parsed.documents.length) {
            return parsed.documents
        }
        return null
    },

    analyzeInvoicePdf: function (attachmentSysId) {
        var subscriptionKey = this.getRestMessageHeaderValue(
            this.REST_MESSAGE_NAME,
            this.APIM_KEY_HEADER
        ).trim()

        if (!subscriptionKey) {
            throw new Error(
                'Ocp-Apim-Subscription-Key is empty on outbound REST message x_2058901_demo TSC APIM.'
            )
        }

        if (!attachmentSysId) {
            throw new Error('attachmentSysId is required.')
        }

        var restMessage = new sn_ws.RESTMessageV2(this.REST_MESSAGE_NAME, this.REST_METHOD_NAME)
        restMessage.setHttpMethod('post')
        restMessage.setHttpTimeout(this.HTTP_TIMEOUT_MS)
        restMessage.setRequestHeader('Content-Type', 'application/pdf')
        restMessage.setRequestHeader(this.APIM_KEY_HEADER, subscriptionKey)
        restMessage.setRequestBodyFromAttachment(attachmentSysId)

        var diResponse = restMessage.execute()
        var statusCode = diResponse.getStatusCode()
        var responseBody = diResponse.getBody() || ''
        var haveError = diResponse.haveError()
        var restErrorMessage = haveError ? diResponse.getErrorMessage() : ''

        if (statusCode < 200 || statusCode >= 300 || haveError) {
            throw new Error(
                'Doc Intel HTTP ' +
                    statusCode +
                    (restErrorMessage ? ': ' + restErrorMessage : '') +
                    (responseBody ? ' body=' + responseBody.substring(0, 500) : '')
            )
        }

        var parsed
        try {
            parsed = JSON.parse(responseBody)
        } catch {
            throw new Error('Doc Intel response was not valid JSON.')
        }

        var documents = this.getDocuments(parsed)
        if (!documents || !documents.length) {
            throw new Error('Doc Intel response did not include Documents.')
        }

        return { documents: documents }
    },

    type: 'DocIntelClient',
}
