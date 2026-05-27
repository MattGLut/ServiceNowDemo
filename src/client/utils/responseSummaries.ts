import { getFieldValue } from './fields'

export function buildResponseSummaries(responses) {
    const summaries = {}

    for (const response of responses) {
        const incidentSysId = getFieldValue(response.incident)
        if (!incidentSysId) {
            continue
        }

        if (!summaries[incidentSysId]) {
            summaries[incidentSysId] = { count: 0, items: [] }
        }

        summaries[incidentSysId].items.push(response)
        summaries[incidentSysId].count += 1
    }

    return summaries
}

export function emptyResponseSummaries(incidentSysIds) {
    const summaries = {}

    for (const incidentSysId of incidentSysIds) {
        summaries[incidentSysId] = { count: 0, items: [] }
    }

    return summaries
}
