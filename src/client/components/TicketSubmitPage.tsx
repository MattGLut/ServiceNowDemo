import React, { useCallback, useEffect, useMemo, useState } from 'react'

const SUCCESS_BANNER_MS = 5000
import PortalLayout from './PortalLayout'
import TicketIntakeForm from './TicketIntakeForm'
import TicketList from './TicketList'
import { TicketService } from '../services/TicketService'
import type { TicketCreateResult } from '../types/ticket'

export default function TicketSubmitPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [error, setError] = useState<string | null>(null)
    const [lastSubmission, setLastSubmission] = useState<TicketCreateResult | null>(null)
    const [attachmentCount, setAttachmentCount] = useState(0)
    const [listRefreshKey, setListRefreshKey] = useState(0)

    const dismissSuccess = useCallback(() => {
        setLastSubmission(null)
        setAttachmentCount(0)
    }, [])

    useEffect(() => {
        if (!lastSubmission) {
            return
        }

        const timeoutId = window.setTimeout(dismissSuccess, SUCCESS_BANNER_MS)
        return () => window.clearTimeout(timeoutId)
    }, [lastSubmission, dismissSuccess])

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
            setListRefreshKey((key) => key + 1)
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(
                result
                    ? `Ticket was created but a follow-up step failed: ${message} (sys_id: ${result.sysId})`
                    : 'Failed to submit ticket: ' + message
            )
            console.error(err)
            if (result) {
                setListRefreshKey((key) => key + 1)
            }
            throw err
        }
    }

    return (
        <PortalLayout>
            <div className="portal-submit-view">
                <section className="portal-submit-panel portal-submit-panel-form flex min-h-0 flex-col">
                    <div className="portal-submit-panel-header">
                        <h2 className="portal-submit-panel-title">Submit a ticket</h2>
                    </div>
                    <div className="portal-submit-panel-body gap-3">
                        {error && (
                            <div className="portal-submit-banner portal-submit-banner-error shrink-0 flex items-center justify-between">
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
                            <div className="portal-submit-banner portal-submit-banner-success shrink-0 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="m-0 font-semibold">Ticket submitted</p>
                                    <p className="mb-0 mt-1 text-sm">
                                        <span className="text-rh-text">{lastSubmission.title}</span>
                                        {attachmentCount > 0 && (
                                            <span className="text-rh-muted">
                                                {' '}
                                                — {attachmentCount} file
                                                {attachmentCount === 1 ? '' : 's'} attached
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="portal-submit-banner-close"
                                    aria-label="Dismiss success message"
                                    onClick={dismissSuccess}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <TicketIntakeForm embedded onSubmit={handleSubmit} />
                    </div>
                </section>

                <section className="portal-submit-panel portal-submit-panel-list flex min-h-0 flex-col">
                    <TicketList
                        ticketService={ticketService}
                        refreshKey={listRefreshKey}
                        highlightSysId={lastSubmission?.sysId}
                    />
                </section>
            </div>
        </PortalLayout>
    )
}
