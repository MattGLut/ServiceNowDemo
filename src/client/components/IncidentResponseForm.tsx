import React, { useState } from 'react'

const INPUT_CLASS =
    'w-full rounded border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

export default function IncidentResponseForm({ incident, onSubmit, onCancel }) {
    const [responseText, setResponseText] = useState('')

    const incidentNumber =
        typeof incident.number === 'object' ? incident.number.display_value : incident.number

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(responseText)
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="m-0 text-lg text-gray-800">Log Response for {incidentNumber}</h2>
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
                        <label htmlFor="response_text" className="mb-2 block font-medium text-gray-800">
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
                            Respond
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
