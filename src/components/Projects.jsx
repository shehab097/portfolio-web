import React, { useState } from 'react';

export default function Projects() {
    const [showAll, setShowAll] = useState(false);

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

    const projects = [
        {
            title: "StrayCat",
            subtitle: "Road Surface Detection System",
            description: "A computer-vision system designed to detect road damage such as potholes, cracks, and puddles from images captured using a mobile device.",
            tech: ["Python", "PyTorch", "Computer Vision", "Android", "REST API"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
            video: "https://youtu.be/FtutLA63Cp8?si=Zwzbm6FjotzCa5T0"
        },
        {
            title: "University Department Management System",
            subtitle: "Academic Management Platform",
            description: "A web and mobile platform for managing students, teachers, courses, attendance, and academic information securely.",
            tech: ["Java", "Spring Boot", "React", "React Native", "MySQL", "JWT"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
            video: ""
        },
        {
            title: "Personal Portfolio",
            subtitle: "Dynamic Portfolio & Admin Dashboard",
            description: "A dynamic portfolio with an admin dashboard for managing projects, skills, and other content seamlessly.",
            tech: ["React", "Firebase"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "",
            video: "https://youtu.be/dQw4w9WgXcQ"
        },
        {
            title: "Project Alpha",
            subtitle: "Utility Tool",
            description: "Short one-line description for secondary project alpha focusing on high-speed data parsing.",
            tech: ["JavaScript", "Tailwind", "Node.js"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Project Beta",
            subtitle: "CLI Utility",
            description: "Short one-line description for secondary project beta automating deployment routines.",
            tech: ["Python", "Bash"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Project Gamma",
            subtitle: "Automation Script",
            description: "Short one-line description for secondary project gamma handling multi-source feeds.",
            tech: ["TypeScript", "Express"],
            github: "https://github.com",
            demo: "https://example.com",
            image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80",
        },
    ];

    // Determine which projects to show based on state
    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    return (
        <section id="projects" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header with Toggle Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
                    <div className="flex flex-col items-start space-y-3">
                        <span className="font-instrument text-2xl text-primary-dark tracking-wide">Selected Works</span>
                        <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                            Featured Projects
                        </h2>
                    </div>

                    {projects.length > 3 && (
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
                            key={index}
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
                                        {project.tech.map((t, i) => (
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
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}