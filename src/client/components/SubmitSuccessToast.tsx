import React, { useCallback, useEffect, useState } from 'react'
import {
    SUBMIT_SUCCESS_TOAST_FADE_MS,
    SUBMIT_SUCCESS_TOAST_VISIBLE_MS,
} from '../utils/submitSuccessToast'

type SubmitSuccessToastProps = {
    title: string
    attachmentCount: number
    onDismiss: () => void
}

export default function SubmitSuccessToast({ title, attachmentCount, onDismiss }: SubmitSuccessToastProps) {
    const [isExiting, setIsExiting] = useState(false)

    const beginExit = useCallback(() => {
        setIsExiting((exiting) => (exiting ? exiting : true))
    }, [])

    useEffect(() => {
        const exitTimer = window.setTimeout(beginExit, SUBMIT_SUCCESS_TOAST_VISIBLE_MS)
        return () => window.clearTimeout(exitTimer)
    }, [beginExit])

    useEffect(() => {
        if (!isExiting) {
            return
        }

        const removeTimer = window.setTimeout(onDismiss, SUBMIT_SUCCESS_TOAST_FADE_MS)
        return () => window.clearTimeout(removeTimer)
    }, [isExiting, onDismiss])

    const handleDismiss = () => {
        beginExit()
    }

    return (
        <div
            className={`portal-toast portal-toast-banner ${isExiting ? 'portal-toast-exit' : 'portal-toast-enter'}`}
            role="status"
            aria-live="polite"
        >
            <div className="min-w-0">
                <p className="m-0 font-semibold text-rh-green">Ticket submitted</p>
                <p className="mb-0 mt-1 text-sm text-rh-text">
                    {title}
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
                onClick={handleDismiss}
            >
                ×
            </button>
        </div>
    )
}
