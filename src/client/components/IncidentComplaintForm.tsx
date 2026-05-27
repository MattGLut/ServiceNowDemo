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

export default function IncidentComplaintForm({ incident, onSubmit, onCancel }) {
    const [complaintText, setComplaintText] = useState('')

    const incidentNumber =
        typeof incident.number === 'object' ? incident.number.display_value : incident.number

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(complaintText)
    }

    return (
        <div className={MODAL_OVERLAY}>
            <div className={MODAL_PANEL}>
                <div className={MODAL_HEADER}>
                    <h2 className={MODAL_TITLE}>File Complaint for {incidentNumber}</h2>
                    <button type="button" className={MODAL_CLOSE} onClick={onCancel}>
                        ×
                    </button>
                </div>
                <form className="p-5" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="complaint_text" className={LABEL_CLASS}>
                            Complaint *
                        </label>
                        <textarea
                            id="complaint_text"
                            name="complaint_text"
                            className={INPUT_CLASS}
                            value={complaintText}
                            onChange={(e) => setComplaintText(e.target.value)}
                            rows={6}
                            required
                            maxLength={4000}
                            placeholder="Describe the complaint..."
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-2.5">
                        <button type="button" className={BTN_CANCEL} onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className={BTN_PRIMARY}>
                            File Complaint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
