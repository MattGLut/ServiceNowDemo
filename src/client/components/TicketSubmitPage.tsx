import React, { useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import TicketIntakeForm from './TicketIntakeForm'
import { TicketService } from '../services/TicketService'
import { ticketListUrl } from '../utils/ticketListFilter'
import { savePendingSubmitSuccessToast } from '../utils/submitSuccessToast'

export default function TicketSubmitPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (input: {
        title: string
        description: string
        workflowTypeSysId: string
        externalId: string
        stpFlag: boolean
        files: File[]
    }) => {
        setError(null)

        let createdSysId: string | null = null

        try {
            if (input.files.length === 0) {
                throw new Error('At least one PDF attachment is required.')
            }

            const result = await ticketService.create({
                title: input.title,
                description: input.description,
                workflowTypeSysId: input.workflowTypeSysId,
                externalId: input.externalId,
                stpFlag: input.stpFlag,
            })

            createdSysId = result.sysId
            await ticketService.uploadAttachments(result.sysId, input.files)

            savePendingSubmitSuccessToast({
                sysId: result.sysId,
                title: result.title,
                attachmentCount: input.files.length,
            })
            window.location.assign(ticketListUrl('draft', { highlightSysId: result.sysId }))
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(
                createdSysId
                    ? `Ticket was created but a follow-up step failed: ${message} (sys_id: ${createdSysId})`
                    : 'Failed to submit ticket: ' + message
            )
            console.error(err)
            throw err
        }
    }

    return (
        <PortalLayout>
            <div className="portal-form-page">
                {error && (
                    <div className="portal-submit-banner portal-submit-banner-error mx-4 mt-4 flex shrink-0 items-center justify-between sm:mx-6">
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
