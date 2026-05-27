import React, { useState } from 'react'
import {
    MODAL_OVERLAY,
    MODAL_PANEL,
    MODAL_HEADER,
    MODAL_TITLE,
    MODAL_CLOSE,
    LABEL_CLASS,
    INPUT_CLASS,
    BTN_CANCEL,
    BTN_PRIMARY,
} from './formStyles'

export default function IncidentResponseForm({ incident, onSubmit, onCancel }) {
    const [responseText, setResponseText] = useState('')

    const incidentNumber =
        typeof incident.number === 'object' ? incident.number.display_value : incident.number

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(responseText)
    }

    return (
        <div className={MODAL_OVERLAY}>
            <div className={MODAL_PANEL}>
                <div className={MODAL_HEADER}>
                    <h2 className={MODAL_TITLE}>Log Response for {incidentNumber}</h2>
                    <button type="button" className={MODAL_CLOSE} onClick={onCancel}>
                        ×
                    </button>
                </div>
                <form className="p-5" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="response_text" className={LABEL_CLASS}>
                            Response *
                        </label>
                        <textarea
                            id="response_text"
                            name="response_text"
                            className={INPUT_CLASS}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={6}
                            required
                            maxLength={4000}
                            placeholder="Describe the response action taken..."
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-2.5">
                        <button type="button" className={BTN_CANCEL} onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className={BTN_PRIMARY}>
                            Respond
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
