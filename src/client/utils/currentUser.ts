declare global {
    interface Window {
        g_user?: {
            userID?: string
            userName?: string
            firstName?: string
            lastName?: string
        }
        NOW?: {
            user_id?: string
            user?: {
                user_id?: string
                userID?: string
            }
        }
    }
}

/** Sys_id of the logged-in user when available on a UI page (after g_user bootstrap). */
export function getCurrentUserSysId(): string | undefined {
    if (window.g_user?.userID) {
        return window.g_user.userID
    }

    const nowUser = window.NOW?.user
    if (nowUser?.user_id) {
        return nowUser.user_id
    }
    if (nowUser?.userID) {
        return nowUser.userID
    }

    return window.NOW?.user_id
}

/** Display name for the logged-in user (for optimistic UI only). */
export function getCurrentUserDisplayName(): string {
    const gUser = window.g_user
    if (!gUser) {
        return ''
    }

    const fullName = [gUser.firstName, gUser.lastName].filter(Boolean).join(' ').trim()
    return fullName || gUser.userName || ''
}
