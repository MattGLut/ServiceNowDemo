export function formatConfidencePercent(score: number): string {
    return `${(score * 100).toFixed(1)}%`
}

export function formatConfidenceTooltip(score: number): string {
    return `Doc Intel Confidence: ${formatConfidencePercent(score)}`
}
