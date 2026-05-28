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
}

export type TicketCreateResult = {
    sysId: string
    title: string
}
