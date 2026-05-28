export function formatSubmittedAt(value: string): string {
    if (!value) {
        return '—'
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T')
    const date = new Date(normalized)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

export function formatAttachmentSummary(fileNames: string[]): string | null {
    if (fileNames.length === 0) {
        return null
    }

    if (fileNames.length === 1) {
        return fileNames[0]
    }

    return `${fileNames.length} files`
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
