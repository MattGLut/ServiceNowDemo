export type DiStatus = 'pending' | 'complete' | 'failed' | 'skipped'

export type ContractStatus = 'pending' | 'complete' | 'failed' | 'skipped'

export type PayloadStatus = 'pending' | 'ready' | 'failed'

export type TicketApprovalRecord = {
    sysId: string
    ticketSysId: string
    companyCode: string
    invoiceNumber: string
    profitCenter: string
    currency: string
    subtotalAmount: string
    taxAmount: string
    totalAmount: string
    approverName: string
    approverId: string
    paymentMethod: string
    reqPaymentDate: string
    chargePayeeId: string
    chargePayeeName: string
    reviewerNotes: string
    supervisorNotes: string
    operatorNotes: string
    approvedAt: string
    diStatus: DiStatus | ''
    diError: string
    diProcessedAt: string
    contractStatus: ContractStatus | ''
    contractError: string
    contractProcessedAt: string
    workflowTypeSysId: string
    workflowTypeCode: string
    isHybridSegment: boolean
    fieldConfidence: ApprovalFieldConfidence
    contractNumber: string
    realizeNumber: string
    invoiceDate: string
    invoiceSubnumber: string
    taxCode: string
    invoicingPartyId: string
    chargeType: string
    salesOrPurchase: string
    lineProfitCenter: string
    rtmPayloadJson: Record<string, unknown> | null
    payloadStatus: PayloadStatus | ''
    payloadBuiltAt: string
    payloadError: string
}

export type TicketApprovalFormValues = Omit<
    TicketApprovalRecord,
    | 'sysId'
    | 'ticketSysId'
    | 'approvedAt'
    | 'diStatus'
    | 'diError'
    | 'diProcessedAt'
    | 'contractStatus'
    | 'contractError'
    | 'contractProcessedAt'
    | 'workflowTypeSysId'
    | 'workflowTypeCode'
    | 'isHybridSegment'
    | 'fieldConfidence'
    | 'rtmPayloadJson'
    | 'payloadStatus'
    | 'payloadBuiltAt'
    | 'payloadError'
>

export type ApprovalFieldConfidence = Partial<
    Record<keyof TicketApprovalFormValues | '_document', number>
>

export type TicketApprovalUpdateInput = TicketApprovalFormValues
