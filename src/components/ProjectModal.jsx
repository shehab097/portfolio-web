import React, { useEffect, useRef, useState } from 'react';
import { projectLinks } from '../lib/projects';
import { fetchRepoReadme, parseRepoRef } from '../lib/github';
import { toYouTubeEmbed } from '../lib/media';
import { Icon } from '../lib/icons';
import Markdown from './Markdown';

const LINK_ICONS = { github: 'github', demo: 'link', extra: 'link' };

const labelClass = 'flex items-center gap-2 font-instrument text-xs uppercase tracking-wider text-bg-light/45';

/**
 * Full project popup.
 *
 * Shows the basics plus every link the project declares (including the extra
 * tagged repositories that stay hidden on the card), and — when the project has
 * a primary GitHub URL — loads and renders that repository's README.
 */
export default function ProjectModal({ project, onClose }) {
    const panelRef = useRef(null);
    const [readme, setReadme] = useState({ status: 'idle' });

    const links = projectLinks(project);
    const repo = parseRepoRef(project.github);
    const githubUrl = String(project.github ?? '').trim();
    const tech = project.tech ?? [];

    /* Escape to close, lock background scrolling, keep focus inside the dialog. */
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [onClose]);

    /* Load the README once per repository. */
    useEffect(() => {
        if (!githubUrl) {
            setReadme({ status: 'none' });
            return undefined;
        }

        const controller = new AbortController();
        setReadme({ status: 'loading' });

        fetchRepoReadme(githubUrl, { signal: controller.signal })
            .then((result) => {
                if (result.status === 'ok' && !String(result.markdown ?? '').trim()) {
                    setReadme({ status: 'missing', message: 'That README is empty.', repo: result.repo });
                    return;
                }
                setReadme(result);
            })
            .catch((error) => {
                if (error?.name === 'AbortError') return;
                setReadme({ status: 'error', message: 'Could not load the README.' });
            });

        return () => controller.abort();
    }, [githubUrl]);

    const readmeFailed = ['missing', 'rate-limited', 'error', 'unsupported'].includes(readme.status);

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg-dark/85 backdrop-blur-sm">
            <div
                className="min-h-full flex items-start justify-center p-4 sm:p-8"
                onClick={(event) => {
                    if (event.target === event.currentTarget) onClose();
                }}
            >
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                    className="modal-panel relative w-full max-w-4xl rounded-2xl border border-white/12 bg-bg-dark shadow-2xl outline-none"
                >
                    {/* ---------- Sticky header ---------- */}
                    <div className="sticky top-0 z-10 flex items-start gap-4 rounded-t-2xl border-b border-white/10 bg-bg-dark/95 px-5 py-5 backdrop-blur sm:px-7">
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                {project.pinned && (
                                    <span className="inline-flex items-center gap-1.5 font-instrument text-xs uppercase tracking-wider px-2.5 py-1 rounded-md border border-primary-dark/50 text-primary-dark">
                                        <Icon name="pin" className="w-3.5 h-3.5" />
                                        Pinned
                                    </span>
                                )}
                                <span className="font-instrument text-xs uppercase tracking-wider text-bg-light/30">
                                    Project
                                </span>
                            </div>

                            <h2
                                id="project-modal-title"
                                className="font-oranienbaum text-2xl leading-tight text-bg-light sm:text-4xl"
                            >
                                {project.title}
                            </h2>

                            {project.subtitle && (
                                <p className="font-instrument text-lg italic text-primary-dark/90">{project.subtitle}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close project"
                            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-bg-light/60 transition-colors hover:border-primary-dark hover:text-primary-dark"
                        >
                            <Icon name="close" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* ---------- Body ---------- */}
                    <div className="space-y-8 px-5 py-6 sm:px-7">
                        {(project.video || project.image) && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                                {project.video ? (
                                    <iframe
                                        src={toYouTubeEmbed(project.video)}
                                        title={project.title}
                                        className="h-full w-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                                )}
                            </div>
                        )}

                        {project.description && (
                            <p className="font-instrument text-lg leading-relaxed text-bg-light/80">
                                {project.description}
                            </p>
                        )}

                        {tech.length > 0 && (
                            <div className="space-y-3">
                                <h3 className={labelClass}>Built with</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tech.map((item, index) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-instrument text-sm text-bg-light/70"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {links.length > 0 && (
                            <div className="space-y-3">
                                <h3 className={labelClass}>
                                    <Icon name="link" className="w-4 h-4" /> Links
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {links.map((link) => (
                                        <a
                                            key={`${link.kind}-${link.label}-${link.url}`}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 font-instrument text-base text-bg-light/80 transition-colors hover:border-primary-dark hover:text-primary-dark"
                                        >
                                            <Icon name={LINK_ICONS[link.kind] ?? 'link'} className="w-4 h-4" />
                                            {link.label}
                                            {link.kind === 'extra' && (
                                                <Icon name="external" className="w-3.5 h-3.5 opacity-40" />
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {githubUrl && (
                            <section className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                                    <h3 className={labelClass}>
                                        <Icon name="file-text" className="w-4 h-4" /> README.md
                                    </h3>
                                    <a
                                        href={repo?.htmlUrl ?? githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-instrument text-sm text-bg-light/60 transition-colors hover:text-primary-dark"
                                    >
                                        View on GitHub <Icon name="external" className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {readme.status === 'loading' && (
                                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                                        {[90, 70, 82].map((width) => (
                                            <span
                                                key={width}
                                                className="block h-3 animate-pulse rounded-full bg-white/10"
                                                style={{ width: `${width}%` }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {readme.status === 'ok' && (
                                    <div className="max-h-[62vh] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                                        <Markdown source={readme.markdown} repoKey={repo?.key} />
                                    </div>
                                )}

                                {readmeFailed && (
                                    <p className="flex items-start gap-2 font-instrument text-base text-amber-200/70">
                                        <Icon name="alert" className="mt-0.5 w-4 h-4 shrink-0" />
                                        <span>{readme.message}</span>
                                    </p>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
