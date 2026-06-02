(function process(/* RESTAPIRequest */ request, /* RESTAPIResponse */ response) {
    var attachmentSysId = null

    try {
        var bodyString = request.body.dataString
        if (!bodyString) {
            response.setStatus(400)
            response.setBody({ error: 'Request body is required.' })
            return
        }

        var payload = JSON.parse(bodyString)
        var pdfBase64 = (payload.pdf_base64 || '').trim()
        var fileName = (payload.file_name || 'invoice.pdf').trim() || 'invoice.pdf'

        if (!pdfBase64) {
            response.setStatus(400)
            response.setBody({ error: 'pdf_base64 is required.' })
            return
        }

        var userGr = new GlideRecord('sys_user')
        if (!userGr.get(gs.getUserID())) {
            response.setStatus(500)
            response.setBody({ error: 'Could not resolve current user for temporary attachment.' })
            return
        }

        var attachment = new GlideSysAttachment()
        attachmentSysId = attachment.writeBase64(userGr, fileName, 'application/pdf', pdfBase64)

        if (!attachmentSysId) {
            response.setStatus(500)
            response.setBody({ error: 'Failed to stage PDF for outbound request.' })
            return
        }

        var client = new x_2058901_demo.DocIntelClient()
        var result = client.analyzeInvoicePdf(attachmentSysId)

        response.setStatus(200)
        response.setBody({
            status: 200,
            file_name: fileName,
            documents: result.documents,
        })
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error('Doc Intel test endpoint failed: ' + message)

        if (message.indexOf('Ocp-Apim-Subscription-Key is empty') !== -1) {
            response.setStatus(400)
            response.setBody({
                error:
                    'Ocp-Apim-Subscription-Key is empty on the outbound REST message. Set it under System Web Services → Outbound → REST Message → x_2058901_demo TSC APIM → HTTP Headers.',
            })
            return
        }

        if (message.indexOf('Doc Intel HTTP') === 0) {
            response.setStatus(502)
            response.setBody({
                error: 'Doc Intel request failed.',
                rest_error_message: message,
            })
            return
        }

        response.setStatus(500)
        response.setBody({ error: message, step: 'unexpected' })
    } finally {
        if (attachmentSysId) {
            new GlideSysAttachment().deleteAttachment(attachmentSysId)
        }
    }
})(request, response)
