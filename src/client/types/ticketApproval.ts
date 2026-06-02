export type DiStatus = 'pending' | 'complete' | 'failed' | 'skipped'

export type ContractStatus = 'pending' | 'complete' | 'failed' | 'skipped'

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
    fieldConfidence: ApprovalFieldConfidence
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
    | 'fieldConfidence'
>

export type ApprovalFieldConfidence = Partial<
    Record<keyof TicketApprovalFormValues | '_document', number>
>

export type TicketApprovalUpdateInput = TicketApprovalFormValues
