declare global {
    interface Window {
        g_ck: string
    }
}

export type DocIntelTestSuccess = {
    status: number
    file_name: string
    documents: unknown
    raw_body?: string
}

export type DocIntelTestError = {
    error: string
    status?: number
    body?: string
    hint?: string
    endpoint?: string
    have_error?: boolean
    rest_error_message?: string
    rest_error_code?: number | null
}

type ScriptedRestEnvelope<T> = {
    result?: T
    error?: DocIntelTestError
}

function unwrapEnvelope<T>(envelope: ScriptedRestEnvelope<T>): T {
    if (envelope.result !== undefined && envelope.result !== null) {
        return envelope.result
    }
    if (envelope.error !== undefined) {
        return envelope.error as T
    }
    return {} as T
}

function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                reject(new Error('Could not read file.'))
                return
            }

            const commaIndex = reader.result.indexOf(',')
            if (commaIndex === -1) {
                reject(new Error('Unexpected file encoding.'))
                return
            }

            resolve(reader.result.slice(commaIndex + 1))
        }

        reader.onerror = () => reject(new Error('Failed to read file.'))
        reader.readAsDataURL(file)
    })
}

export class DocIntelTestService {
    async testInvoicePdf(file: File): Promise<DocIntelTestSuccess> {
        const pdfBase64 = await readFileAsBase64(file)

        const response = await fetch('/api/x_2058901_demo/doc_intel_test/invoice', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': window.g_ck,
            },
            body: JSON.stringify({
                pdf_base64: pdfBase64,
                file_name: file.name,
            }),
        })

        const envelope = (await response.json().catch(() => ({}))) as ScriptedRestEnvelope<
            DocIntelTestSuccess & DocIntelTestError
        >
        const data = unwrapEnvelope(envelope)

        if (!response.ok) {
            const err = data as DocIntelTestError
            const detail = [
                err.error,
                err.rest_error_message,
                err.body,
                err.hint,
                err.endpoint ? `Endpoint: ${err.endpoint}` : null,
                err.status ? `Upstream HTTP ${err.status}` : null,
            ]
                .filter(Boolean)
                .join(' — ')
            throw new Error(detail || `HTTP error ${response.status}`)
        }

        return data as DocIntelTestSuccess
    }
}
