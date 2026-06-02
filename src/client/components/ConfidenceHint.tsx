import React, { useId } from 'react'
import { formatConfidenceTooltip } from '../utils/formatConfidence'

type ConfidenceHintProps = {
    score: number
    fieldLabel?: string
}

export default function ConfidenceHint({ score, fieldLabel }: ConfidenceHintProps) {
    const tooltipId = useId()
    const tooltipText = formatConfidenceTooltip(score)
    const ariaLabel = fieldLabel
        ? `Document Intelligence confidence for ${fieldLabel}: ${tooltipText}`
        : tooltipText

    return (
        <span className="portal-approve-confidence-hint group relative inline-flex">
            <button
                type="button"
                className="portal-approve-confidence-hint-button"
                aria-label={ariaLabel}
                aria-describedby={tooltipId}
            >
                ?
            </button>
            <span id={tooltipId} role="tooltip" className="portal-approve-confidence-tooltip">
                {tooltipText}
            </span>
        </span>
    )
}
