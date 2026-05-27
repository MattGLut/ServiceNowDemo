import React, { useState } from 'react'
import IncidentResponsePanel from './IncidentResponsePanel'
import { getIncidentSysId } from '../utils/fields'

const MAX_DESCRIPTION_LENGTH = 100
const COLUMN_COUNT = 7

const TH = 'text-center'
const TH_DESCRIPTION = 'text-left'
const TH_ACTIONS = 'text-right'

const BTN_BASE = 'shrink-0 cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold'

function truncateText(text, maxLength = MAX_DESCRIPTION_LENGTH) {
    if (!text) {
        return ''
    }

    if (text.length <= maxLength) {
        return text
    }

    return `${text.slice(0, maxLength - 3)}...`
}

function formatOpenedAt(value) {
    if (!value) {
        return ''
    }

    return String(value).replace(/:\d{2}(\s*[AP]M)?$/i, '$1')
}

export default function IncidentList({
    incidents,
    responseSummaries = {},
    onEdit,
    onLogResponse,
    onDeleteResponse,
    onRefresh,
    service,
}) {
    const [expandedIncidentIds, setExpandedIncidentIds] = useState(() => new Set())

    const toggleExpanded = (incidentSysId) => {
        setExpandedIncidentIds((previous) => {
            const next = new Set(previous)

            if (next.has(incidentSysId)) {
                next.delete(incidentSysId)
            } else {
                next.add(incidentSysId)
            }

            return next
        })
    }

    const handleDelete = async (incident) => {
        if (!confirm(`Are you sure you want to delete ${incident.number.display_value}?`)) {
            return
        }

        try {
            await service.delete(getIncidentSysId(incident))
            onRefresh()
        } catch (error) {
            console.error('Failed to delete incident:', error)
            alert('Failed to delete incident: ' + (error.message || 'Unknown error'))
        }
    }

    const getStateClass = (state) => {
        const stateValue = typeof state === 'object' ? state.display_value : state

        switch (stateValue) {
            case 'New':
                return 'bg-blue-500/20 text-blue-400'
            case 'In Progress':
                return 'bg-rh-green/20 text-rh-green'
            case 'On Hold':
                return 'bg-amber-500/20 text-amber-400'
            case 'Resolved':
                return 'bg-cyan-500/20 text-cyan-400'
            case 'Closed':
                return 'bg-zinc-500/30 text-zinc-400'
            default:
                return 'bg-rh-elevated text-rh-muted'
        }
    }

    const getImpactClass = (impact) => {
        const impactValue = typeof impact === 'object' ? impact.value : impact

        switch (impactValue) {
            case '1':
                return 'bg-orange-500/20 text-orange-400'
            case '2':
                return 'bg-yellow-500/20 text-yellow-400'
            case '3':
                return 'bg-rh-green/15 text-rh-green'
            default:
                return 'bg-rh-elevated text-rh-muted'
        }
    }

    return (
        <div className="mt-5 overflow-x-auto">
            {incidents.length === 0 ? (
                <div className="rounded-xl border border-rh-border bg-rh-panel px-8 py-8 text-center text-rh-muted">
                    No incidents found
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-rh-border bg-rh-panel">
                    <table className="incident-table">
                        <thead>
                            <tr>
                                <th className={`col-number ${TH}`}>Number</th>
                                <th className={`col-description ${TH_DESCRIPTION}`}>Description</th>
                                <th className={`col-state ${TH}`}>State</th>
                                <th className={`col-impact ${TH}`}>Impact</th>
                                <th className={`col-opened ${TH}`}>Opened</th>
                                <th className={`col-responses ${TH}`}>Responses</th>
                                <th className={`col-actions ${TH_ACTIONS}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => {
                                const incidentSysId = getIncidentSysId(incident)
                                const summary = responseSummaries[incidentSysId] || { count: 0, items: [] }
                                const responseCount = summary.count
                                const isExpanded = expandedIncidentIds.has(incidentSysId)

                                const number =
                                    typeof incident.number === 'object'
                                        ? incident.number.display_value
                                        : incident.number
                                const shortDesc =
                                    typeof incident.short_description === 'object'
                                        ? incident.short_description.display_value
                                        : incident.short_description
                                const state =
                                    typeof incident.state === 'object'
                                        ? incident.state.display_value
                                        : incident.state
                                const impact =
                                    typeof incident.impact === 'object'
                                        ? incident.impact.display_value
                                        : incident.impact
                                const openedAtRaw =
                                    typeof incident.opened_at === 'object'
                                        ? incident.opened_at.display_value
                                        : incident.opened_at
                                const openedAt = formatOpenedAt(openedAtRaw)
                                const displayDesc = truncateText(shortDesc)

                                return (
                                    <React.Fragment key={incidentSysId}>
                                        <tr className="border-t border-rh-border transition-colors hover:bg-rh-elevated/40">
                                            <td
                                                className="col-number px-4 py-3 text-center text-sm text-rh-muted"
                                                data-label="Number"
                                            >
                                                {number}
                                            </td>
                                            <td
                                                className="col-description px-4 py-3 text-left text-sm text-rh-text"
                                                data-label="Description"
                                                title={shortDesc || undefined}
                                            >
                                                {displayDesc}
                                            </td>
                                            <td className="col-state px-4 py-3 text-center" data-label="State">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStateClass(incident.state)}`}
                                                >
                                                    {state}
                                                </span>
                                            </td>
                                            <td className="col-impact px-4 py-3 text-center" data-label="Impact">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getImpactClass(incident.impact)}`}
                                                >
                                                    {impact}
                                                </span>
                                            </td>
                                            <td
                                                className="col-opened px-4 py-3 text-center text-sm text-rh-muted"
                                                data-label="Opened"
                                            >
                                                {openedAt}
                                            </td>
                                            <td
                                                className="col-responses px-4 py-3 text-center"
                                                data-label="Responses"
                                            >
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        className={`inline-flex min-w-[1.75rem] cursor-pointer items-center justify-center rounded-full border-0 px-2 py-0.5 text-xs font-semibold ${
                                                            responseCount > 0
                                                                ? 'bg-rh-green/20 text-rh-green hover:bg-rh-green/30'
                                                                : 'bg-rh-elevated text-rh-muted'
                                                        }`}
                                                        onClick={() => toggleExpanded(incidentSysId)}
                                                        aria-label={`${responseCount} responses for incident ${number}`}
                                                    >
                                                        {responseCount > 0 ? responseCount : '—'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-sm text-rh-muted hover:bg-rh-elevated hover:text-rh-text"
                                                        onClick={() => toggleExpanded(incidentSysId)}
                                                        aria-expanded={isExpanded}
                                                        aria-label={
                                                            isExpanded
                                                                ? `Collapse responses for ${number}`
                                                                : `Expand responses for ${number}`
                                                        }
                                                    >
                                                        {isExpanded ? '▾' : '▸'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="col-actions px-4 py-3" data-label="Actions">
                                                <div
                                                    className="action-buttons flex flex-nowrap justify-end gap-2 max-w-full"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        className={`${BTN_BASE} border-rh-green/50 bg-rh-green/15 text-rh-green hover:bg-rh-green/25`}
                                                        onClick={() => onLogResponse(incident)}
                                                        aria-label={`Respond to incident ${number}`}
                                                    >
                                                        Respond
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${BTN_BASE} border-rh-border bg-rh-elevated text-rh-text hover:bg-rh-border`}
                                                        onClick={() => onEdit(incident)}
                                                        aria-label={`Edit incident ${number}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${BTN_BASE} border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25`}
                                                        onClick={() => handleDelete(incident)}
                                                        aria-label={`Delete incident ${number}`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="incident-response-row border-t border-rh-border bg-rh-elevated/30">
                                                <td colSpan={COLUMN_COUNT} className="incident-response-cell p-0">
                                                    <div className="incident-response-panel-wrap px-4 py-3">
                                                        <IncidentResponsePanel
                                                            responses={summary.items}
                                                            onDeleteResponse={onDeleteResponse}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
