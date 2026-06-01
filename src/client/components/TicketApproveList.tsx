import React, { useCallback, useEffect, useState } from 'react'
import { TicketService } from '../services/TicketService'
import { formatAttachmentSummary, formatSubmittedAt } from '../utils/formatDateTime'
import ProcessingPathBadge from './ProcessingPathBadge'
import { ticketApproveUrl } from '../utils/portalPage'
import type { TicketRecord } from '../types/ticket'

type TicketApproveListProps = {
    ticketService: TicketService
}

export default function TicketApproveList({ ticketService }: TicketApproveListProps) {
    const [tickets, setTickets] = useState<TicketRecord[]>([])
    const [attachmentNamesByTicket, setAttachmentNamesByTicket] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const records = await ticketService.listDrafts()
            setTickets(records)

            try {
                const namesByTicket = await ticketService.listAttachmentNamesByTicket(
                    records.map((record) => record.sysId)
                )
                setAttachmentNamesByTicket(namesByTicket)
            } catch (attachmentErr) {
                console.error(attachmentErr)
                setAttachmentNamesByTicket({})
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError('Failed to load draft tickets: ' + message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [ticketService])

    useEffect(() => {
        void loadTickets()
    }, [loadTickets])

    return (
        <>
            <div className="portal-submit-panel-header">
                <h2 className="portal-submit-panel-title">Tickets awaiting approval</h2>
                <button
                    type="button"
                    className="portal-submit-refresh"
                    onClick={() => void loadTickets()}
                    disabled={loading}
                >
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            <div className="portal-submit-panel-body">
                {error && (
                    <div className="portal-submit-banner portal-submit-banner-error mb-3 shrink-0">
                        {error}
                    </div>
                )}

                {!error && loading && tickets.length === 0 && (
                    <p className="portal-submit-empty m-auto">Loading draft tickets…</p>
                )}

                {!error && !loading && tickets.length === 0 && (
                    <p className="portal-submit-empty m-auto">No draft tickets awaiting approval.</p>
                )}

                {tickets.length > 0 && (
                    <div className="portal-ticket-table-wrap">
                        <table className="portal-ticket-table">
                            <colgroup>
                                <col className="portal-ticket-col-title" />
                                <col className="portal-ticket-col-path" />
                                <col className="portal-ticket-col-date" />
                                <col className="portal-ticket-col-files" />
                                <col className="portal-ticket-col-actions" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Path</th>
                                    <th scope="col" className="portal-ticket-col-date">
                                        Submitted
                                    </th>
                                    <th scope="col">Files</th>
                                    <th scope="col" className="portal-ticket-col-actions">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => {
                                    const attachmentLabel = formatAttachmentSummary(
                                        attachmentNamesByTicket[ticket.sysId] ?? []
                                    )

                                    return (
                                        <tr key={ticket.sysId}>
                                            <td className="portal-ticket-cell-title">
                                                <span className="portal-ticket-title">{ticket.title}</span>
                                                {ticket.description && (
                                                    <span className="portal-ticket-description">
                                                        {truncateDescription(ticket.description)}
                                                    </span>
                                                )}
                                                <span className="portal-ticket-date-mobile">
                                                    {formatSubmittedAt(ticket.submittedAt)}
                                                </span>
                                            </td>
                                            <td>
                                                <ProcessingPathBadge stpFlag={ticket.stpFlag} />
                                            </td>
                                            <td className="portal-ticket-date portal-ticket-col-date">
                                                <span className="portal-ticket-date-text">
                                                    {formatSubmittedAt(ticket.submittedAt)}
                                                </span>
                                            </td>
                                            <td className="portal-ticket-col-files">
                                                <span className="portal-ticket-attachments">
                                                    {attachmentLabel ?? '—'}
                                                </span>
                                            </td>
                                            <td className="portal-ticket-col-actions">
                                                <a
                                                    href={ticketApproveUrl(ticket.sysId)}
                                                    className="portal-ticket-view-btn"
                                                >
                                                    Review
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

function truncateDescription(text: string, maxLength = 120): string {
    const trimmed = text.trim()
    if (trimmed.length <= maxLength) {
        return trimmed
    }
    return trimmed.slice(0, maxLength).trimEnd() + '…'
}
