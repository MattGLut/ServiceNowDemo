export const TICKET_REQUEST_TYPE_OPTIONS = [
    { value: 'general', label: 'General request' },
    { value: 'document', label: 'Document submission' },
    { value: 'pickup', label: 'Pickup request' },
] as const

export const TICKET_REQUEST_TYPE_LABELS: Record<string, string> = Object.fromEntries(
    TICKET_REQUEST_TYPE_OPTIONS.map((option) => [option.value, option.label])
)
