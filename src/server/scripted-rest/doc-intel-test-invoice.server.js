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

        var restMessage = new sn_ws.RESTMessageV2('x_2058901_demo TSC APIM', 'post_doc_intel_invoice')
        restMessage.setHttpMethod('post')
        restMessage.setHttpTimeout(120000)
        restMessage.setRequestBodyFromAttachment(attachmentSysId)

        var diResponse = restMessage.execute()
        var statusCode = diResponse.getStatusCode()
        var responseBody = diResponse.getBody() || ''

        if (statusCode >= 200 && statusCode < 300) {
            var parsed
            try {
                parsed = JSON.parse(responseBody)
            } catch {
                parsed = null
            }

            response.setStatus(200)
            response.setBody({
                status: statusCode,
                file_name: fileName,
                documents: parsed && parsed.Documents ? parsed.Documents : null,
                raw_body: parsed ? undefined : responseBody.substring(0, 4000),
            })
            return
        }

        response.setStatus(502)
        response.setBody({
            error: 'Doc Intel request failed.',
            status: statusCode,
            body: responseBody.substring(0, 2000),
            hint:
                statusCode === 405 || responseBody.indexOf('GET method not supported') !== -1
                    ? 'Outbound REST message may be using GET — verify HTTP method is POST on post_doc_intel_invoice.'
                    : undefined,
        })
    } catch (error) {
        var message = error && error.message ? error.message : String(error)
        gs.error('Doc Intel test endpoint failed: ' + message)
        response.setStatus(500)
        response.setBody({ error: message, step: 'unexpected' })
    } finally {
        if (attachmentSysId) {
            new GlideSysAttachment().deleteAttachment(attachmentSysId)
        }
    }
})(request, response)
