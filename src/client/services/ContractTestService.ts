declare global {
    interface Window {
        g_ck: string
    }
}

export type ContractTestSuccess = {
    status: number
    contract_id: string
    contracts: unknown
    mapped_values: Record<string, string>
}

export type ContractTestError = {
    error: string
    status?: number
    rest_error_message?: string
}

type ScriptedRestEnvelope<T> = {
    result?: T
    error?: ContractTestError
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

export class ContractTestService {
    async testContractDetails(contractId: string): Promise<ContractTestSuccess> {
        const trimmed = contractId.trim()
        if (!trimmed) {
            throw new Error('Contract number is required.')
        }

        const response = await fetch('/api/x_2058901_demo/contract_test/details', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': window.g_ck,
            },
            body: JSON.stringify({ contract_id: trimmed }),
        })

        const envelope = (await response.json().catch(() => ({}))) as ScriptedRestEnvelope<
            ContractTestSuccess & ContractTestError
        >
        const data = unwrapEnvelope(envelope)

        if (!response.ok) {
            const err = data as ContractTestError
            const detail = [err.error, err.rest_error_message, err.status ? `HTTP ${err.status}` : null]
                .filter(Boolean)
                .join(' — ')
            throw new Error(detail || `HTTP error ${response.status}`)
        }

        return data as ContractTestSuccess
    }
}
