import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const x_2058901_demo_attachment_doc_intel = BusinessRule({
    $id: Now.ID['attachment-doc-intel-br'],
    name: 'Run Doc Intel on Ticket PDF Attachment',
    table: 'sys_attachment',
    when: 'async',
    action: ['insert'],
    filterCondition: 'table_name=x_2058901_demo_ticket^content_typeLIKEapplication/pdf',
    order: 100,
    active: true,
    description:
        'Calls Azure Doc Intel for non-STP ticket PDFs and maps extracted fields onto the ticket approval row.',
    script: Now.include('../../server/business-rules/attachment-doc-intel.server.js'),
})
