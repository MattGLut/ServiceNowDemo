import React, { useState } from 'react'
import './IncidentForm.css'

export default function IncidentResponseForm({ incident, onSubmit, onCancel }) {
    const [responseText, setResponseText] = useState('')

    const incidentNumber =
        typeof incident.number === 'object' ? incident.number.display_value : incident.number

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(responseText)
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Log Response for {incidentNumber}</h2>
                    <button type="button" className="close-button" onClick={onCancel}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="response_text">Response *</label>
                        <textarea
                            id="response_text"
                            name="response_text"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={6}
                            required
                            maxLength={4000}
                            placeholder="Describe the response action taken..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Log Response
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
