import React, { useState } from 'react';
import { ArrowIcon, Caret, GhostButton, IconButton, inputClass, Labeled, PlusIcon, TrashIcon } from './controls';
import IconPicker from './IconPicker';
import TagInput from './TagInput';

/**
 * Recursive JSON form editor, tuned for a calm, uncluttered view:
 *   - one collapsible group per nested object/array,
 *   - array items are labelled by their own title when they have one,
 *   - rows reveal their remove / move controls on hover,
 *   - arrays of plain strings become chips,
 *   - `icon` keys become a dropdown of the icon registry.
 *
 * The Projects section has its own card editor (ProjectsEditor); this handles
 * everything else.
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

const truncate = (text, length = 70) => {
    const value = String(text ?? '');
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
};

const swapped = (array, from, to) => {
    const copy = array.slice();
    [copy[from], copy[to]] = [copy[to], copy[from]];
    return copy;
};

function FieldShell({ children, onRemove, onMoveUp, onMoveDown }) {
    return (
        <div className="group/field flex items-start gap-2">
            <div className="flex-1 min-w-0">{children}</div>
            {(onRemove || onMoveUp || onMoveDown) && (
                <div className="flex items-center gap-1 pt-1 opacity-100 md:opacity-0 md:group-hover/field:opacity-100 md:focus-within:opacity-100 transition-opacity">
                    {onMoveUp && (
                        <IconButton label="Move up" onClick={onMoveUp}>
                            <ArrowIcon direction="up" />
                        </IconButton>
                    )}
                    {onMoveDown && (
                        <IconButton label="Move down" onClick={onMoveDown}>
                            <ArrowIcon direction="down" />
                        </IconButton>
                    )}
                    {onRemove && (
                        <IconButton label="Remove" tone="danger" onClick={onRemove}>
                            <TrashIcon />
                        </IconButton>
                    )}
                </div>
            )}
        </div>
    );
}

function Group({ label, meta, actions, children, bordered = true }) {
    const [open, setOpen] = useState(true);

    return (
        <div className={bordered ? 'rounded-lg border border-white/10 bg-white/[0.015] overflow-hidden' : ''}>
            <div className={`flex items-center gap-2 ${bordered ? 'px-3 py-2' : 'py-1'}`}>
                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                    <span className="text-bg-light/40">{<Caret open={open} />}</span>
                    <span className="font-instrument text-sm uppercase tracking-wider text-primary-dark truncate">{label}</span>
                    {meta && !open && <span className="font-instrument text-xs text-bg-light/30 truncate hidden sm:inline">{meta}</span>}
                </button>
                <div className="flex items-center gap-1.5 shrink-0">{actions}</div>
            </div>
            {open && <div className={bordered ? 'px-3 pb-3 pt-1 space-y-4 border-t border-white/10' : 'pl-4 space-y-4'}>{children}</div>}
        </div>
    );
}

export default function JsonField({ name, value, onChange, onRemove, onMoveUp, onMoveDown, depth = 0 }) {
    const [newKey, setNewKey] = useState('');
    const [addingField, setAddingField] = useState(false);

    const isArrayItem = typeof name === 'number';
    const fallbackLabel = isArrayItem ? `Item ${name}` : humanize(name);
    const label = isArrayItem && value?.title ? value.title : fallbackLabel;

    /* ---------- arrays ---------- */
    if (Array.isArray(value)) {
        const stringOnly = value.every((item) => typeof item === 'string' || typeof item === 'number');

        if (stringOnly) {
            return (
                <FieldShell onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                    <Labeled label={label} hint={`${value.length}`}>
                        <TagInput value={value} onChange={onChange} />
                    </Labeled>
                </FieldShell>
            );
        }

        const addItem = () => onChange([...value, value.length ? emptyLike(value[0]) : '']);

        return (
            <Group
                label={label}
                meta={`${value.length} item(s)`}
                actions={
                    <GhostButton onClick={addItem}>
                        <PlusIcon /> Add
                    </GhostButton>
                }
            >
                {value.map((item, index) => (
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
                        onMoveUp={index > 0 ? () => onChange(swapped(value, index, index - 1)) : undefined}
                        onMoveDown={index < value.length - 1 ? () => onChange(swapped(value, index, index + 1)) : undefined}
                    />
                ))}
                {value.length === 0 && (
                    <p className="font-instrument text-sm text-bg-light/35">Nothing here yet — use “Add”.</p>
                )}
            </Group>
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

        const body = (
            <>
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

                {addingField ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            className={`${inputClass} max-w-[14rem]`}
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
                        <GhostButton onClick={addField}>Add</GhostButton>
                        <GhostButton onClick={() => setAddingField(false)}>Cancel</GhostButton>
                    </div>
                ) : (
                    <GhostButton onClick={() => setAddingField(true)}>
                        <PlusIcon /> Field
                    </GhostButton>
                )}
            </>
        );

        // Top-level sections are framed by the admin panel heading already, so
        // they render flat. Nested objects get a collapsible frame; array items
        // stay flat because their parent array already provides the frame.
        if (depth === 0) {
            return <div className="space-y-5">{body}</div>;
        }

        return (
            <FieldShell onRemove={!isArrayItem ? onRemove : undefined} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                {isArrayItem ? (
                    <Group label={label} bordered={false} meta={truncate(value.subtitle || value.description)}>
                        {body}
                    </Group>
                ) : (
                    <Group
                        label={label}
                        meta={`${entries.length} field(s)`}
                        actions={
                            onRemove && (
                                <IconButton label="Remove" tone="danger" onClick={onRemove}>
                                    <TrashIcon />
                                </IconButton>
                            )
                        }
                    >
                        {body}
                    </Group>
                )}
            </FieldShell>
        );
    }

    /* ---------- booleans ---------- */
    if (typeof value === 'boolean') {
        return (
            <FieldShell onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className="flex items-center gap-3 py-1.5 text-left"
                >
                    <span
                        className={`w-9 h-5 rounded-full border transition-colors relative shrink-0 ${value ? 'bg-primary-dark/30 border-primary-dark' : 'bg-white/5 border-white/15'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-[14px] h-[14px] rounded-full transition-all ${value ? 'left-[18px] bg-primary-dark' : 'left-0.5 bg-bg-light/60'
                                }`}
                        />
                    </span>
                    <span className="font-instrument text-base text-bg-light/80">
                        {label}
                        <span className="ml-2 text-bg-light/35">{value ? 'on' : 'off'}</span>
                    </span>
                </button>
            </FieldShell>
        );
    }

    /* ---------- numbers ---------- */
    if (typeof value === 'number') {
        return (
            <FieldShell onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
                <Labeled label={label}>
                    <input
                        type="number"
                        className={inputClass}
                        value={Number.isFinite(value) ? value : 0}
                        onInput={(event) => onChange(Number(event.currentTarget.value))}
                    />
                </Labeled>
            </FieldShell>
        );
    }

    /* ---------- strings (and null) ---------- */
    const text = value === null || value === undefined ? '' : String(value);
    const multiline = text.length > 70 || text.includes('\n');

    const control =
        name === 'icon' ? (
            <IconPicker value={text} onChange={onChange} />
        ) : multiline ? (
            <textarea
                rows={Math.min(8, Math.max(3, text.split('\n').length + 1))}
                className={`${inputClass} leading-relaxed resize-y`}
                value={text}
                onInput={(event) => onChange(event.currentTarget.value)}
            />
        ) : (
            <input
                className={inputClass}
                value={text}
                placeholder={['href', 'image', 'video'].includes(name) ? 'https://' : ''}
                onInput={(event) => onChange(event.currentTarget.value)}
            />
        );

    return (
        <FieldShell onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}>
            <Labeled label={label}>{control}</Labeled>
        </FieldShell>
    );
}
