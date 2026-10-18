import React, { useEffect, useRef, useState } from 'react';
import { ICON_NAMES, Icon } from '../../lib/icons';
import { Caret, inputClass } from './controls';

/**
 * Visual icon chooser — shows the actual glyphs instead of a list of names.
 * Used by the generic editor for every `icon` field (skills, about, contact).
 */
export default function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
            if (!wrapperRef.current?.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const filtered = ICON_NAMES.filter((name) => name.includes(query.trim().toLowerCase()));

    const pick = (name) => {
        onChange(name);
        setOpen(false);
        setQuery('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={`${inputClass} flex items-center gap-3 text-left`}
            >
                <span className="w-5 h-5 shrink-0 flex items-center justify-center text-primary-dark">
                    {value ? <Icon name={value} className="w-4 h-4" /> : null}
                </span>
                <span className={`flex-1 truncate ${value ? '' : 'text-bg-light/30'}`}>{value || '— none —'}</span>
                <span className="text-bg-light/40">
                    <Caret open={open} />
                </span>
            </button>

            {open && (
                <div className="absolute z-30 mt-2 w-full rounded-lg border border-white/15 bg-bg-dark/98 backdrop-blur p-3 space-y-3 shadow-2xl">
                    <input
                        autoFocus
                        className={`${inputClass} py-1.5`}
                        placeholder="Search icons…"
                        value={query}
                        onInput={(event) => setQuery(event.currentTarget.value)}
                    />

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-56 overflow-y-auto">
                        <button
                            type="button"
                            title="None"
                            onClick={() => pick('')}
                            className="aspect-square rounded-md border border-dashed border-white/15 text-bg-light/30 hover:text-primary-dark hover:border-primary-dark/50 transition-colors font-instrument text-xs"
                        >
                            —
                        </button>
                        {filtered.map((name) => (
                            <button
                                key={name}
                                type="button"
                                title={name}
                                onClick={() => pick(name)}
                                className={`aspect-square rounded-md border flex items-center justify-center transition-colors ${value === name
                                    ? 'border-primary-dark bg-primary-dark/10 text-primary-dark'
                                    : 'border-white/10 text-bg-light/60 hover:text-primary-dark hover:border-primary-dark/50'
                                    }`}
                            >
                                <Icon name={name} className="w-5 h-5 text-primary-dark" />
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className="col-span-full font-instrument text-sm text-bg-light/40 py-2">
                                No icon matches “{query}”.
                            </p>
                        )}
                    </div>

                    <p className="font-instrument text-xs text-bg-light/30">
                        {ICON_NAMES.length} icons · a neutral dot is shown if a name is unknown
                    </p>
                </div>
            )}
        </div>
    );
}
