import React, { useRef, useState } from 'react'
import { LABEL_CLASS, INPUT_CLASS, BTN_PRIMARY, BTN_CANCEL } from './formStyles'
import type { TicketCreateResult } from '../types/ticket'

const MAX_FILE_SIZE_MB = 25
const MAX_FILES = 10

type TicketIntakeFormProps = {
    onSubmit: (input: { title: string; description: string; files: File[] }) => Promise<TicketCreateResult>
    embedded?: boolean
}

export default function TicketIntakeForm({ onSubmit, embedded = false }: TicketIntakeFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null)
        const fileList = event.target.files
        if (!fileList?.length) {
            setSelectedFiles([])
            return
        }

        const files = Array.from(fileList)
        const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024

        if (files.length > MAX_FILES) {
            setFileError(`You can attach up to ${MAX_FILES} files.`)
            return
        }

        const oversized = files.find((file) => file.size > maxBytes)
        if (oversized) {
            setFileError(`Each file must be ${MAX_FILE_SIZE_MB} MB or smaller.`)
            return
        }

        setSelectedFiles(files)
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setFileError(null)
        setSubmitting(true)

        try {
            await onSubmit({
                title,
                description,
                files: selectedFiles,
            })
            setTitle('')
            setDescription('')
            setSelectedFiles([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleClearFiles = () => {
        setSelectedFiles([])
        setFileError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const formClassName = embedded
        ? 'portal-submit-form'
        : 'mx-auto max-w-2xl rounded-xl border border-rh-border bg-rh-panel p-6'

    const fieldWrapClass = embedded ? 'portal-submit-field' : 'mb-5'
    const descriptionRows = embedded ? 2 : 5

    const fields = (
        <>
            <div className={fieldWrapClass}>
                <label htmlFor="ticket_title" className={LABEL_CLASS}>
                    Title *
                </label>
                <input
                    id="ticket_title"
                    name="title"
                    type="text"
                    className={INPUT_CLASS}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    maxLength={200}
                    placeholder="Brief summary of the request"
                    disabled={submitting}
                />
            </div>

            <div
                className={
                    embedded
                        ? 'portal-submit-field portal-submit-field-description'
                        : fieldWrapClass
                }
            >
                <label htmlFor="ticket_description" className={LABEL_CLASS}>
                    Description
                </label>
                <textarea
                    id="ticket_description"
                    name="description"
                    className={embedded ? `${INPUT_CLASS} portal-submit-textarea` : INPUT_CLASS}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={descriptionRows}
                    maxLength={8000}
                    placeholder="Additional context for processing..."
                    disabled={submitting}
                />
            </div>

            <div className={embedded ? 'portal-submit-field' : 'mb-6'}>
                <label htmlFor="ticket_files" className={LABEL_CLASS}>
                    Attachments
                </label>
                <input
                    ref={fileInputRef}
                    id="ticket_files"
                    name="files"
                    type="file"
                    className="block w-full text-sm text-rh-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-rh-elevated file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rh-text hover:file:bg-rh-border"
                    multiple
                    onChange={handleFileChange}
                    disabled={submitting}
                />
                {!embedded && (
                    <p className="mt-2 text-xs text-rh-muted">
                        Up to {MAX_FILES} files, {MAX_FILE_SIZE_MB} MB each. PDF and images recommended for
                        document intelligence routing.
                    </p>
                )}
                {embedded && (
                    <p className="mt-1 text-xs text-rh-muted">
                        Up to {MAX_FILES} files, {MAX_FILE_SIZE_MB} MB each.
                    </p>
                )}
                {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
                {selectedFiles.length > 0 && (
                    <ul className="mt-2 max-h-20 space-y-1 overflow-y-auto rounded-lg border border-rh-border bg-rh-bg px-3 py-2 text-sm text-rh-text">
                        {selectedFiles.map((file) => (
                            <li key={`${file.name}-${file.size}`}>
                                {file.name}{' '}
                                <span className="text-rh-muted">({formatFileSize(file.size)})</span>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedFiles.length > 0 && (
                    <button
                        type="button"
                        className="mt-1 cursor-pointer border-0 bg-transparent text-sm text-rh-muted underline hover:text-rh-text"
                        onClick={handleClearFiles}
                        disabled={submitting}
                    >
                        Clear files
                    </button>
                )}
            </div>
        </>
    )

    const actions = (
        <>
            <button
                type="button"
                className={BTN_CANCEL}
                onClick={() => {
                    setTitle('')
                    setDescription('')
                    handleClearFiles()
                }}
                disabled={submitting}
            >
                Reset
            </button>
            <button type="submit" className={BTN_PRIMARY} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit ticket'}
            </button>
        </>
    )

    return (
        <form className={formClassName} onSubmit={(event) => void handleSubmit(event)}>
            {!embedded && (
                <>
                    <h2 className="m-0 mb-1 text-lg font-semibold text-rh-text">Submit a ticket</h2>
                    <p className="mb-6 mt-0 text-sm text-rh-muted">
                        Provide details and optional supporting documents. Tickets start in Submitted status.
                    </p>
                </>
            )}

            {embedded ? (
                <>
                    <div className="portal-submit-form-fields">{fields}</div>
                    <div className="portal-submit-form-actions">{actions}</div>
                </>
            ) : (
                <>
                    {fields}
                    <div className="flex justify-end gap-2.5">{actions}</div>
                </>
            )}
        </form>
    )
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
