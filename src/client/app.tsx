import React, { useState, useEffect, useMemo } from 'react'
import { IncidentService } from './services/IncidentService'
import { IncidentResponseService } from './services/IncidentResponseService'
import IncidentList from './components/IncidentList'
import IncidentForm from './components/IncidentForm'
import IncidentResponseForm from './components/IncidentResponseForm'

export default function App() {
    const [incidents, setIncidents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showResponseForm, setShowResponseForm] = useState(false)
    const [selectedIncident, setSelectedIncident] = useState(null)
    const [responseIncident, setResponseIncident] = useState(null)
    const [error, setError] = useState(null)

    const incidentService = useMemo(() => new IncidentService(), [])
    const incidentResponseService = useMemo(() => new IncidentResponseService(), [])

    const refreshIncidents = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await incidentService.list()
            setIncidents(data)
        } catch (err) {
            setError('Failed to load incidents: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void refreshIncidents()
    }, [])

    const handleCreateClick = () => {
        setSelectedIncident(null)
        setShowForm(true)
    }

    const handleEditClick = (incident) => {
        setSelectedIncident(incident)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setSelectedIncident(null)
    }

    const handleLogResponseClick = (incident) => {
        setResponseIncident(incident)
        setShowResponseForm(true)
    }

    const handleResponseFormClose = () => {
        setShowResponseForm(false)
        setResponseIncident(null)
    }

    const handleResponseSubmit = async (responseText) => {
        if (!responseIncident) {
            return
        }

        setLoading(true)
        try {
            const sysId =
                typeof responseIncident.sys_id === 'object' ? responseIncident.sys_id.value : responseIncident.sys_id
            await incidentResponseService.create(sysId, responseText)
            setShowResponseForm(false)
            setResponseIncident(null)
        } catch (err) {
            setError('Failed to log incident response: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleFormSubmit = async (formData) => {
        setLoading(true)
        try {
            if (selectedIncident) {
                const sysId =
                    typeof selectedIncident.sys_id === 'object'
                        ? selectedIncident.sys_id.value
                        : selectedIncident.sys_id
                await incidentService.update(sysId, formData)
            } else {
                await incidentService.create(formData)
            }
            setShowForm(false)
            await refreshIncidents()
        } catch (err) {
            setError('Failed to save incident: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-5 font-sans max-md:p-3">
            <header className="mb-5 flex items-center justify-between border-b border-gray-200 pb-2.5 max-md:flex-col max-md:items-stretch max-md:gap-3">
                <h1 className="m-0 text-2xl text-slate-700 max-md:text-xl">Incident Response Manager Pro</h1>
                <button
                    type="button"
                    className="cursor-pointer rounded border-0 bg-green-600 px-4 py-2.5 font-bold text-white hover:bg-green-700 max-md:w-full max-md:text-center"
                    onClick={handleCreateClick}
                >
                    Create New Incident
                </button>
            </header>

            {error && (
                <div className="mb-5 flex items-center justify-between rounded border-l-4 border-red-600 bg-red-50 px-4 py-3 text-red-700">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent font-bold text-red-700 underline"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {loading ? (
                <div className="py-10 text-center text-lg text-gray-500">Loading...</div>
            ) : (
                <IncidentList
                    incidents={incidents}
                    onEdit={handleEditClick}
                    onLogResponse={handleLogResponseClick}
                    onRefresh={refreshIncidents}
                    service={incidentService}
                />
            )}

            {showForm && (
                <IncidentForm incident={selectedIncident} onSubmit={handleFormSubmit} onCancel={handleFormClose} />
            )}

            {showResponseForm && responseIncident && (
                <IncidentResponseForm
                    incident={responseIncident}
                    onSubmit={handleResponseSubmit}
                    onCancel={handleResponseFormClose}
                />
            )}
        </div>
    )
}
