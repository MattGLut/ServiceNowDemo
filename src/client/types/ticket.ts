export type TicketStatus =
    | 'submitted'
    | 'stp_queued'
    | 'di_processing'
    | 'pending_review'
    | 'approved'
    | 'ready_for_pickup'
    | 'picked_up'

export type TicketRequestType = 'general' | 'document' | 'pickup'

export type TicketCreateInput = {
    title: string
    description: string
    requestType: TicketRequestType
    externalId: string
    stpFlag: boolean
}

export type TicketCreateResult = {
    sysId: string
    title: string
}

export type TicketRecord = {
    sysId: string
    title: string
    description: string
    requestType: TicketRequestType
    requestTypeLabel: string
    externalId: string
    stpFlag: boolean
    status: TicketStatus
    statusLabel: string
    submittedAt: string
    submittedByDisplay: string
}

export type TicketAttachment = {
    sysId: string
    fileName: string
    contentType: string
    sizeBytes: number
    createdAt: string
    downloadUrl: string
}
