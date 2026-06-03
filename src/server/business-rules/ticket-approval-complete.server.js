(function () {
    if (!current.approved_at) {
        return
    }

    if (previous && previous.approved_at) {
        return
    }

    var ticketId = current.ticket.toString()
    if (!ticketId) {
        return
    }

    var ticketGr = new GlideRecord('x_2058901_demo_ticket')
    if (!ticketGr.get(ticketId)) {
        return
    }

    if (ticketGr.status.toString() !== 'draft') {
        return
    }

    var approvalGr = new GlideRecord('x_2058901_demo_ticket_approval')
    approvalGr.addQuery('ticket', ticketId)
    approvalGr.query()

    if (!approvalGr.hasNext()) {
        return
    }

    while (approvalGr.next()) {
        if (!approvalGr.approved_at) {
            return
        }
    }

    ticketGr.status = 'approved'
    ticketGr.update()
})()
