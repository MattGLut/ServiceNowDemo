import React, { useId } from 'react'
import { formatConfidencePercent, formatConfidenceTooltip } from '../utils/formatConfidence'

type ConfidenceHintProps = {
    score: number
    fieldLabel?: string
}

export default function ConfidenceHint({ score, fieldLabel }: ConfidenceHintProps) {
    const tooltipId = useId()
    const tooltipText = formatConfidenceTooltip(score)
    const percent = formatConfidencePercent(score)
    const ariaLabel = fieldLabel
        ? `Doc Intel confidence for ${fieldLabel}: ${percent}`
        : tooltipText

    return (
        <span className="portal-approve-confidence-hint">
            <span
                className="portal-approve-confidence-hint-trigger"
                tabIndex={0}
                aria-label={ariaLabel}
                aria-describedby={tooltipId}
            >
                ?
            </span>
            <span id={tooltipId} role="tooltip" className="portal-approve-confidence-tooltip">
                {tooltipText}
            </span>
        </span>
    )
}
