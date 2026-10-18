import React, { useEffect, useState } from 'react';
import { useContent } from '../lib/content';
import { orderedProjects } from '../lib/projects';
import { toYouTubeEmbed } from '../lib/media';
import { Icon } from '../lib/icons';

export default function Projects() {
    const { content } = useContent();
    const projectsConfig = content.projects ?? {};
    const allProjects = orderedProjects(projectsConfig.items ?? [], projectsConfig.sortMode ?? 'manual');
    const previewCount = Number(projectsConfig.previewCount) || 3;

    const [showAll, setShowAll] = useState(false);

    // Collapse again if the dataset shrinks while browsing.
    useEffect(() => {
        if (allProjects.length <= previewCount) setShowAll(false);
    }, [allProjects.length, previewCount]);

    // Determine which projects to show based on state
    const visibleProjects = showAll ? allProjects : allProjects.slice(0, previewCount);

    return (
        <section id="projects" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header with Toggle Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
                    <div className="flex flex-col items-start space-y-3">
                        <span className="font-instrument text-2xl text-primary-dark tracking-wide">{projectsConfig.label}</span>
                        <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                            {projectsConfig.heading}
                        </h2>
                    </div>

                    {allProjects.length > previewCount && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="font-instrument text-base md:text-lg px-6 py-2.5 rounded-lg border border-white/20 text-bg-light hover:border-primary-dark hover:text-primary-dark transition-all duration-300 whitespace-nowrap self-start md:self-auto"
                        >
                            {showAll ? 'Show Less' : `See ${allProjects.length - previewCount} More`}
                        </button>
                    )}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProjects.map((project, index) => (
                        <article
                            key={`${project.title}-${index}`}
                            className={`group bg-white/[0.02] border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-primary-dark/50 ${project.pinned ? 'border-primary-dark/40' : 'border-white/10'
                                }`}
                        >
                            <div>
                                {/* Media Container: Renders YouTube video if provided, otherwise renders image */}
                                <div className="relative h-52 w-full overflow-hidden bg-white/5">
                                    {project.video ? (
                                        <iframe
                                            src={toYouTubeEmbed(project.video)}
                                            title={project.title}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : project.image ? (
                                        <>
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-60 pointer-events-none"></div>
                                        </>
                                    ) : null}

                                    {project.pinned && (
                                        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 font-instrument text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-bg-dark/80 border border-primary-dark/50 text-primary-dark backdrop-blur">
                                            <Icon name="pin" className="w-3.5 h-3.5" />
                                            Pinned
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-oranienbaum text-2xl md:text-3xl text-bg-light group-hover:text-primary-dark transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="font-instrument text-lg text-primary-dark/90 italic">
                                            {project.subtitle}
                                        </p>
                                    </div>

                                    <p className="font-instrument text-lg text-bg-light/80 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {(project.tech ?? []).map((t, i) => (
                                            <span
                                                key={i}
                                                className="font-instrument text-xs px-2.5 py-1 rounded-md bg-white/5 text-bg-light/70 border border-white/5"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Links Footer */}
                            {(project.github || project.demo) && (
                                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5 mt-4">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-instrument text-lg text-bg-light/80 hover:text-primary-dark transition-colors underline underline-offset-4 decoration-white/20"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-instrument text-lg text-bg-light/80 hover:text-primary-dark transition-colors underline underline-offset-4 decoration-white/20"
                                        >
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}
