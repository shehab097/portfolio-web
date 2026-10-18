import React, { useState } from 'react';
import { LINK_TAGS } from '../../lib/projects';
import { GhostButton, IconButton, inputClass, PlusIcon, TrashIcon } from './controls';

/**
 * Editor for a project's extra tagged links (Frontend / Backend / Mobile App …).
 *
 * These stay off the public card and only show up in the project popup, so the
 * grid keeps its shape no matter how many repositories a project spans.
 */
export default function LinksEditor({ value, onChange }) {
    const links = Array.isArray(value) ? value : [];
    /* Unique datalist id per editor instance — several cards can be open at once. */
    const [listId] = useState(() => `project-link-tags-${Math.random().toString(36).slice(2, 8)}`);

    const update = (index, partial) => {
        const next = links.slice();
        next[index] = { ...next[index], ...partial };
        onChange(next);
    };

    const add = () => onChange([...links, { label: '', url: '' }]);
    const remove = (index) => onChange(links.filter((_, i) => i !== index));

    return (
        <div className="space-y-2">
            {links.length === 0 && (
                <p className="font-instrument text-sm text-bg-light/35">
                    No extra links. These are hidden on the card and listed in the popup.
                </p>
            )}

            {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        list={listId}
                        className={`${inputClass} w-32 sm:w-40 shrink-0`}
                        placeholder="Tag"
                        value={link?.label ?? ''}
                        onInput={(event) => update(index, { label: event.currentTarget.value })}
                    />
                    <input
                        className={inputClass}
                        placeholder="https://github.com/…"
                        value={link?.url ?? ''}
                        onInput={(event) => update(index, { url: event.currentTarget.value })}
                    />
                    <IconButton label="Remove link" tone="danger" onClick={() => remove(index)}>
                        <TrashIcon />
                    </IconButton>
                </div>
            ))}

            <datalist id={listId}>
                {LINK_TAGS.map((tag) => (
                    <option key={tag} value={tag} />
                ))}
            </datalist>

            <GhostButton onClick={add}>
                <PlusIcon /> Add link
            </GhostButton>
        </div>
    );
}
