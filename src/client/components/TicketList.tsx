import React, { useCallback, useEffect, useState } from 'react'
import { TicketService } from '../services/TicketService'
import type { TicketRecord } from '../types/ticket'

type TicketListProps = {
    ticketService: TicketService
    refreshKey: number
    highlightSysId?: string | null
}

export default function TicketList({ ticketService, refreshKey, highlightSysId }: TicketListProps) {
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
        <div className="portal-submit-panel-inner">
            <div className="portal-submit-panel-header">
                <h2 className="portal-submit-panel-title">Submitted tickets</h2>
                <button
                    type="button"
                    className="portal-submit-refresh"
                    onClick={() => void loadTickets()}
                    disabled={loading}
                >
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="portal-submit-banner portal-submit-banner-error">{error}</div>
            )}

            {!error && loading && tickets.length === 0 && (
                <p className="portal-submit-empty">Loading tickets…</p>
            )}

            {!error && !loading && tickets.length === 0 && (
                <p className="portal-submit-empty">No tickets submitted yet.</p>
            )}

            {tickets.length > 0 && (
                <div className="portal-ticket-table-wrap">
                    <table className="portal-ticket-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Submitted</th>
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
                                            <span className="portal-ticket-title">{ticket.title}</span>
                                            {ticket.description && (
                                                <span className="portal-ticket-description">
                                                    {truncateDescription(ticket.description)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="portal-ticket-status">{ticket.statusLabel}</span>
                                        </td>
                                        <td className="portal-ticket-date">
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
    )
}

function truncateDescription(text: string, maxLength = 120): string {
    const trimmed = text.trim()
    if (trimmed.length <= maxLength) {
        return trimmed
    }
    return trimmed.slice(0, maxLength).trimEnd() + '…'
}

function formatSubmittedAt(value: string): string {
    if (!value) {
        return '—'
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T')
    const date = new Date(normalized)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}
