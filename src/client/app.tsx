import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { IncidentService } from './services/IncidentService'
import { IncidentResponseService } from './services/IncidentResponseService'
import IncidentList from './components/IncidentList'
import IncidentForm from './components/IncidentForm'
import IncidentResponseForm from './components/IncidentResponseForm'
import { getIncidentSysId } from './utils/fields'
import { buildResponseSummaries, emptyResponseSummaries } from './utils/responseSummaries'

export default function App() {
    const [incidents, setIncidents] = useState([])
    const [responseSummaries, setResponseSummaries] = useState({})
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showResponseForm, setShowResponseForm] = useState(false)
    const [selectedIncident, setSelectedIncident] = useState(null)
    const [responseIncident, setResponseIncident] = useState(null)
    const [error, setError] = useState(null)

    const incidentService = useMemo(() => new IncidentService(), [])
    const incidentResponseService = useMemo(() => new IncidentResponseService(), [])

    const loadResponseSummaries = useCallback(
        async (incidentsList) => {
            const incidentSysIds = incidentsList.map(getIncidentSysId).filter(Boolean)

            if (!incidentSysIds.length) {
                setResponseSummaries({})
                return
            }

            try {
                const responses = await incidentResponseService.listByIncidents(incidentSysIds)
                setResponseSummaries(buildResponseSummaries(responses))
            } catch (err) {
                setResponseSummaries(emptyResponseSummaries(incidentSysIds))
                setError('Failed to load incident responses: ' + (err.message || 'Unknown error'))
                console.error(err)
            }
        },
        [incidentResponseService]
    )

    const refreshIncidents = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await incidentService.list()
            setIncidents(data)
            await loadResponseSummaries(data)
        } catch (err) {
            setError('Failed to load incidents: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [incidentService, loadResponseSummaries])

    useEffect(() => {
        void refreshIncidents()
    }, [refreshIncidents])

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

        try {
            setError(null)
            const sysId = getIncidentSysId(responseIncident)
            await incidentResponseService.create(sysId, responseText)
            setShowResponseForm(false)
            setResponseIncident(null)
            await loadResponseSummaries(incidents)
        } catch (err) {
            setError('Failed to log incident response: ' + (err.message || 'Unknown error'))
            console.error(err)
        }
    }

    const handleFormSubmit = async (formData) => {
        setLoading(true)
        try {
            if (selectedIncident) {
                await incidentService.update(getIncidentSysId(selectedIncident), formData)
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
        <div className="min-h-screen w-full bg-rh-bg p-5 font-sans max-md:p-3">
            <header className="mb-5 flex items-center justify-between border-b border-rh-border pb-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
                <h1 className="m-0 text-2xl font-bold tracking-tight text-rh-text max-md:text-xl">
                    Incident Response Manager Pro
                </h1>
                <button
                    type="button"
                    className="cursor-pointer rounded-full border-0 bg-rh-green px-6 py-2.5 text-sm font-bold text-black hover:bg-rh-green-hover max-md:w-full max-md:text-center"
                    onClick={handleCreateClick}
                >
                    Create New Incident
                </button>
            </header>

            {error && (
                <div className="mb-5 flex items-center justify-between rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent font-semibold text-red-400 underline hover:text-red-300"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {loading ? (
                <div className="py-10 text-center text-lg text-rh-muted">Loading...</div>
            ) : (
                <IncidentList
                    incidents={incidents}
                    responseSummaries={responseSummaries}
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
