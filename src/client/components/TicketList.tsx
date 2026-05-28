import React, { useCallback, useEffect, useState, type ReactNode } from 'react'
import { TicketService } from '../services/TicketService'
import { formatAttachmentSummary, formatSubmittedAt } from '../utils/formatDateTime'
import { ticketViewUrl } from '../utils/portalPage'
import type { TicketRecord } from '../types/ticket'

type TicketListProps = {
    ticketService: TicketService
    refreshKey: number
    highlightSysId?: string | null
    headerStart?: ReactNode
}

export default function TicketList({ ticketService, refreshKey, highlightSysId, headerStart }: TicketListProps) {
    const [tickets, setTickets] = useState<TicketRecord[]>([])
    const [attachmentNamesByTicket, setAttachmentNamesByTicket] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const records = await ticketService.list()
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
            setError('Failed to load tickets: ' + message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [ticketService])

    useEffect(() => {
        void loadTickets()
    }, [loadTickets, refreshKey])

    return (
        <>
            <div className="portal-submit-panel-header">
                <div className="flex min-w-0 items-center gap-2">
                    {headerStart}
                    <h2 className="portal-submit-panel-title">Submitted tickets</h2>
                </div>
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
                    <p className="portal-submit-empty m-auto">Loading tickets…</p>
                )}

                {!error && !loading && tickets.length === 0 && (
                    <p className="portal-submit-empty m-auto">No tickets submitted yet.</p>
                )}

                {tickets.length > 0 && (
                    <div className="portal-ticket-table-wrap">
                        <table className="portal-ticket-table">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th className="portal-ticket-col-date">Submitted</th>
                                <th className="portal-ticket-col-files">Files</th>
                                <th className="portal-ticket-col-actions">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => {
                                    const isHighlighted = highlightSysId === ticket.sysId
                                    const attachmentLabel = formatAttachmentSummary(
                                        attachmentNamesByTicket[ticket.sysId] ?? []
                                    )

                                    return (
                                        <tr
                                            key={ticket.sysId}
                                            className={isHighlighted ? 'portal-ticket-row-highlight' : undefined}
                                        >
                                        <td>
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
                                            <span className="portal-ticket-status">{ticket.statusLabel}</span>
                                        </td>
                                        <td className="portal-ticket-date portal-ticket-col-date">
                                            {formatSubmittedAt(ticket.submittedAt)}
                                        </td>
                                        <td className="portal-ticket-col-files">
                                            <span className="portal-ticket-attachments">
                                                {attachmentLabel ?? '—'}
                                            </span>
                                        </td>
                                        <td className="portal-ticket-col-actions">
                                            <a
                                                href={ticketViewUrl(ticket.sysId)}
                                                className="portal-ticket-view-btn"
                                            >
                                                View
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

