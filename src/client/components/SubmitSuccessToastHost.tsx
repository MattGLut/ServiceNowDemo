import React, { useState } from 'react'
import SubmitSuccessToast from './SubmitSuccessToast'
import { consumePendingSubmitSuccessToast } from '../utils/submitSuccessToast'

export default function SubmitSuccessToastHost() {
    const [toast, setToast] = useState(() => consumePendingSubmitSuccessToast())

    if (!toast) {
        return null
    }

    return (
        <div className="portal-toast-region">
            <SubmitSuccessToast
                key={toast.sysId}
                title={toast.title}
                attachmentCount={toast.attachmentCount}
                onDismiss={() => setToast(null)}
            />
        </div>
    )
}
