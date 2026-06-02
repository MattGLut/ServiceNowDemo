import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['workflow-type-ch11'],
    table: 'x_2058901_demo_workflow_type',
    data: {
        code: 'CH11',
        name: 'Charges Payable',
    },
})

Record({
    $id: Now.ID['workflow-type-pi01'],
    table: 'x_2058901_demo_workflow_type',
    data: {
        code: 'PI01',
        name: 'PI01',
    },
})
