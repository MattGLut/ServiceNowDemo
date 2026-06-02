export function formatConfidencePercent(score: number): string {
    return `${(score * 100).toFixed(1)}%`
}

export function formatConfidenceTooltip(score: number): string {
    return `Document Intelligence confidence: ${formatConfidencePercent(score)}`
}
