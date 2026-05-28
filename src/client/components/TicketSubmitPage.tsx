import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PortalLayout from './PortalLayout'
import SubmitSuccessToast from './SubmitSuccessToast'
import TicketIntakeForm from './TicketIntakeForm'
import TicketList from './TicketList'
import { isSubmitTicketsView } from '../utils/portalPage'
import { TicketService } from '../services/TicketService'
import type { TicketCreateResult } from '../types/ticket'

const DESKTOP_BREAKPOINT_PX = 1024

type MobileSubmitView = 'form' | 'tickets'

export default function TicketSubmitPage() {
    const ticketService = useMemo(() => new TicketService(), [])
    const [error, setError] = useState<string | null>(null)
    const [lastSubmission, setLastSubmission] = useState<TicketCreateResult | null>(null)
    const [attachmentCount, setAttachmentCount] = useState(0)
    const [listRefreshKey, setListRefreshKey] = useState(0)
    const [mobileView, setMobileView] = useState<MobileSubmitView>(() =>
        isSubmitTicketsView() ? 'tickets' : 'form'
    )

    const dismissSuccess = useCallback(() => {
        setLastSubmission(null)
        setAttachmentCount(0)
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`)
        const handleChange = () => {
            if (mediaQuery.matches) {
                setMobileView('form')
            }
        }

        handleChange()
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const handleSubmit = async (input: {
        title: string
        description: string
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
                stpFlag: input.stpFlag,
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

    const formPanelClassName =
        'portal-submit-panel portal-submit-panel-form min-h-0 flex-col ' +
        (mobileView === 'tickets' ? 'hidden lg:flex' : 'flex')

    const listPanelClassName =
        'portal-submit-panel portal-submit-panel-list min-h-0 flex-col ' +
        (mobileView === 'form' ? 'hidden lg:flex' : 'flex')

    return (
        <PortalLayout>
            <div className="portal-submit-view">
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
                <section className={formPanelClassName}>
                    <div className="portal-submit-panel-header">
                        <h2 className="portal-submit-panel-title">Submit a ticket</h2>
                        <button
                            type="button"
                            className="portal-mobile-toggle lg:hidden"
                            onClick={() => setMobileView('tickets')}
                        >
                            View tickets
                        </button>
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

                        <TicketIntakeForm embedded onSubmit={handleSubmit} />
                    </div>
                </section>

                <section className={listPanelClassName}>
                    <TicketList
                        ticketService={ticketService}
                        refreshKey={listRefreshKey}
                        highlightSysId={lastSubmission?.sysId}
                        headerStart={
                            <button
                                type="button"
                                className="portal-mobile-toggle lg:hidden"
                                onClick={() => setMobileView('form')}
                            >
                                Back to form
                            </button>
                        }
                    />
                </section>
            </div>
        </PortalLayout>
    )
}
