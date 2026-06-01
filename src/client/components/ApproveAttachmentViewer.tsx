import React, { useEffect, useMemo, useState } from 'react'
import { buildAttachmentDownloadUrl } from '../services/TicketService'
import { formatFileSize } from '../utils/formatDateTime'
import { INPUT_CLASS, LABEL_CLASS } from './formStyles'
import type { TicketAttachment } from '../types/ticket'

type ApproveAttachmentViewerProps = {
    attachments: TicketAttachment[]
}

function isPdfAttachment(attachment: TicketAttachment): boolean {
    const type = attachment.contentType.toLowerCase()
    const name = attachment.fileName.toLowerCase()
    return type.includes('pdf') || name.endsWith('.pdf')
}

export default function ApproveAttachmentViewer({ attachments }: ApproveAttachmentViewerProps) {
    const viewableAttachments = useMemo(
        () => attachments.filter(isPdfAttachment),
        [attachments]
    )
    const documents = viewableAttachments.length > 0 ? viewableAttachments : attachments

    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(0)
    }, [documents])

    const safeIndex = documents.length === 0 ? 0 : Math.min(selectedIndex, documents.length - 1)
    const current = documents[safeIndex]

    if (documents.length === 0) {
        return (
            <div className="portal-approve-pdf-empty">
                <p className="portal-detail-message m-0">No attachments to display.</p>
            </div>
        )
    }

    const viewUrl = buildAttachmentDownloadUrl(current.sysId)
    const canEmbed = isPdfAttachment(current)

    return (
        <div className="portal-approve-pdf-panel">
            <div className="portal-approve-pdf-toolbar">
                <div className="portal-approve-pdf-picker">
                    <label htmlFor="approve-attachment-select" className={LABEL_CLASS}>
                        Document
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            id="approve-attachment-select"
                            className={`${INPUT_CLASS} portal-approve-pdf-select`}
                            value={String(safeIndex)}
                            onChange={(event) => setSelectedIndex(Number.parseInt(event.target.value, 10))}
                        >
                            {documents.map((attachment, index) => (
                                <option key={attachment.sysId} value={String(index)}>
                                    {attachment.fileName}
                                </option>
                            ))}
                        </select>
                        <span className="text-xs text-rh-muted whitespace-nowrap">
                            {safeIndex + 1} of {documents.length}
                        </span>
                    </div>
                </div>
                <div className="portal-approve-pdf-meta">
                    <span className="text-xs text-rh-muted">{formatFileSize(current.sizeBytes)}</span>
                    <a
                        href={viewUrl}
                        className="text-xs text-rh-green no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open in new tab
                    </a>
                </div>
            </div>

            <div className="portal-approve-pdf-frame">
                {canEmbed ? (
                    <iframe
                        key={current.sysId}
                        title={current.fileName}
                        src={viewUrl}
                        className="portal-approve-pdf-iframe"
                    />
                ) : (
                    <div className="portal-approve-pdf-fallback">
                        <p className="portal-detail-message m-0">In-browser preview is only available for PDF files.</p>
                        <a
                            href={viewUrl}
                            className="mt-3 text-sm text-rh-green no-underline hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download {current.fileName}
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
