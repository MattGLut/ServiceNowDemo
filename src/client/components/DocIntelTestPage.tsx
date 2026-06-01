import React, { useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import { DocIntelTestService } from '../services/DocIntelTestService'
import { BTN_PRIMARY, INPUT_CLASS, LABEL_CLASS } from './formStyles'

export default function DocIntelTestPage() {
    const docIntelTestService = useMemo(() => new DocIntelTestService(), [])
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resultJson, setResultJson] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)
        setResultJson(null)

        if (!file) {
            setError('Choose a PDF file first.')
            return
        }

        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
            setError('Only PDF files are supported.')
            return
        }

        setLoading(true)

        try {
            const result = await docIntelTestService.testInvoicePdf(file)
            setResultJson(JSON.stringify(result, null, 2))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Doc Intel test failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PortalLayout>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <h1 className="m-0 text-2xl font-semibold text-rh-text">Test Doc Intel endpoint</h1>
                <p className="mt-2 mb-0 text-sm text-rh-muted">
                    Upload a PDF to call the outbound REST message{' '}
                    <code className="text-rh-text">x_2058901_demo TSC APIM / post_doc_intel_invoice</code>{' '}
                    through a server-side proxy.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className={LABEL_CLASS} htmlFor="doc-intel-pdf">
                            Invoice PDF
                        </label>
                        <input
                            id="doc-intel-pdf"
                            type="file"
                            accept="application/pdf,.pdf"
                            className={INPUT_CLASS}
                            onChange={(event) => {
                                setFile(event.target.files?.[0] ?? null)
                                setError(null)
                                setResultJson(null)
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {loading ? 'Calling Doc Intel…' : 'Run Doc Intel test'}
                    </button>
                </form>

                {error ? (
                    <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {error}
                    </div>
                ) : null}

                {resultJson ? (
                    <div className="mt-6">
                        <h2 className="m-0 text-sm font-semibold text-rh-text">Response</h2>
                        <pre className="mt-2 max-h-[32rem] overflow-auto rounded-md border border-rh-border bg-rh-surface p-4 text-xs text-rh-text">
                            {resultJson}
                        </pre>
                    </div>
                ) : null}
            </div>
        </PortalLayout>
    )
}
