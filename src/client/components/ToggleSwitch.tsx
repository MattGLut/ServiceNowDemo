import React from 'react'
import { LABEL_CLASS } from './formStyles'

type ToggleSwitchProps = {
    id: string
    name?: string
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
}

export default function ToggleSwitch({
    id,
    name,
    label,
    checked,
    onChange,
    disabled = false,
}: ToggleSwitchProps) {
    return (
        <label htmlFor={id} className="portal-toggle">
            <input
                id={id}
                name={name}
                type="checkbox"
                role="switch"
                aria-checked={checked}
                className="portal-toggle-input"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                disabled={disabled}
            />
            <span className="portal-toggle-track" aria-hidden="true">
                <span className="portal-toggle-thumb" />
            </span>
            <span className={`${LABEL_CLASS} portal-toggle-label`}>{label}</span>
        </label>
    )
}
