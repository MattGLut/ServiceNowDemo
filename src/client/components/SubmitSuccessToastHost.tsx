import React, { useState } from 'react'
import SubmitSuccessToast from './SubmitSuccessToast'
import { consumePendingSubmitSuccessToast } from '../utils/submitSuccessToast'

type SubmitSuccessToastHostProps = {
    onDismiss?: () => void
}

export default function SubmitSuccessToastHost({ onDismiss }: SubmitSuccessToastHostProps) {
    const [toast, setToast] = useState(() => consumePendingSubmitSuccessToast())

    if (!toast) {
        return null
    }

    const handleDismiss = () => {
        setToast(null)
        onDismiss?.()
    }

    return (
        <div className="portal-toast-region">
            <SubmitSuccessToast
                key={toast.sysId}
                title={toast.title}
                attachmentCount={toast.attachmentCount}
                onDismiss={handleDismiss}
            />
        </div>
    )
}
