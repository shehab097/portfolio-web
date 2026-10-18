import React from 'react';

/** Shared look-and-feel pieces for the admin editors. */

export const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 font-instrument text-base text-bg-light placeholder:text-bg-light/25 focus:outline-none focus:border-primary-dark/60 focus:bg-white/[0.07] transition-colors';

export const ghostClass =
    'inline-flex items-center gap-1.5 font-instrument text-xs uppercase tracking-wider px-2.5 py-1.5 rounded-md border border-white/15 text-bg-light/60 hover:text-primary-dark hover:border-primary-dark/50 transition-colors disabled:opacity-40 disabled:hover:text-bg-light/60 disabled:hover:border-white/15';

export function GhostButton({ children, className = '', ...rest }) {
    return (
        <button type="button" className={`${ghostClass} ${className}`} {...rest}>
            {children}
        </button>
    );
}

export function GhostLabel({ children, className = '', ...rest }) {
    return (
        <label className={`${ghostClass} cursor-pointer ${className}`} {...rest}>
            {children}
        </label>
    );
}

export function IconButton({ label, tone = 'default', active = false, className = '', children, ...rest }) {
    const tones = {
        default: 'border-white/10 text-bg-light/35 hover:text-primary-dark hover:border-primary-dark/50',
        danger: 'border-white/10 text-bg-light/35 hover:text-red-400 hover:border-red-400/50',
        accent: 'border-primary-dark/50 bg-primary-dark/10 text-primary-dark',
    };
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            className={`w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-md border transition-colors disabled:opacity-30 disabled:hover:text-bg-light/35 ${active ? tones.accent : tones[tone]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}

export function Labeled({ label, hint, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="flex items-baseline gap-2">
                <span className="font-instrument text-xs uppercase tracking-wider text-bg-light/45">{label}</span>
                {hint && <span className="font-instrument text-xs text-bg-light/25">{hint}</span>}
            </span>
            {children}
        </label>
    );
}

export function Caret({ open }) {
    return (
        <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export const PinIcon = ({ filled = false }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17v5" />
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
);

export const TrashIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

export const CopyIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export const ArrowIcon = ({ direction = 'up' }) => (
    <svg
        className={`w-4 h-4 ${direction === 'down' ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
    </svg>
);

export const PlusIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
