import React from 'react';

export default function Contact() {
    const contactLinks = [
        {
            label: "Email",
            value: "hello@example.com",
            href: "mailto:hello@example.com",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            )
        },
        {
            label: "GitHub",
            value: "github.com/username",
            href: "https://github.com",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
            )
        },
        {
            label: "LinkedIn",
            value: "linkedin.com/in/username",
            href: "https://linkedin.com",
            icon: (
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
            )
        }
    ];

    return (
        <section id="contact" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-3 border-b border-white/10 pb-6">
                    <span className="font-instrument text-2xl text-primary-dark tracking-wide">Get in Touch</span>
                    <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                        Contact
                    </h2>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Description */}
                    <div className="space-y-6">
                        <p className="font-instrument text-2xl md:text-3xl text-bg-light/90 leading-relaxed">
                            I&apos;m open to interesting projects, collaborations, internships, and software-development opportunities.
                        </p>
                        <p className="font-instrument text-lg text-bg-light/60 italic">
                            Feel free to reach out through any of the channels listed. I look forward to connecting with you.
                        </p>
                    </div>

                    {/* Right Column: Contact Cards */}
                    <div className="space-y-4">
                        {contactLinks.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white/[0.02] border border-white/10 rounded-xl p-6 flex items-center justify-between transition-all duration-300 hover:border-primary-dark/50 hover:bg-white/[0.04]"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <span className="font-instrument text-sm text-bg-light/55 block tracking-wide">
                                            {item.label}
                                        </span>
                                        <span className="font-instrument text-xl text-bg-light group-hover:text-primary-dark transition-colors">
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-bg-light/40 group-hover:text-primary-dark group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}