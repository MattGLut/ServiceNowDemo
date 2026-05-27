;(function executeRule(current, previous /*null on insert*/) {
    if (!current.responded_by) {
        current.responded_by = gs.getUserID()
    }
})(current, previous)
