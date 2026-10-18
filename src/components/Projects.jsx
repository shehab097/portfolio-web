import React, { useEffect, useState } from 'react';
import { useContent } from '../lib/content';

export default function Projects() {
    const { content } = useContent();
    const projectsConfig = content.projects ?? {};
    const projects = projectsConfig.items ?? [];
    const previewCount = Number(projectsConfig.previewCount) || 3;

    const [showAll, setShowAll] = useState(false);

    // Collapse again if the dataset shrinks while browsing.
    useEffect(() => {
        if (projects.length <= previewCount) setShowAll(false);
    }, [projects.length, previewCount]);

    // Helper function to convert various YouTube URL formats into clean embed links
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    // Determine which projects to show based on state
    const visibleProjects = showAll ? projects : projects.slice(0, previewCount);

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

                    {projects.length > previewCount && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="font-instrument text-base md:text-lg px-6 py-2.5 rounded-lg border border-white/20 text-bg-light hover:border-primary-dark hover:text-primary-dark transition-all duration-300 whitespace-nowrap self-start md:self-auto"
                        >
                            {showAll ? 'Show Less' : 'See More Projects'}
                        </button>
                    )}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProjects.map((project, index) => (
                        <div
                            key={`${project.title}-${index}`}
                            className="group bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-primary-dark/50"
                        >
                            <div>
                                {/* Media Container: Renders YouTube video if provided, otherwise renders image */}
                                <div className="relative h-52 w-full overflow-hidden bg-white/5">
                                    {project.video ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(project.video)}
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
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
