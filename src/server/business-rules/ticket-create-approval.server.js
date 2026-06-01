(function () {
    var approvalGr = new GlideRecord('x_2058901_demo_ticket_approval');
    approvalGr.addQuery('ticket', current.sys_id);
    approvalGr.setLimit(1);
    approvalGr.query();

    if (approvalGr.hasNext()) {
        return;
    }

    approvalGr.initialize();
    approvalGr.ticket = current.sys_id;
    approvalGr.insert();
})();
