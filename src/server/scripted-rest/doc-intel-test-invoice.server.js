(function process(/* RESTAPIRequest */ request, /* RESTAPIResponse */ response) {
    var attachmentSysId = null
    var REST_MESSAGE_NAME = 'x_2058901_demo TSC APIM'
    var REST_METHOD_NAME = 'post_doc_intel_invoice'
    var APIM_KEY_HEADER = 'Ocp-Apim-Subscription-Key'

    function getRestMessageHeaderValue(messageName, headerName) {
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
    }

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

        var subscriptionKey = getRestMessageHeaderValue(REST_MESSAGE_NAME, APIM_KEY_HEADER).trim()
        if (!subscriptionKey) {
            response.setStatus(400)
            response.setBody({
                error:
                    'Ocp-Apim-Subscription-Key is empty on the outbound REST message. Set it under System Web Services → Outbound → REST Message → x_2058901_demo TSC APIM → HTTP Headers.',
            })
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

        var restMessage = new sn_ws.RESTMessageV2(REST_MESSAGE_NAME, REST_METHOD_NAME)
        restMessage.setHttpMethod('post')
        restMessage.setHttpTimeout(120000)
        restMessage.setRequestHeader('Content-Type', 'application/pdf')
        restMessage.setRequestHeader(APIM_KEY_HEADER, subscriptionKey)
        restMessage.setRequestBodyFromAttachment(attachmentSysId)

        var requestEndpoint = restMessage.getEndpoint()
        var diResponse = restMessage.execute()
        var statusCode = diResponse.getStatusCode()
        var responseBody = diResponse.getBody() || ''
        var haveError = diResponse.haveError()
        var restErrorMessage = haveError ? diResponse.getErrorMessage() : ''
        var restErrorCode = haveError ? diResponse.getErrorCode() : null

        if (statusCode >= 200 && statusCode < 300 && !haveError) {
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

        var hint
        if (statusCode === 0 || haveError) {
            hint =
                'No HTTP response from Azure APIM (status 0). Check instance outbound access to tsc-api.azure-api.net, MID/proxy settings, and Outbound HTTP logs. REST error: ' +
                (restErrorMessage || 'none')
        } else if (
            statusCode === 405 ||
            (responseBody && responseBody.indexOf('GET method not supported') !== -1)
        ) {
            hint =
                'Outbound REST message may be using GET — verify HTTP method is POST on post_doc_intel_invoice.'
        }

        response.setStatus(502)
        response.setBody({
            error: 'Doc Intel request failed.',
            status: statusCode,
            body: responseBody.substring(0, 2000),
            endpoint: requestEndpoint,
            have_error: haveError,
            rest_error_message: restErrorMessage,
            rest_error_code: restErrorCode,
            hint: hint,
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
