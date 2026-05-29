import React, { useRef, useState } from 'react'
import { TICKET_REQUEST_TYPE_OPTIONS } from '../constants/ticketRequestTypes'
import { LABEL_CLASS, INPUT_CLASS, BTN_PRIMARY, BTN_CANCEL } from './formStyles'
import ToggleSwitch from './ToggleSwitch'
import type { TicketCreateResult, TicketRequestType } from '../types/ticket'

const MAX_FILE_SIZE_MB = 25
const MAX_FILES = 10

type TicketIntakeFormProps = {
    onSubmit: (input: {
        title: string
        description: string
        requestType: TicketRequestType
        externalId: string
        stpFlag: boolean
        files: File[]
    }) => Promise<TicketCreateResult>
}

export default function TicketIntakeForm({ onSubmit }: TicketIntakeFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [requestType, setRequestType] = useState<TicketRequestType>('general')
    const [externalId, setExternalId] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [stpFlag, setStpFlag] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setRequestType('general')
        setExternalId('')
        setStpFlag(false)
        setSelectedFiles([])
        setFileError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

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
                requestType,
                externalId,
                stpFlag,
                files: selectedFiles,
            })
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form
            className="portal-intake-form mx-auto w-full max-w-2xl rounded-xl border border-rh-border bg-rh-panel p-6"
            onSubmit={(event) => void handleSubmit(event)}
        >
            <h2 className="m-0 mb-1 text-lg font-semibold text-rh-text">Submit a ticket</h2>
            <p className="mb-6 mt-0 text-sm text-rh-muted">
                Provide details and optional supporting documents. Tickets start in Submitted status.
            </p>

            <div className="mb-5">
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

            <div className="portal-intake-form-row mb-5">
                <div className="min-w-0">
                    <label htmlFor="ticket_request_type" className={LABEL_CLASS}>
                        Request type
                    </label>
                    <select
                        id="ticket_request_type"
                        name="request_type"
                        className={INPUT_CLASS}
                        value={requestType}
                        onChange={(event) => setRequestType(event.target.value as TicketRequestType)}
                        disabled={submitting}
                    >
                        {TICKET_REQUEST_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="min-w-0">
                    <label htmlFor="ticket_external_id" className={LABEL_CLASS}>
                        External reference
                    </label>
                    <input
                        id="ticket_external_id"
                        name="external_id"
                        type="text"
                        className={INPUT_CLASS}
                        value={externalId}
                        onChange={(event) => setExternalId(event.target.value)}
                        maxLength={50}
                        placeholder="Your reference number (optional)"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div className="mb-5">
                <label htmlFor="ticket_description" className={LABEL_CLASS}>
                    Description
                </label>
                <textarea
                    id="ticket_description"
                    name="description"
                    className={INPUT_CLASS}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    maxLength={8000}
                    placeholder="Additional context for processing..."
                    disabled={submitting}
                />
            </div>

            <div className="portal-intake-form-row mb-6">
                <div className="min-w-0">
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
                    <p className="mt-2 text-xs text-rh-muted">
                        Up to {MAX_FILES} files, {MAX_FILE_SIZE_MB} MB each. PDF and images recommended for
                        document intelligence routing.
                    </p>
                    {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
                </div>
                <div className="min-w-0 self-end">
                    <ToggleSwitch
                        id="ticket_stp_flag"
                        name="stp_flag"
                        label="Straight-through processing (STP)"
                        checked={stpFlag}
                        onChange={setStpFlag}
                        disabled={submitting}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2.5">
                <button type="button" className={BTN_CANCEL} onClick={resetForm} disabled={submitting}>
                    Reset
                </button>
                <button type="submit" className={BTN_PRIMARY} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit ticket'}
                </button>
            </div>
        </form>
    )
}
