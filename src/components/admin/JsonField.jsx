import React, { useState } from 'react';
import { ICON_NAMES } from '../../lib/icons';

/**
 * Recursive JSON form editor.
 *
 * Because the portfolio is stored as plain JSON, the admin does not need a
 * bespoke form per section: this walks whatever shape the data has and renders
 * inputs for it — objects, arrays, strings, numbers and booleans. New fields
 * and new array items can be added, existing ones removed or reordered.
 */

const humanize = (key) =>
    String(key)
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (char) => char.toUpperCase());

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/** Builds an empty value of the same shape (used by "Add item"). */
const emptyLike = (sample) => {
    if (isPlainObject(sample)) {
        return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, emptyLike(value)]));
    }
    if (Array.isArray(sample)) return [];
    if (typeof sample === 'boolean') return false;
    if (typeof sample === 'number') return 0;
    return '';
};

const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 font-instrument text-base text-bg-light placeholder:text-bg-light/30 focus:outline-none focus:border-primary-dark/60 focus:bg-white/[0.07] transition-colors';

const ghostButtonClass =
    'font-instrument text-xs uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/15 text-bg-light/60 hover:text-primary-dark hover:border-primary-dark/50 transition-colors';

function Row({ children, onRemove, onMoveUp, onMoveDown, className = '' }) {
    return (
        <div className={`flex items-start gap-2 ${className}`}>
            <div className="flex-1 min-w-0">{children}</div>
            <div className="flex items-center gap-1 pt-1.5 shrink-0">
                {onMoveUp && (
                    <button type="button" onClick={onMoveUp} className={ghostButtonClass} title="Move up">
                        ↑
                    </button>
                )}
                {onMoveDown && (
                    <button type="button" onClick={onMoveDown} className={ghostButtonClass} title="Move down">
                        ↓
                    </button>
                )}
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className={`${ghostButtonClass} hover:text-red-400 hover:border-red-400/50`}
                        title="Remove"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

export default function JsonField({ name, value, onChange, onRemove, onMoveUp, onMoveDown, depth = 0 }) {
    const [newKey, setNewKey] = useState('');
    const [addingField, setAddingField] = useState(false);

    const label = typeof name === 'string' ? humanize(name) : `Item ${name}`;

    /* ---------- arrays ---------- */
    if (Array.isArray(value)) {
        const addItem = () => {
            const template = value.length ? emptyLike(value[0]) : '';
            onChange([...value, template]);
        };
        const items = value.map((item, index) => (
            <JsonField
                key={index}
                name={index}
                value={item}
                depth={depth + 1}
                onChange={(next) => {
                    const copy = value.slice();
                    copy[index] = next;
                    onChange(copy);
                }}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
                onMoveUp={
                    index > 0
                        ? () => {
                            const copy = value.slice();
                            [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
                            onChange(copy);
                        }
                        : undefined
                }
                onMoveDown={
                    index < value.length - 1
                        ? () => {
                            const copy = value.slice();
                            [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
                            onChange(copy);
                        }
                        : undefined
                }
            />
        ));

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-instrument text-sm uppercase tracking-wider text-primary-dark">{label}</span>
                    <span className="font-instrument text-xs text-bg-light/35">{value.length} item(s)</span>
                </div>
                <div className="space-y-3 border-l border-white/10 pl-3">{items}</div>
                <button type="button" onClick={addItem} className={ghostButtonClass}>
                    + Add item
                </button>
            </div>
        );
    }

    /* ---------- objects ---------- */
    if (isPlainObject(value)) {
        const entries = Object.entries(value);
        const addField = () => {
            const key = newKey.trim();
            if (!key || key in value) return;
            onChange({ ...value, [key]: '' });
            setNewKey('');
            setAddingField(false);
        };

        return (
            <div className={depth > 0 ? 'space-y-4 rounded-lg border border-white/10 bg-white/[0.015] p-4' : 'space-y-4'}>
                {depth > 0 && (
                    <span className="block font-oranienbaum text-lg text-bg-light">{label}</span>
                )}
                <div className="space-y-4">
                    {entries.map(([key, child]) => (
                        <JsonField
                            key={key}
                            name={key}
                            value={child}
                            depth={depth + 1}
                            onChange={(next) => onChange({ ...value, [key]: next })}
                            onRemove={() => {
                                const copy = { ...value };
                                delete copy[key];
                                onChange(copy);
                            }}
                        />
                    ))}
                </div>
                {addingField ? (
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            autoFocus
                            className={`${inputClass} max-w-[16rem]`}
                            placeholder="new field name"
                            value={newKey}
                            onInput={(event) => setNewKey(event.currentTarget.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    addField();
                                }
                                if (event.key === 'Escape') setAddingField(false);
                            }}
                        />
                        <button type="button" onClick={addField} className={ghostButtonClass}>
                            Add
                        </button>
                        <button type="button" onClick={() => setAddingField(false)} className={ghostButtonClass}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setAddingField(true)} className={ghostButtonClass}>
                        + Add field
                    </button>
                )}
            </div>
        );
    }

    /* ---------- booleans ---------- */
    if (typeof value === 'boolean') {
        return (
            <Row onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                <label className="flex items-center gap-3 py-2 cursor-pointer">
                    <span
                        className={`w-10 h-6 rounded-full border transition-colors relative ${value ? 'bg-primary-dark/30 border-primary-dark' : 'bg-white/5 border-white/15'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-[18px] h-[18px] rounded-full transition-all ${value ? 'left-[18px] bg-primary-dark' : 'left-0.5 bg-bg-light/60'
                                }`}
                        />
                    </span>
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={value}
                        onChange={(event) => onChange(event.currentTarget.checked)}
                    />
                    <span className="font-instrument text-base text-bg-light/80">
                        {label}: <span className="text-primary-dark">{String(value)}</span>
                    </span>
                </label>
            </Row>
        );
    }

    /* ---------- numbers ---------- */
    if (typeof value === 'number') {
        return (
            <Row onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                <label className="block space-y-1.5">
                    <span className="font-instrument text-sm uppercase tracking-wider text-bg-light/50">{label}</span>
                    <input
                        type="number"
                        className={inputClass}
                        value={Number.isFinite(value) ? value : 0}
                        onInput={(event) => onChange(Number(event.currentTarget.value))}
                    />
                </label>
            </Row>
        );
    }

    /* ---------- strings (and null) ---------- */
    const text = value === null || value === undefined ? '' : String(value);
    const isLong = text.length > 70 || text.includes('\n');

    const control =
        name === 'icon' ? (
            <select
                className={inputClass}
                value={text}
                onChange={(event) => onChange(event.currentTarget.value)}
            >
                <option value="">— none —</option>
                {ICON_NAMES.map((iconName) => (
                    <option key={iconName} value={iconName}>
                        {iconName}
                    </option>
                ))}
                {text && !ICON_NAMES.includes(text) && <option value={text}>{text} (unknown)</option>}
            </select>
        ) : isLong ? (
            <textarea
                rows={Math.min(10, Math.max(3, text.split('\n').length + 1))}
                className={`${inputClass} leading-relaxed resize-y`}
                value={text}
                onInput={(event) => onChange(event.currentTarget.value)}
            />
        ) : (
            <input
                className={inputClass}
                value={text}
                placeholder={name === 'href' || name === 'image' || name === 'video' ? 'https://' : ''}
                onInput={(event) => onChange(event.currentTarget.value)}
            />
        );

    return (
        <Row onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
            <label className="block space-y-1.5">
                <span className="font-instrument text-sm uppercase tracking-wider text-bg-light/50">
                    {label}
                    {typeof name === 'string' && name !== label.toLowerCase().replace(/\s+/g, '-') && (
                        <span className="ml-2 normal-case tracking-normal text-bg-light/25">{name}</span>
                    )}
                </span>
                {control}
            </label>
        </Row>
    );
}
