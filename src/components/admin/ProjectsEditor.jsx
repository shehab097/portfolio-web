import React, { useState } from 'react';
import { countPinned, createEmptyProject, PROJECT_SORT_MODES } from '../../lib/projects';
import { GhostButton, inputClass, Labeled, PlusIcon } from './controls';
import ProjectCard from './ProjectCard';

/**
 * Card view for the Projects section.
 * - add / duplicate / delete cards
 * - expand + collapse each card
 * - pin cards to the top of the site
 * - reorder manually or let the site sort them by title
 */
export default function ProjectsEditor({ value, onChange }) {
    const projects = value.items ?? [];
    const sortMode = value.sortMode ?? 'manual';
    const sortingManually = sortMode === 'manual';
    const [openIndexes, setOpenIndexes] = useState([]);

    const patch = (partial) => onChange({ ...value, ...partial });

    const updateItem = (index, next) => {
        const items = projects.slice();
        items[index] = next;
        patch({ items });
    };

    const addProject = () => {
        const items = [...projects, createEmptyProject()];
        patch({ items });
        setOpenIndexes((current) => [...current, items.length - 1]);
    };

    const duplicate = (index) => {
        const items = projects.slice();
        items.splice(index + 1, 0, { ...projects[index], title: `${projects[index].title || 'Project'} copy` });
        patch({ items });
        setOpenIndexes((current) => [...current, index + 1]);
    };

    const remove = (index) => {
        patch({ items: projects.filter((_, i) => i !== index) });
        setOpenIndexes((current) =>
            current.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
        );
    };

    const move = (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= projects.length) return;
        const items = projects.slice();
        [items[index], items[target]] = [items[target], items[index]];
        patch({ items });
        setOpenIndexes((current) =>
            current.map((i) => (i === index ? target : i === target ? index : i)),
        );
    };

    const toggle = (index) =>
        setOpenIndexes((current) =>
            current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
        );

    const pinnedCount = countPinned(projects);

    return (
        <div className="space-y-6">
            {/* ---------- Section settings ---------- */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Labeled label="Small label">
                    <input
                        className={inputClass}
                        value={value.label ?? ''}
                        onInput={(event) => patch({ label: event.currentTarget.value })}
                    />
                </Labeled>
                <Labeled label="Heading">
                    <input
                        className={inputClass}
                        value={value.heading ?? ''}
                        onInput={(event) => patch({ heading: event.currentTarget.value })}
                    />
                </Labeled>
                <Labeled label="Cards before “See more”" hint="preview">
                    <input
                        type="number"
                        min="1"
                        className={inputClass}
                        value={value.previewCount ?? 3}
                        onInput={(event) => patch({ previewCount: Number(event.currentTarget.value) })}
                    />
                </Labeled>
            </div>

            {/* ---------- Toolbar ---------- */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2">
                        <span className="font-instrument text-xs uppercase tracking-wider text-bg-light/45 whitespace-nowrap">
                            Sort by
                        </span>
                        <select
                            className={`${inputClass} w-auto py-1.5`}
                            value={sortMode}
                            onChange={(event) => patch({ sortMode: event.currentTarget.value })}
                        >
                            {PROJECT_SORT_MODES.map((mode) => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <span className="font-instrument text-sm text-bg-light/40">
                        {projects.length} project{projects.length === 1 ? '' : 's'}
                        {pinnedCount > 0 && ` · ${pinnedCount} pinned`}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {openIndexes.length > 1 && (
                        <GhostButton onClick={() => setOpenIndexes([])}>Collapse all</GhostButton>
                    )}
                    <button
                        type="button"
                        onClick={addProject}
                        className="inline-flex items-center gap-1.5 font-instrument text-sm px-3.5 py-2 rounded-lg border border-primary-dark/60 bg-primary-dark/10 text-primary-dark hover:bg-primary-dark/20 transition-colors"
                    >
                        <PlusIcon /> Add project
                    </button>
                </div>
            </div>

            {!sortingManually && (
                <p className="font-instrument text-sm text-amber-200/70">
                    Card order is handled automatically by “{PROJECT_SORT_MODES.find((m) => m.value === sortMode)?.label}”.
                    Switch to <span className="text-bg-light/80">Manual order</span> to arrange cards with the arrows.
                </p>
            )}

            {/* ---------- Cards ---------- */}
            <div className="space-y-3">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        project={project}
                        index={index}
                        total={projects.length}
                        expanded={openIndexes.includes(index)}
                        sortingManually={sortingManually}
                        onToggle={() => toggle(index)}
                        onChange={(next) => updateItem(index, next)}
                        onRemove={() => remove(index)}
                        onDuplicate={() => duplicate(index)}
                        onMoveUp={() => move(index, -1)}
                        onMoveDown={() => move(index, 1)}
                    />
                ))}

                {projects.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/15 p-10 text-center space-y-3">
                        <p className="font-instrument text-lg text-bg-light/60">No projects yet.</p>
                        <button
                            type="button"
                            onClick={addProject}
                            className="inline-flex items-center gap-1.5 font-instrument text-sm px-4 py-2 rounded-lg border border-primary-dark/60 bg-primary-dark/10 text-primary-dark hover:bg-primary-dark/20 transition-colors"
                        >
                            <PlusIcon /> Add your first project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
