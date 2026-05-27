import React, { useState } from 'react'
import { getFieldDisplayValue, getFieldValue } from '../utils/fields'

const BTN_DELETE =
    'shrink-0 cursor-pointer rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50'

function formatFiledAt(value) {
    if (!value) {
        return ''
    }

    return String(value).replace(/:\d{2}(\s*[AP]M)?$/i, '$1')
}

export default function IncidentComplaintPanel({ complaints, onDeleteComplaint }) {
    const [deletingSysId, setDeletingSysId] = useState(null)

    if (!complaints?.length) {
        return <div className="incident-complaint-panel text-sm text-rh-muted">No complaints filed</div>
    }

    const handleDelete = async (complaint) => {
        const complaintSysId = getFieldValue(complaint.sys_id)
        const preview = truncateText(getFieldDisplayValue(complaint.complaint_text), 60)

        if (!confirm(`Delete this complaint${preview ? `?\n\n"${preview}"` : '?'}`)) {
            return
        }

        setDeletingSysId(complaintSysId)

        try {
            await onDeleteComplaint(complaintSysId)
        } catch (error) {
            console.error('Failed to delete complaint:', error)
            alert('Failed to delete complaint: ' + (error.message || 'Unknown error'))
        } finally {
            setDeletingSysId(null)
        }
    }

    return (
        <div className="incident-complaint-panel">
            {complaints.map((complaint) => {
                const complaintSysId = getFieldValue(complaint.sys_id)
                const isDeleting = deletingSysId === complaintSysId

                return (
                    <div
                        key={complaintSysId}
                        className="incident-complaint-item border-b border-rh-border py-3 last:border-b-0 last:pb-0 first:pt-0"
                    >
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rh-muted">
                                <span>{formatFiledAt(getFieldDisplayValue(complaint.filed_at))}</span>
                                <span>{getFieldDisplayValue(complaint.filed_by) || 'Unknown user'}</span>
                            </div>
                            {onDeleteComplaint && (
                                <button
                                    type="button"
                                    className={BTN_DELETE}
                                    onClick={() => void handleDelete(complaint)}
                                    disabled={isDeleting}
                                    aria-label="Delete complaint"
                                >
                                    {isDeleting ? 'Deleting…' : 'Delete'}
                                </button>
                            )}
                        </div>
                        <p className="m-0 whitespace-pre-wrap text-sm text-rh-text">
                            {getFieldDisplayValue(complaint.complaint_text)}
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
