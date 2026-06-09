import React from 'react'
import type { PayloadStatus, TicketApprovalRecord } from '../types/ticketApproval'

type WrtPayloadPanelProps = {
    approval: TicketApprovalRecord
    segmentLabel?: string
}

function panelTitle(segmentLabel?: string): string {
    if (segmentLabel) {
        return `WRT Payload (pending submission) — ${segmentLabel}`
    }
    return 'WRT Payload (pending submission)'
}

export default function WrtPayloadPanel({ approval, segmentLabel }: WrtPayloadPanelProps) {
    const title = panelTitle(segmentLabel || approval.workflowTypeCode || undefined)
    const payloadStatus: PayloadStatus | '' = approval.payloadStatus

    if (approval.approvedAt && payloadStatus === 'pending') {
        return (
            <section className="portal-wrt-payload-panel" aria-live="polite">
                <h3 className="portal-wrt-payload-title">{title}</h3>
                <p className="portal-wrt-payload-message m-0 text-sm text-rh-muted">Building payload…</p>
            </section>
        )
    }

    if (payloadStatus === 'failed') {
        return (
            <section className="portal-wrt-payload-panel portal-wrt-payload-panel-error" role="alert">
                <h3 className="portal-wrt-payload-title">{title}</h3>
                <p className="m-0 text-sm font-medium text-red-400">WRT payload build failed</p>
                {approval.payloadError && (
                    <p className="m-0 mt-1 text-sm text-red-300">{approval.payloadError}</p>
                )}
            </section>
        )
    }

    if (payloadStatus !== 'ready' || !approval.rtmPayloadJson) {
        return null
    }

    return (
        <section className="portal-wrt-payload-panel">
            <h3 className="portal-wrt-payload-title">{title}</h3>
            <pre className="portal-wrt-payload-pre">{JSON.stringify(approval.rtmPayloadJson, null, 2)}</pre>
        </section>
    )
}
