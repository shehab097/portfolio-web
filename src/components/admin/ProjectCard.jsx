import React from 'react';
import { projectThumbnail } from '../../lib/media';
import { UPLOADS_ENABLED } from '../../lib/storage';
import { ArrowIcon, Caret, CopyIcon, GhostButton, IconButton, inputClass, Labeled, PinIcon, TrashIcon } from './controls';
import { Icon } from '../../lib/icons';
import ImageField from './ImageField';
import TagInput from './TagInput';

/**
 * One project as a collapsible card.
 * Collapsed: thumbnail, title, subtitle, status badges and the quick actions.
 * Expanded: every field, including image upload + thumbnail preview.
 */
export default function ProjectCard({
    project,
    index,
    total,
    expanded,
    onToggle,
    onChange,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    sortingManually,
}) {
    const patch = (partial) => onChange({ ...project, ...partial });
    const thumbnail = projectThumbnail(project);
    const tech = project.tech ?? [];

    return (
        <section
            className={`rounded-xl border transition-colors ${expanded ? 'border-primary-dark/40 bg-white/[0.03]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
        >
            {/* ---------- Collapsed header ---------- */}
            <header className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3">
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={expanded}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                    <span className="text-bg-light/40">
                        <Caret open={expanded} />
                    </span>

                    {/* Thumbnail preview */}
                    <span className="hidden sm:flex w-20 h-12 shrink-0 rounded-md overflow-hidden border border-white/10 bg-white/5 items-center justify-center">
                        {thumbnail ? (
                            <img src={thumbnail.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <Icon name="image" className="w-4 h-4 text-bg-light/25" />
                        )}
                    </span>

                    <span className="min-w-0">
                        <span className="flex items-center gap-2">
                            <span className="font-oranienbaum text-lg md:text-xl text-bg-light truncate">
                                {project.title || 'Untitled project'}
                            </span>
                            {project.pinned && (
                                <span className="inline-flex items-center gap-1 font-instrument text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-primary-dark/50 text-primary-dark">
                                    <PinIcon filled /> Pinned
                                </span>
                            )}
                        </span>
                        <span className="block font-instrument text-sm text-bg-light/45 truncate">
                            {project.subtitle || project.description || 'No description yet'}
                        </span>
                    </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="hidden lg:inline font-instrument text-xs text-bg-light/30 mr-1">
                        #{index + 1} · {tech.length} tech
                    </span>
                    <IconButton
                        label={project.pinned ? 'Unpin project' : 'Pin project to the top'}
                        active={Boolean(project.pinned)}
                        onClick={() => patch({ pinned: !project.pinned })}
                    >
                        <PinIcon filled={Boolean(project.pinned)} />
                    </IconButton>
                    <IconButton label="Move up" disabled={!sortingManually || index === 0} onClick={onMoveUp}>
                        <ArrowIcon direction="up" />
                    </IconButton>
                    <IconButton label="Move down" disabled={!sortingManually || index === total - 1} onClick={onMoveDown}>
                        <ArrowIcon direction="down" />
                    </IconButton>
                    <IconButton label="Duplicate project" onClick={onDuplicate}>
                        <CopyIcon />
                    </IconButton>
                    <IconButton label="Delete project" tone="danger" onClick={onRemove}>
                        <TrashIcon />
                    </IconButton>
                </div>
            </header>

            {/* ---------- Expanded body ---------- */}
            {expanded && (
                <div className="border-t border-white/10 px-4 py-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Labeled label="Title">
                            <input
                                className={inputClass}
                                value={project.title ?? ''}
                                placeholder="Project name"
                                onInput={(event) => patch({ title: event.currentTarget.value })}
                            />
                        </Labeled>
                        <Labeled label="Subtitle">
                            <input
                                className={inputClass}
                                value={project.subtitle ?? ''}
                                placeholder="One-line summary"
                                onInput={(event) => patch({ subtitle: event.currentTarget.value })}
                            />
                        </Labeled>
                    </div>

                    <Labeled label="Description">
                        <textarea
                            rows={3}
                            className={`${inputClass} leading-relaxed resize-y`}
                            value={project.description ?? ''}
                            placeholder="What it does, how it works…"
                            onInput={(event) => patch({ description: event.currentTarget.value })}
                        />
                    </Labeled>

                    <Labeled label="Thumbnail" hint={UPLOADS_ENABLED ? 'upload or link' : 'paste an image URL'}>
                        <ImageField project={project} onImage={(url) => patch({ image: url })} />
                    </Labeled>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Labeled label="YouTube URL" hint="plays instead of the image">
                            <input
                                className={inputClass}
                                value={project.video ?? ''}
                                placeholder="https://youtu.be/…"
                                onInput={(event) => patch({ video: event.currentTarget.value })}
                            />
                        </Labeled>
                        <Labeled label="Tech stack" hint="Enter or comma to add">
                            <TagInput
                                value={tech}
                                onChange={(next) => patch({ tech: next })}
                                placeholder="Python, PyTorch, …"
                            />
                        </Labeled>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Labeled label="GitHub URL">
                            <input
                                className={inputClass}
                                value={project.github ?? ''}
                                placeholder="https://github.com/…"
                                onInput={(event) => patch({ github: event.currentTarget.value })}
                            />
                        </Labeled>
                        <Labeled label="Live demo URL">
                            <input
                                className={inputClass}
                                value={project.demo ?? ''}
                                placeholder="https://…"
                                onInput={(event) => patch({ demo: event.currentTarget.value })}
                            />
                        </Labeled>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
                        <label className="flex items-center gap-3 pt-3 cursor-pointer">
                            <span
                                className={`w-9 h-5 rounded-full border transition-colors relative shrink-0 ${project.pinned ? 'bg-primary-dark/30 border-primary-dark' : 'bg-white/5 border-white/15'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-[14px] h-[14px] rounded-full transition-all ${project.pinned ? 'left-[18px] bg-primary-dark' : 'left-0.5 bg-bg-light/60'
                                        }`}
                                />
                            </span>
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={Boolean(project.pinned)}
                                onChange={(event) => patch({ pinned: event.currentTarget.checked })}
                            />
                            <span className="font-instrument text-base text-bg-light/75">
                                Pinned
                                <span className="ml-2 text-bg-light/35">always shown first on the site</span>
                            </span>
                        </label>

                        <GhostButton className="mt-3 hover:!text-red-400 hover:!border-red-400/50" onClick={onRemove}>
                            <TrashIcon /> Delete project
                        </GhostButton>
                    </div>
                </div>
            )}
        </section>
    );
}
