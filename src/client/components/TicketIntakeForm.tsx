import React, { useEffect, useMemo, useRef, useState } from 'react'
import { LABEL_CLASS, INPUT_CLASS, BTN_PRIMARY, BTN_CANCEL } from './formStyles'
import ToggleSwitch from './ToggleSwitch'
import { WorkflowTypeService } from '../services/WorkflowTypeService'
import { formatWorkflowTypeLabel } from '../types/workflowType'
import type { TicketCreateResult } from '../types/ticket'
import type { WorkflowType } from '../types/workflowType'

const MAX_FILE_SIZE_MB = 25
const MAX_FILES = 10
const PDF_ACCEPT = 'application/pdf,.pdf'

function isPdfFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

type TicketIntakeFormProps = {
    onSubmit: (input: {
        title: string
        description: string
        workflowTypeSysId: string
        externalId: string
        stpFlag: boolean
        files: File[]
    }) => Promise<TicketCreateResult>
}

export default function TicketIntakeForm({ onSubmit }: TicketIntakeFormProps) {
    const workflowTypeService = useMemo(() => new WorkflowTypeService(), [])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [workflowTypes, setWorkflowTypes] = useState<WorkflowType[]>([])
    const [workflowTypesLoading, setWorkflowTypesLoading] = useState(true)
    const [workflowTypesError, setWorkflowTypesError] = useState<string | null>(null)
    const [workflowTypeSysId, setWorkflowTypeSysId] = useState('')
    const [externalId, setExternalId] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [stpFlag, setStpFlag] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const loadWorkflowTypes = async () => {
            setWorkflowTypesLoading(true)
            setWorkflowTypesError(null)

            try {
                const types = await workflowTypeService.list()
                if (cancelled) {
                    return
                }

                setWorkflowTypes(types)
                setWorkflowTypeSysId((current) => current || types[0]?.sysId || '')
            } catch (err) {
                if (cancelled) {
                    return
                }

                const message = err instanceof Error ? err.message : 'Unknown error'
                setWorkflowTypesError('Failed to load workflow types: ' + message)
                console.error(err)
            } finally {
                if (!cancelled) {
                    setWorkflowTypesLoading(false)
                }
            }
        }

        void loadWorkflowTypes()

        return () => {
            cancelled = true
        }
    }, [workflowTypeService])

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setWorkflowTypeSysId(workflowTypes[0]?.sysId || '')
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

        const nonPdf = files.find((file) => !isPdfFile(file))
        if (nonPdf) {
            setFileError('Only PDF files are allowed.')
            setSelectedFiles([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            return
        }

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

        if (!workflowTypeSysId) {
            return
        }

        if (!externalId.trim()) {
            return
        }

        if (selectedFiles.length === 0) {
            setFileError('At least one PDF attachment is required.')
            return
        }

        setSubmitting(true)

        try {
            await onSubmit({
                title,
                description,
                workflowTypeSysId,
                externalId,
                stpFlag,
                files: selectedFiles,
            })
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const formDisabled = submitting || workflowTypesLoading || !workflowTypeSysId

    return (
        <form className="portal-intake-form" onSubmit={(event) => void handleSubmit(event)}>
            <div className="shrink-0">
                <h2 className="m-0 mb-1 text-lg font-semibold text-rh-text sm:text-xl">Submit a ticket</h2>
                <p className="m-0 text-sm text-rh-muted">
                    Provide ticket details, contract number, workflow type, and at least one PDF attachment.
                </p>
            </div>

            <div className="portal-intake-form-body">
                <div className="shrink-0">
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
                        disabled={formDisabled}
                    />
                </div>

                <div className="portal-intake-form-row">
                    <div className="min-w-0">
                        <label htmlFor="ticket_workflow_type" className={LABEL_CLASS}>
                            Workflow Type *
                        </label>
                        <select
                            id="ticket_workflow_type"
                            name="workflow_type"
                            className={INPUT_CLASS}
                            value={workflowTypeSysId}
                            onChange={(event) => setWorkflowTypeSysId(event.target.value)}
                            required
                            disabled={formDisabled}
                        >
                            {workflowTypesLoading && <option value="">Loading workflow types…</option>}
                            {!workflowTypesLoading && workflowTypes.length === 0 && (
                                <option value="">No workflow types available</option>
                            )}
                            {workflowTypes.map((type) => (
                                <option key={type.sysId} value={type.sysId}>
                                    {formatWorkflowTypeLabel(type)}
                                </option>
                            ))}
                        </select>
                        {workflowTypesError && (
                            <p className="mt-2 text-sm text-red-400">{workflowTypesError}</p>
                        )}
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="ticket_external_id" className={LABEL_CLASS}>
                            Contract Number *
                        </label>
                        <input
                            id="ticket_external_id"
                            name="external_id"
                            type="text"
                            className={INPUT_CLASS}
                            value={externalId}
                            onChange={(event) => setExternalId(event.target.value)}
                            required
                            maxLength={50}
                            placeholder="Contract number"
                            disabled={formDisabled}
                        />
                    </div>
                </div>

                <div className="portal-intake-form-description">
                    <label htmlFor="ticket_description" className={LABEL_CLASS}>
                        Description
                    </label>
                    <textarea
                        id="ticket_description"
                        name="description"
                        className={`${INPUT_CLASS} portal-intake-form-textarea`}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        maxLength={8000}
                        placeholder="Additional context for processing..."
                        disabled={formDisabled}
                    />
                </div>

                <div className="portal-intake-form-row portal-intake-form-row-stp">
                    <div className="min-w-0">
                        <label htmlFor="ticket_files" className={LABEL_CLASS}>
                            Attachments *
                        </label>
                        <input
                            ref={fileInputRef}
                            id="ticket_files"
                            name="files"
                            type="file"
                            accept={PDF_ACCEPT}
                            className="block w-full text-sm text-rh-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-rh-elevated file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rh-text hover:file:bg-rh-border"
                            multiple
                            required
                            onChange={handleFileChange}
                            disabled={formDisabled}
                        />
                        <p className="mt-2 text-xs text-rh-muted">
                            PDF only. Up to {MAX_FILES} files, {MAX_FILE_SIZE_MB} MB each.
                        </p>
                        {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
                    </div>
                    <div className="flex min-w-0 items-center">
                        <ToggleSwitch
                            id="ticket_stp_flag"
                            name="stp_flag"
                            label="Straight-through processing (STP)"
                            checked={stpFlag}
                            onChange={setStpFlag}
                            disabled={formDisabled}
                        />
                    </div>
                </div>
            </div>

            <div className="portal-intake-form-actions">
                <button type="button" className={BTN_CANCEL} onClick={resetForm} disabled={formDisabled}>
                    Reset
                </button>
                <button type="submit" className={BTN_PRIMARY} disabled={formDisabled}>
                    {submitting ? 'Submitting…' : 'Submit ticket'}
                </button>
            </div>
        </form>
    )
}
