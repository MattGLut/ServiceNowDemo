import React, { useState } from 'react'
import IncidentResponsePanel from './IncidentResponsePanel'
import IncidentComplaintPanel from './IncidentComplaintPanel'
import { getIncidentSysId } from '../utils/fields'

const MAX_DESCRIPTION_LENGTH = 100
const COLUMN_COUNT = 8

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

function toggleInSet(setter, id) {
    setter((previous) => {
        const next = new Set(previous)

        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }

        return next
    })
}

export default function IncidentList({
    incidents,
    responseSummaries = {},
    complaintSummaries = {},
    onEdit,
    onLogResponse,
    onDeleteResponse,
    onFileComplaint,
    onDeleteComplaint,
    onRefresh,
    service,
}) {
    const [expandedResponseIds, setExpandedResponseIds] = useState(() => new Set())
    const [expandedComplaintIds, setExpandedComplaintIds] = useState(() => new Set())

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
                                <th className={`col-complaints ${TH}`}>Complaints</th>
                                <th className={`col-actions ${TH_ACTIONS}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => {
                                const incidentSysId = getIncidentSysId(incident)
                                const responseSummary = responseSummaries[incidentSysId] || { count: 0, items: [] }
                                const complaintSummary = complaintSummaries[incidentSysId] || { count: 0, items: [] }
                                const responseCount = responseSummary.count
                                const complaintCount = complaintSummary.count
                                const isResponseExpanded = expandedResponseIds.has(incidentSysId)
                                const isComplaintExpanded = expandedComplaintIds.has(incidentSysId)

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
                                                        onClick={() => toggleInSet(setExpandedResponseIds, incidentSysId)}
                                                        aria-label={`${responseCount} responses for incident ${number}`}
                                                    >
                                                        {responseCount > 0 ? responseCount : '—'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-sm text-rh-muted hover:bg-rh-elevated hover:text-rh-text"
                                                        onClick={() => toggleInSet(setExpandedResponseIds, incidentSysId)}
                                                        aria-expanded={isResponseExpanded}
                                                        aria-label={
                                                            isResponseExpanded
                                                                ? `Collapse responses for ${number}`
                                                                : `Expand responses for ${number}`
                                                        }
                                                    >
                                                        {isResponseExpanded ? '▾' : '▸'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td
                                                className="col-complaints px-4 py-3 text-center"
                                                data-label="Complaints"
                                            >
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        className={`inline-flex min-w-[1.75rem] cursor-pointer items-center justify-center rounded-full border-0 px-2 py-0.5 text-xs font-semibold ${
                                                            complaintCount > 0
                                                                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                                                : 'bg-rh-elevated text-rh-muted'
                                                        }`}
                                                        onClick={() => toggleInSet(setExpandedComplaintIds, incidentSysId)}
                                                        aria-label={`${complaintCount} complaints for incident ${number}`}
                                                    >
                                                        {complaintCount > 0 ? complaintCount : '—'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-sm text-rh-muted hover:bg-rh-elevated hover:text-rh-text"
                                                        onClick={() => toggleInSet(setExpandedComplaintIds, incidentSysId)}
                                                        aria-expanded={isComplaintExpanded}
                                                        aria-label={
                                                            isComplaintExpanded
                                                                ? `Collapse complaints for ${number}`
                                                                : `Expand complaints for ${number}`
                                                        }
                                                    >
                                                        {isComplaintExpanded ? '▾' : '▸'}
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
                                                        className={`${BTN_BASE} border-amber-500/50 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25`}
                                                        onClick={() => onFileComplaint(incident)}
                                                        aria-label={`File complaint for incident ${number}`}
                                                    >
                                                        File Complaint
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
                                        {isResponseExpanded && (
                                            <tr className="incident-response-row border-t border-rh-border bg-rh-elevated/30">
                                                <td colSpan={COLUMN_COUNT} className="incident-response-cell p-0">
                                                    <div className="incident-response-panel-wrap px-4 py-3">
                                                        <IncidentResponsePanel
                                                            responses={responseSummary.items}
                                                            onDeleteResponse={onDeleteResponse}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {isComplaintExpanded && (
                                            <tr className="incident-complaint-row border-t border-rh-border bg-rh-elevated/30">
                                                <td colSpan={COLUMN_COUNT} className="incident-complaint-cell p-0">
                                                    <div className="incident-complaint-panel-wrap px-4 py-3">
                                                        <IncidentComplaintPanel
                                                            complaints={complaintSummary.items}
                                                            onDeleteComplaint={onDeleteComplaint}
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
