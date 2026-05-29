import React, { useCallback, useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import SubmitSuccessToast from './SubmitSuccessToast'
import TicketIntakeForm from './TicketIntakeForm'
import { TicketService } from '../services/TicketService'
import type { TicketCreateResult, TicketRequestType } from '../types/ticket'

export default function TicketSubmitPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [error, setError] = useState<string | null>(null)
    const [lastSubmission, setLastSubmission] = useState<TicketCreateResult | null>(null)
    const [attachmentCount, setAttachmentCount] = useState(0)

    const dismissSuccess = useCallback(() => {
        setLastSubmission(null)
        setAttachmentCount(0)
    }, [])

    const handleSubmit = async (input: {
        title: string
        description: string
        requestType: TicketRequestType
        externalId: string
        stpFlag: boolean
        files: File[]
    }) => {
        setError(null)
        setLastSubmission(null)

        let result: TicketCreateResult | null = null

        try {
            result = await ticketService.create({
                title: input.title,
                description: input.description,
                requestType: input.requestType,
                externalId: input.externalId,
                stpFlag: input.stpFlag,
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
        <PortalLayout>
            <div className="portal-form-page">
                {lastSubmission && (
                    <div className="portal-toast-region">
                        <SubmitSuccessToast
                            key={lastSubmission.sysId}
                            submission={lastSubmission}
                            attachmentCount={attachmentCount}
                            onDismiss={dismissSuccess}
                        />
                    </div>
                )}

                {error && (
                    <div className="portal-submit-banner portal-submit-banner-error mb-4 flex shrink-0 items-center justify-between">
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

                <TicketIntakeForm onSubmit={handleSubmit} />
            </div>
        </PortalLayout>
    )
}
