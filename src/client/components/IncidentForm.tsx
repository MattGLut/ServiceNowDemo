import React, { useState, useEffect } from 'react'
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

export default function IncidentForm({ incident, onSubmit, onCancel }) {
    const isEditing = !!incident

    const [formData, setFormData] = useState({
        short_description: '',
        description: '',
        state: '1',
        impact: '2',
    })

    useEffect(() => {
        if (incident) {
            const shortDesc =
                typeof incident.short_description === 'object'
                    ? incident.short_description.value
                    : incident.short_description
            const description =
                typeof incident.description === 'object' ? incident.description.value : incident.description
            const state = typeof incident.state === 'object' ? incident.state.value : incident.state
            const impact = typeof incident.impact === 'object' ? incident.impact.value : incident.impact

            setFormData({
                short_description: shortDesc || '',
                description: description || '',
                state: state || '1',
                impact: impact || '2',
            })
        }
    }, [incident])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className={MODAL_OVERLAY}>
            <div className={MODAL_PANEL}>
                <div className={MODAL_HEADER}>
                    <h2 className={MODAL_TITLE}>
                        {isEditing ? `Edit ${incident.number.display_value}` : 'Create New Incident'}
                    </h2>
                    <button type="button" className={MODAL_CLOSE} onClick={onCancel}>
                        ×
                    </button>
                </div>
                <form className="p-5" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="short_description" className={LABEL_CLASS}>
                            Short Description *
                        </label>
                        <input
                            type="text"
                            id="short_description"
                            name="short_description"
                            className={INPUT_CLASS}
                            value={formData.short_description}
                            onChange={handleChange}
                            required
                            maxLength={160}
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="description" className={LABEL_CLASS}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className={INPUT_CLASS}
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            maxLength={4000}
                        />
                    </div>

                    <div className="mb-5 flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="state" className={LABEL_CLASS}>
                                State
                            </label>
                            <select
                                id="state"
                                name="state"
                                className={INPUT_CLASS}
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="1">New</option>
                                <option value="2">In Progress</option>
                                <option value="3">On Hold</option>
                                <option value="6">Resolved</option>
                                <option value="7">Closed</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="impact" className={LABEL_CLASS}>
                                Impact
                            </label>
                            <select
                                id="impact"
                                name="impact"
                                className={INPUT_CLASS}
                                value={formData.impact}
                                onChange={handleChange}
                            >
                                <option value="1">1 - High</option>
                                <option value="2">2 - Medium</option>
                                <option value="3">3 - Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-2.5">
                        <button type="button" className={BTN_CANCEL} onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className={BTN_PRIMARY}>
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
