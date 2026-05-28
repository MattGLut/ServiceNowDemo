import React from 'react'
import type { TicketCreateResult } from '../types/ticket'

type SubmitSuccessToastProps = {
    submission: TicketCreateResult
    attachmentCount: number
    onDismiss: () => void
}

export default function SubmitSuccessToast({
    submission,
    attachmentCount,
    onDismiss,
}: SubmitSuccessToastProps) {
    return (
        <div
            className="portal-toast portal-submit-banner portal-submit-banner-success flex items-start justify-between gap-3"
            role="status"
            aria-live="polite"
        >
            <div className="min-w-0">
                <p className="m-0 font-semibold">Ticket submitted</p>
                <p className="mb-0 mt-1 text-sm">
                    <span className="text-rh-text">{submission.title}</span>
                    {attachmentCount > 0 && (
                        <span className="text-rh-muted">
                            {' '}
                            — {attachmentCount} file{attachmentCount === 1 ? '' : 's'} attached
                        </span>
                    )}
                </p>
            </div>
            <button
                type="button"
                className="portal-submit-banner-close"
                aria-label="Dismiss success message"
                onClick={onDismiss}
            >
                ×
            </button>
        </div>
    )
}
