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
}

export type TicketApprovalFormValues = Omit<TicketApprovalRecord, 'sysId' | 'ticketSysId' | 'approvedAt'>

export type TicketApprovalUpdateInput = TicketApprovalFormValues
