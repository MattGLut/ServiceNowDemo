import React, { useState, useEffect, useMemo } from 'react'
import { IncidentService } from './services/IncidentService'
import { IncidentResponseService } from './services/IncidentResponseService'
import IncidentList from './components/IncidentList'
import IncidentForm from './components/IncidentForm'
import IncidentResponseForm from './components/IncidentResponseForm'
import './app.css'

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
        <div className="incident-app">
            <header className="app-header">
                <h1>Incident Response Manager Pro</h1>
                <button className="create-button" onClick={handleCreateClick}>
                    Create New Incident
                </button>
            </header>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading...</div>
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
