import React, { useCallback, useEffect, useState, type ReactNode } from 'react'
import { TicketService } from '../services/TicketService'
import { formatSubmittedAt } from '../utils/formatDateTime'
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const records = await ticketService.list()
            setTickets(records)
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
                            </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => {
                                    const isHighlighted = highlightSysId === ticket.sysId

                                    return (
                                        <tr
                                            key={ticket.sysId}
                                            className={isHighlighted ? 'portal-ticket-row-highlight' : undefined}
                                        >
                                        <td>
                                            <a
                                                href={ticketViewUrl(ticket.sysId)}
                                                className="portal-ticket-title portal-ticket-title-link"
                                            >
                                                {ticket.title}
                                            </a>
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

