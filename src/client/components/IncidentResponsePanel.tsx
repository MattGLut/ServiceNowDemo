import React from 'react'
import { getFieldDisplayValue, getFieldValue } from '../utils/fields'

function formatRespondedAt(value) {
    if (!value) {
        return ''
    }

    return String(value).replace(/:\d{2}(\s*[AP]M)?$/i, '$1')
}

export default function IncidentResponsePanel({ responses }) {
    if (!responses?.length) {
        return <div className="incident-response-panel text-sm text-rh-muted">No responses logged</div>
    }

    return (
        <div className="incident-response-panel">
            {responses.map((response) => (
                <div
                    key={getFieldValue(response.sys_id)}
                    className="incident-response-item border-b border-rh-border py-3 last:border-b-0 last:pb-0 first:pt-0"
                >
                    <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rh-muted">
                        <span>{formatRespondedAt(getFieldDisplayValue(response.responded_at))}</span>
                        <span>{getFieldDisplayValue(response.responded_by) || 'Unknown user'}</span>
                    </div>
                    <p className="m-0 whitespace-pre-wrap text-sm text-rh-text">
                        {getFieldDisplayValue(response.response_text)}
                    </p>
                </div>
            ))}
        </div>
    )
}
