export function getFieldDisplayValue(field) {
    if (field == null) {
        return ''
    }

    return typeof field === 'object' ? field.display_value ?? '' : String(field)
}

export function getFieldValue(field) {
    if (field == null) {
        return ''
    }

    return typeof field === 'object' ? field.value ?? '' : String(field)
}

export function getIncidentSysId(incident) {
    return getFieldValue(incident.sys_id)
}
