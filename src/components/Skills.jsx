import React from 'react';

export default function Skills() {
    const skillCategories = [
        {
            category: "Programming",
            skills: [
                { name: "Java", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg> },
                { name: "Python", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.5 2 6 4 6 6v3h6V8h3v3H5c-3 0-3 3-3 3s0 3 3 3h2v-2h4v4H6c-3 0-3 3-3 3s0 3 3 3h7c5.5 0 6-2 6-6v-3h-6v1h-3v-3h10c3 0 3-3 3-3s0-3-3-3h-2v2h-4V2h3z"></path></svg> },
                { name: "C++", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 15.5v9"></path><path d="M5 8h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5V8z"></path></svg> },
                { name: "SQL", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg> },
            ]
        },
        {
            category: "Backend",
            skills: [
                { name: "Spring Boot", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
                { name: "REST APIs", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> },
                { name: "JPA/Hibernate", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
                { name: "Spring Security", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
                { name: "JWT", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg> },
            ]
        },
        {
            category: "Frontend",
            skills: [
                { name: "React", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> },
                { name: "React Native", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
                { name: "HTML", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> },
                { name: "CSS", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l-9.5 3.5 1 14.5L12 22l8.5-2 1-14.5L12 2z"></path></svg> },
                { name: "JavaScript", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16v-3a2 2 0 0 0-2-2h-2"></path><path d="M12 11v6"></path><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path></svg> },
            ]
        },
        {
            category: "Machine Learning",
            skills: [
                { name: "PyTorch", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"></path><path d="M12 12l8-8"></path></svg> },
                { name: "Scikit-learn", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> },
                { name: "Computer Vision", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> },
                { name: "Data Processing", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
            ]
        },
        {
            category: "Database & Tools",
            skills: [
                { name: "MySQL", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg> },
                { name: "PostgreSQL", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> },
                { name: "Firebase", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l-9 16.5L7.5 22 12 15l4.5 7L21 18.5z"></path></svg> },
                { name: "Git", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg> },
                { name: "Linux", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
                { name: "Docker", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M2 16h20M6 8h2M10 8h2M14 8h2M6 4h2M10 4h2"></path></svg> },
            ]
        }
    ];

    return (
        <section id="skills" className="bg-bg-dark text-bg-light py-14 md:py-24 px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-10 md:space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-2 md:space-y-3 border-b border-white/10 pb-4 md:pb-6">
                    <span className="font-instrument text-xl md:text-2xl text-primary-dark tracking-wide">Expertise</span>
                    <h2 className="font-oranienbaum text-3xl md:text-6xl tracking-tight text-bg-light">
                        Skills & Technologies
                    </h2>
                </div>

                {/* Simplified Rows Layout with Icons */}
                <div className="space-y-2 md:space-y-6">
                    {skillCategories.map((group, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start py-4 md:py-6 border-b border-white/5 last:border-b-0"
                        >
                            {/* Category Title */}
                            <h3 className="font-oranienbaum text-xl md:text-2xl text-bg-light md:col-span-1">
                                {group.category}
                            </h3>

                            {/* Skill Tags with Icons */}
                            <div className="flex flex-wrap gap-2 md:gap-2.5 md:col-span-3">
                                {group.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 md:gap-2 font-instrument text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-white/5 text-bg-light/80 border border-white/10 hover:border-primary-dark/50 hover:text-bg-light transition-all duration-200 group"
                                    >
                                        <span className="text-bg-light/60 group-hover:text-primary-dark transition-colors">
                                            {skill.icon}
                                        </span>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}