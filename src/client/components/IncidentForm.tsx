import React, { useState, useEffect } from 'react'

const INPUT_CLASS =
    'w-full rounded border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="m-0 text-lg text-gray-800">
                        {isEditing ? `Edit ${incident.number.display_value}` : 'Create New Incident'}
                    </h2>
                    <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent text-2xl leading-none text-gray-500 hover:text-black"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>
                <form className="p-5" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="short_description" className="mb-2 block font-medium text-gray-800">
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
                        <label htmlFor="description" className="mb-2 block font-medium text-gray-800">
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
                            <label htmlFor="state" className="mb-2 block font-medium text-gray-800">
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
                            <label htmlFor="impact" className="mb-2 block font-medium text-gray-800">
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
                        <button
                            type="button"
                            className="cursor-pointer rounded border-0 bg-gray-200 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-300"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer rounded border-0 bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
