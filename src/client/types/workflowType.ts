export type WorkflowType = {
    sysId: string
    code: string
    name: string
}

export function formatWorkflowTypeLabel(type: Pick<WorkflowType, 'code' | 'name'>): string {
    return `${type.code} — ${type.name}`
}
