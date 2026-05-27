import React, { useState } from 'react'
import { getFieldDisplayValue, getFieldValue } from '../utils/fields'

const BTN_DELETE =
    'shrink-0 cursor-pointer rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50'

function formatRespondedAt(value) {
    if (!value) {
        return ''
    }

    return String(value).replace(/:\d{2}(\s*[AP]M)?$/i, '$1')
}

export default function IncidentResponsePanel({ responses, onDeleteResponse }) {
    const [deletingSysId, setDeletingSysId] = useState(null)

    if (!responses?.length) {
        return <div className="incident-response-panel text-sm text-rh-muted">No responses logged</div>
    }

    const handleDelete = async (response) => {
        const responseSysId = getFieldValue(response.sys_id)
        const preview = truncateText(getFieldDisplayValue(response.response_text), 60)

        if (!confirm(`Delete this response${preview ? `?\n\n"${preview}"` : '?'}`)) {
            return
        }

        setDeletingSysId(responseSysId)

        try {
            await onDeleteResponse(responseSysId)
        } catch (error) {
            console.error('Failed to delete response:', error)
            alert('Failed to delete response: ' + (error.message || 'Unknown error'))
        } finally {
            setDeletingSysId(null)
        }
    }

    return (
        <div className="incident-response-panel">
            {responses.map((response) => {
                const responseSysId = getFieldValue(response.sys_id)
                const isDeleting = deletingSysId === responseSysId

                return (
                    <div
                        key={responseSysId}
                        className="incident-response-item border-b border-rh-border py-3 last:border-b-0 last:pb-0 first:pt-0"
                    >
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rh-muted">
                                <span>{formatRespondedAt(getFieldDisplayValue(response.responded_at))}</span>
                                <span>{getFieldDisplayValue(response.responded_by) || 'Unknown user'}</span>
                            </div>
                            {onDeleteResponse && (
                                <button
                                    type="button"
                                    className={BTN_DELETE}
                                    onClick={() => void handleDelete(response)}
                                    disabled={isDeleting}
                                    aria-label="Delete response"
                                >
                                    {isDeleting ? 'Deleting…' : 'Delete'}
                                </button>
                            )}
                        </div>
                        <p className="m-0 whitespace-pre-wrap text-sm text-rh-text">
                            {getFieldDisplayValue(response.response_text)}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text || ''
    }

    return `${text.slice(0, maxLength - 3)}...`
}
