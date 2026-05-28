import React from 'react'

type ProcessingPathBadgeProps = {
    stpFlag: boolean
}

export default function ProcessingPathBadge({ stpFlag }: ProcessingPathBadgeProps) {
    return (
        <span className={stpFlag ? 'portal-path-badge portal-path-badge-stp' : 'portal-path-badge portal-path-badge-di'}>
            {stpFlag ? 'STP' : 'DI'}
        </span>
    )
}
