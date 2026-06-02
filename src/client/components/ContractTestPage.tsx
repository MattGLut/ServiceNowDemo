import React, { useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import { ContractTestService } from '../services/ContractTestService'
import { BTN_PRIMARY, INPUT_CLASS, LABEL_CLASS } from './formStyles'

export default function ContractTestPage() {
    const contractTestService = useMemo(() => new ContractTestService(), [])
    const [contractId, setContractId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resultJson, setResultJson] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)
        setResultJson(null)

        if (!contractId.trim()) {
            setError('Enter a contract number first.')
            return
        }

        setLoading(true)

        try {
            const result = await contractTestService.testContractDetails(contractId)
            setResultJson(JSON.stringify(result, null, 2))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Contract API test failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PortalLayout>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <h1 className="m-0 text-2xl font-semibold text-rh-text">Test Contract API endpoint</h1>
                <p className="mt-2 mb-0 text-sm text-rh-muted">
                    Look up a MUGEN contract by number via the outbound REST message{' '}
                    <code className="text-rh-text">x_2058901_demo TSC APIM / get_contract</code> through a
                    server-side proxy. Returns raw contract data and mapped approval field values.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className={LABEL_CLASS} htmlFor="contract-test-id">
                            Contract number
                        </label>
                        <input
                            id="contract-test-id"
                            type="text"
                            className={INPUT_CLASS}
                            placeholder="e.g. CDH0144105"
                            value={contractId}
                            onChange={(event) => {
                                setContractId(event.target.value)
                                setError(null)
                                setResultJson(null)
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !contractId.trim()}
                        className={`${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {loading ? 'Calling Contract API…' : 'Run Contract API test'}
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
