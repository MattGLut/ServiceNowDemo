export type TicketStatus =
    | 'submitted'
    | 'stp_queued'
    | 'di_processing'
    | 'pending_review'
    | 'approved'
    | 'ready_for_pickup'
    | 'picked_up'

export type TicketCreateInput = {
    title: string
    description: string
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
