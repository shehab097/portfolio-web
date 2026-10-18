import React, { useState } from 'react';

/**
 * Chip editor for arrays of plain strings (project tech stacks, tags, …).
 * Type and press Enter or comma to add; Backspace removes the last chip.
 */
export default function TagInput({ value = [], onChange, placeholder = 'Type a tag, press Enter' }) {
    const [draft, setDraft] = useState('');

    const commit = () => {
        const tag = draft.trim().replace(/,$/, '');
        if (!tag) return;
        if (!value.includes(tag)) onChange([...value, tag]);
        setDraft('');
    };

    const onKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            commit();
        } else if (event.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2.5 py-2 focus-within:border-primary-dark/60 transition-colors">
            {value.map((tag, index) => (
                <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-1.5 font-instrument text-sm px-2.5 py-1 rounded-md bg-primary-dark/10 border border-primary-dark/30 text-bg-light/90"
                >
                    {tag}
                    <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() => onChange(value.filter((_, i) => i !== index))}
                        className="text-bg-light/40 hover:text-red-400 transition-colors"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                value={draft}
                onInput={(event) => setDraft(event.currentTarget.value)}
                onKeyDown={onKeyDown}
                onBlur={commit}
                placeholder={value.length ? '' : placeholder}
                className="flex-1 min-w-[8rem] bg-transparent font-instrument text-base text-bg-light placeholder:text-bg-light/25 focus:outline-none py-1"
            />
        </div>
    );
}
