import React, { useMemo, useState } from 'react'
import TicketIntakeForm from './components/TicketIntakeForm'
import { TicketService } from './services/TicketService'
import type { TicketCreateResult } from './types/ticket'

export default function App() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [error, setError] = useState<string | null>(null)
    const [lastSubmission, setLastSubmission] = useState<TicketCreateResult | null>(null)
    const [attachmentCount, setAttachmentCount] = useState(0)

    const handleSubmit = async (input: { title: string; description: string; files: File[] }) => {
        setError(null)
        setLastSubmission(null)

        let result: TicketCreateResult | null = null

        try {
            result = await ticketService.create({
                title: input.title,
                description: input.description,
            })

            if (input.files.length > 0) {
                await ticketService.uploadAttachments(result.sysId, input.files)
            }

            setLastSubmission(result)
            setAttachmentCount(input.files.length)
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(
                result
                    ? `Ticket was created but a follow-up step failed: ${message} (sys_id: ${result.sysId})`
                    : 'Failed to submit ticket: ' + message
            )
            console.error(err)
            throw err
        }
    }

    return (
        <div className="min-h-screen w-full bg-rh-bg p-5 font-sans max-md:p-3">
            <header className="mb-8 border-b border-rh-border pb-6">
                <h1 className="m-0 text-2xl font-bold tracking-tight text-rh-text max-md:text-xl">
                    Ticket Intake Portal
                </h1>
                <p className="mt-2 mb-0 text-sm text-rh-muted">
                    Submit tickets with supporting documents for straight-through or document intelligence
                    processing.
                </p>
            </header>

            {error && (
                <div className="mb-5 flex items-center justify-between rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent font-semibold text-red-400 underline hover:text-red-300"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {lastSubmission && (
                <div className="mb-5 rounded-lg border border-rh-green/40 bg-rh-green/10 px-4 py-3 text-rh-green">
                    <p className="m-0 font-semibold">Ticket submitted</p>
                    <p className="mb-0 mt-1 text-sm">
                        <span className="text-rh-text">{lastSubmission.title}</span>
                        {attachmentCount > 0 && (
                            <span className="text-rh-muted">
                                {' '}
                                — {attachmentCount} file{attachmentCount === 1 ? '' : 's'} attached
                            </span>
                        )}
                    </p>
                    <p className="mb-0 mt-2 font-mono text-xs text-rh-muted">sys_id: {lastSubmission.sysId}</p>
                </div>
            )}

            <TicketIntakeForm onSubmit={handleSubmit} />
        </div>
    )
}
