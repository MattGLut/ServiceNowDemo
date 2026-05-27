import { getFieldValue } from './fields'

export function buildComplaintSummaries(complaints) {
    const summaries = {}

    for (const complaint of complaints) {
        const incidentSysId = getFieldValue(complaint.incident)
        if (!incidentSysId) {
            continue
        }

        if (!summaries[incidentSysId]) {
            summaries[incidentSysId] = { count: 0, items: [] }
        }

        summaries[incidentSysId].items.push(complaint)
        summaries[incidentSysId].count += 1
    }

    return summaries
}

export function emptyComplaintSummaries(incidentSysIds) {
    const summaries = {}

    for (const incidentSysId of incidentSysIds) {
        summaries[incidentSysId] = { count: 0, items: [] }
    }

    return summaries
}
