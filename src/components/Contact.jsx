import React from 'react';
import { useContent } from '../lib/content';
import { Icon } from '../lib/icons';

export default function Contact() {
    const { content } = useContent();
    const contact = content.contact ?? {};
    const contactLinks = contact.links ?? [];

    return (
        <section id="contact" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-3 border-b border-white/10 pb-6">
                    <span className="font-instrument text-2xl text-primary-dark tracking-wide">{contact.label}</span>
                    <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                        {contact.heading}
                    </h2>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Description */}
                    <div className="space-y-6">
                        <p className="font-instrument text-2xl md:text-3xl text-bg-light/90 leading-relaxed">
                            {contact.intro}
                        </p>
                        <p className="font-instrument text-lg text-bg-light/60 italic">
                            {contact.note}
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
                                        <Icon name={item.icon} className="w-5 h-5 text-primary-dark" />
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
