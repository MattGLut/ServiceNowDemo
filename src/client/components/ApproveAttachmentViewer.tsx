import React, { useEffect, useMemo, useState } from 'react'
import { TicketService, buildAttachmentDownloadUrl } from '../services/TicketService'
import { INPUT_CLASS } from './formStyles'
import type { TicketAttachment } from '../types/ticket'

type ApproveAttachmentViewerProps = {
    attachments: TicketAttachment[]
}

function isPdfAttachment(attachment: TicketAttachment): boolean {
    const type = attachment.contentType.toLowerCase()
    const name = attachment.fileName.toLowerCase()
    return type.includes('pdf') || name.endsWith('.pdf')
}

const DESKTOP_PDF_MIN_WIDTH_PX = 1024

function useDesktopViewport(): boolean {
    const [isDesktop, setIsDesktop] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(`(min-width: ${DESKTOP_PDF_MIN_WIDTH_PX}px)`).matches
    )

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${DESKTOP_PDF_MIN_WIDTH_PX}px)`)
        const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
        setIsDesktop(mq.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    return isDesktop
}

/** Hide nav pane; desktop opens at 100% zoom, smaller viewports fit to width. */
function pdfEmbedUrl(blobOrFileUrl: string, desktopZoom100: boolean): string {
    const viewPart = desktopZoom100 ? 'zoom=100' : 'view=FitH'
    const params = `navpanes=0&pagemode=none&${viewPart}`
    const hashIndex = blobOrFileUrl.indexOf('#')
    if (hashIndex === -1) {
        return `${blobOrFileUrl}#${params}`
    }
    const base = blobOrFileUrl.slice(0, hashIndex)
    const existing = blobOrFileUrl.slice(hashIndex + 1)
    return `${base}#${existing ? `${existing}&` : ''}${params}`
}

export default function ApproveAttachmentViewer({ attachments }: ApproveAttachmentViewerProps) {
    const ticketService = useMemo(() => new TicketService(), [])
    const desktopZoom100 = useDesktopViewport()
    const viewableAttachments = useMemo(
        () => attachments.filter(isPdfAttachment),
        [attachments]
    )
    const documents = viewableAttachments.length > 0 ? viewableAttachments : attachments

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [previewError, setPreviewError] = useState<string | null>(null)

    useEffect(() => {
        setSelectedIndex(0)
    }, [documents])

    const safeIndex = documents.length === 0 ? 0 : Math.min(selectedIndex, documents.length - 1)
    const current = documents[safeIndex]
    const canPreview = Boolean(current && isPdfAttachment(current))
    const previewAttachmentSysId = canPreview ? current.sysId : null

    useEffect(() => {
        if (!previewAttachmentSysId) {
            setPreviewUrl(null)
            setPreviewError(null)
            setPreviewLoading(false)
            return
        }

        let cancelled = false

        const loadPreview = async () => {
            setPreviewLoading(true)
            setPreviewError(null)
            setPreviewUrl((previousUrl) => {
                if (previousUrl) {
                    URL.revokeObjectURL(previousUrl)
                }
                return null
            })

            try {
                const blob = await ticketService.fetchAttachmentFile(previewAttachmentSysId)
                if (cancelled) {
                    return
                }
                const objectUrl = URL.createObjectURL(blob)
                setPreviewUrl(objectUrl)
            } catch (err) {
                if (cancelled) {
                    return
                }
                const message = err instanceof Error ? err.message : 'Failed to load document'
                setPreviewError(message)
                console.error(err)
            } finally {
                if (!cancelled) {
                    setPreviewLoading(false)
                }
            }
        }

        void loadPreview()

        return () => {
            cancelled = true
            setPreviewUrl((previousUrl) => {
                if (previousUrl) {
                    URL.revokeObjectURL(previousUrl)
                }
                return null
            })
        }
    }, [previewAttachmentSysId, ticketService])

    if (documents.length === 0) {
        return (
            <div className="portal-approve-pdf-empty">
                <p className="portal-detail-message m-0">No attachments to display.</p>
            </div>
        )
    }

    const downloadUrl = buildAttachmentDownloadUrl(current.sysId)
    const openInTabUrl =
        previewUrl && canPreview
            ? pdfEmbedUrl(previewUrl, desktopZoom100)
            : previewUrl ?? downloadUrl

    return (
        <div className="portal-approve-pdf-panel">
            <div className="portal-approve-pdf-toolbar">
                <div className="portal-approve-pdf-toolbar-left">
                    <select
                        id="approve-attachment-select"
                        aria-label="Document"
                        className={`${INPUT_CLASS} portal-approve-select-compact portal-approve-pdf-select`}
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
                <a
                    href={openInTabUrl}
                    className="portal-approve-pdf-open-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open in new tab
                </a>
            </div>

            <div className="portal-approve-pdf-frame">
                {!canPreview && (
                    <div className="portal-approve-pdf-fallback">
                        <p className="portal-detail-message m-0">In-browser preview is only available for PDF files.</p>
                        <a
                            href={downloadUrl}
                            className="mt-3 text-sm text-rh-green no-underline hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open {current.fileName}
                        </a>
                    </div>
                )}

                {canPreview && previewLoading && (
                    <p className="portal-detail-message m-auto">Loading document…</p>
                )}

                {canPreview && previewError && (
                    <div className="portal-approve-pdf-fallback">
                        <p className="portal-detail-message m-0 text-red-400">{previewError}</p>
                        <a
                            href={openInTabUrl}
                            className="mt-3 text-sm text-rh-green no-underline hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in new tab
                        </a>
                    </div>
                )}

                {canPreview && previewUrl && !previewLoading && !previewError && (
                    <iframe
                        key={`${current.sysId}-${desktopZoom100 ? '100' : 'fith'}`}
                        title={current.fileName}
                        src={pdfEmbedUrl(previewUrl, desktopZoom100)}
                        className="portal-approve-pdf-iframe"
                    />
                )}
            </div>
        </div>
    )
}
