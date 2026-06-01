/**
 * Where approval field values are expected to come from in the full workflow.
 * Colors on the approve form reflect these sources for reviewer double-check.
 */
export type ApprovalFieldSource = 'contract' | 'vendor' | 'docIntel' | 'manual'

export const APPROVAL_FIELD_SOURCE_CLASS: Record<ApprovalFieldSource, string> = {
    contract: 'portal-approve-field--source-contract',
    vendor: 'portal-approve-field--source-vendor',
    docIntel: 'portal-approve-field--source-doc-intel',
    manual: '',
}
