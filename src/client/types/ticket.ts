export type TicketStatus = 'draft' | 'approved' | 'posted'

export type TicketCreateInput = {
    title: string
    description: string
    workflowTypeSysId: string
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
    workflowTypeSysId: string
    workflowTypeCode: string
    workflowTypeName: string
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
