import React from 'react';

export default function About() {
    const learningAreas = [
        {
            title: "Backend Development",
            description: "Building deeper knowledge of Java, Spring Boot, databases, security, and scalable APIs.",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
            )
        },
        {
            title: "Machine Learning",
            description: "Working with PyTorch and developing practical computer-vision projects.",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            )
        },
        {
            title: "Systems",
            description: "Exploring Linux, computer architecture, networking, and lower-level programming.",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="15" x2="23" y2="15"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="15" x2="4" y2="15"></line>
                </svg>
            )
        }
    ];

    return (
        <section id="about" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-3 border-b border-white/10 pb-6">
                    <span className="font-instrument text-2xl text-primary-dark tracking-wide">Background</span>
                    <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                        About Me
                    </h2>
                </div>

                {/* Simplified Content Rows */}
                <div className="space-y-12">

                    {/* Education Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start py-8 border-b border-white/5">
                        <h3 className="font-oranienbaum text-2xl text-bg-light md:col-span-1">
                            Education
                        </h3>
                        <div className="md:col-span-3 space-y-3">
                            <h4 className="font-oranienbaum text-2xl md:text-3xl text-bg-light">
                                Bachelor of Science in Computer Science & Engineering
                            </h4>
                            <p className="font-instrument text-xl text-primary-dark">
                                National Institute of Textile Engineering and Research (NITER)
                            </p>
                            <p className="font-instrument text-base text-bg-light/70">
                                Currently pursuing undergraduate studies in Computer Science & Engineering.
                            </p>
                        </div>
                    </div>

                    {/* Focus & Growth Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start py-8">
                        <h3 className="font-oranienbaum text-2xl text-bg-light md:col-span-1">
                            Focus & Growth
                        </h3>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {learningAreas.map((area, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center">
                                        {area.icon}
                                    </div>
                                    <h4 className="font-oranienbaum text-xl text-bg-light">
                                        {area.title}
                                    </h4>
                                    <p className="font-instrument text-sm text-bg-light/70 leading-relaxed">
                                        {area.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}