const STORAGE_KEY = 'x_2058901_demo_pending_submit_success'

/** Visible + fade duration; keep row highlight in sync with the toast. */
export const SUBMIT_SUCCESS_TOAST_VISIBLE_MS = 4500
export const SUBMIT_SUCCESS_TOAST_FADE_MS = 400
export const SUBMIT_SUCCESS_TOAST_TOTAL_MS =
    SUBMIT_SUCCESS_TOAST_VISIBLE_MS + SUBMIT_SUCCESS_TOAST_FADE_MS

export type PendingSubmitSuccessToast = {
    sysId: string
    title: string
    attachmentCount: number
}

export function savePendingSubmitSuccessToast(data: PendingSubmitSuccessToast): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function consumePendingSubmitSuccessToast(): PendingSubmitSuccessToast | null {
    const raw = sessionStorage.getItem(STORAGE_KEY)

    if (!raw) {
        return null
    }

    sessionStorage.removeItem(STORAGE_KEY)

    try {
        const parsed = JSON.parse(raw) as PendingSubmitSuccessToast

        if (
            typeof parsed.sysId === 'string' &&
            typeof parsed.title === 'string' &&
            typeof parsed.attachmentCount === 'number'
        ) {
            return parsed
        }
    } catch {
        // ignore invalid stored payload
    }

    return null
}
