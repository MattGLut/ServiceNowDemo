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

export function getRecordSysId(record) {
    return getFieldValue(record.sys_id)
}
