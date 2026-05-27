import React from 'react'

const MAX_DESCRIPTION_LENGTH = 50

const BTN_BASE = 'shrink-0 cursor-pointer rounded border-0 px-2 py-1 text-xs text-white'

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

export default function IncidentList({ incidents, onEdit, onLogResponse, onRefresh, service }) {
    const handleDelete = async (incident) => {
        if (!confirm(`Are you sure you want to delete ${incident.number.display_value}?`)) {
            return
        }

        try {
            const sysId = typeof incident.sys_id === 'object' ? incident.sys_id.value : incident.sys_id
            await service.delete(sysId)
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
                return 'bg-blue-100 text-blue-800'
            case 'In Progress':
                return 'bg-green-100 text-green-800'
            case 'On Hold':
                return 'bg-amber-100 text-amber-800'
            case 'Resolved':
                return 'bg-cyan-100 text-cyan-800'
            case 'Closed':
                return 'bg-slate-200 text-slate-600'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getImpactClass = (impact) => {
        const impactValue = typeof impact === 'object' ? impact.value : impact

        switch (impactValue) {
            case '1':
                return 'bg-orange-100 text-orange-700'
            case '2':
                return 'bg-yellow-100 text-yellow-800'
            case '3':
                return 'bg-lime-100 text-lime-800'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="mt-5 overflow-x-auto">
            {incidents.length === 0 ? (
                <div className="rounded bg-gray-50 px-8 py-8 text-center text-gray-500">No incidents found</div>
            ) : (
                <table className="incident-table">
                    <thead>
                        <tr>
                            <th className="col-number bg-gray-100 px-4 py-3 text-left font-semibold">Number</th>
                            <th className="col-description bg-gray-100 px-4 py-3 text-left font-semibold">
                                Description
                            </th>
                            <th className="col-state bg-gray-100 px-4 py-3 text-left font-semibold">State</th>
                            <th className="col-impact bg-gray-100 px-4 py-3 text-left font-semibold">Impact</th>
                            <th className="col-opened bg-gray-100 px-4 py-3 text-left font-semibold">Opened</th>
                            <th className="col-actions bg-gray-100 px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map((incident) => {
                            const number =
                                typeof incident.number === 'object' ? incident.number.display_value : incident.number
                            const shortDesc =
                                typeof incident.short_description === 'object'
                                    ? incident.short_description.display_value
                                    : incident.short_description
                            const state =
                                typeof incident.state === 'object' ? incident.state.display_value : incident.state
                            const impact =
                                typeof incident.impact === 'object' ? incident.impact.display_value : incident.impact
                            const openedAtRaw =
                                typeof incident.opened_at === 'object'
                                    ? incident.opened_at.display_value
                                    : incident.opened_at
                            const openedAt = formatOpenedAt(openedAtRaw)
                            const displayDesc = truncateText(shortDesc)

                            return (
                                <tr
                                    key={typeof incident.sys_id === 'object' ? incident.sys_id.value : incident.sys_id}
                                    className="border-t border-gray-200 even:bg-gray-50 hover:bg-gray-100"
                                >
                                    <td className="col-number px-4 py-3" data-label="Number">
                                        {number}
                                    </td>
                                    <td
                                        className="col-description px-4 py-3"
                                        data-label="Description"
                                        title={shortDesc || undefined}
                                    >
                                        {displayDesc}
                                    </td>
                                    <td className="col-state px-4 py-3" data-label="State">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getStateClass(incident.state)}`}
                                        >
                                            {state}
                                        </span>
                                    </td>
                                    <td className="col-impact px-4 py-3" data-label="Impact">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getImpactClass(incident.impact)}`}
                                        >
                                            {impact}
                                        </span>
                                    </td>
                                    <td className="col-opened px-4 py-3" data-label="Opened">
                                        {openedAt}
                                    </td>
                                    <td className="col-actions px-4 py-3" data-label="Actions">
                                        <div className="action-buttons flex flex-nowrap justify-end gap-2 max-w-full">
                                            <button
                                                type="button"
                                                className={`${BTN_BASE} bg-violet-600 hover:bg-violet-700`}
                                                onClick={() => onLogResponse(incident)}
                                                aria-label={`Respond to incident ${number}`}
                                            >
                                                Respond
                                            </button>
                                            <button
                                                type="button"
                                                className={`${BTN_BASE} bg-blue-500 hover:bg-blue-600`}
                                                onClick={() => onEdit(incident)}
                                                aria-label={`Edit incident ${number}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className={`${BTN_BASE} bg-red-500 hover:bg-red-600`}
                                                onClick={() => handleDelete(incident)}
                                                aria-label={`Delete incident ${number}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}
