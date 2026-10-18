import React from 'react';
import { useContent } from '../lib/content';
import { Icon } from '../lib/icons';

export default function About() {
    const { content } = useContent();
    const about = content.about ?? {};
    const sections = about.sections ?? [];

    return (
        <section id="about" className="bg-bg-dark text-bg-light py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-3 border-b border-white/10 pb-6">
                    <span className="font-instrument text-2xl text-primary-dark tracking-wide">{about.label}</span>
                    <h2 className="font-oranienbaum text-4xl md:text-6xl tracking-tight text-bg-light">
                        {about.heading}
                    </h2>
                </div>

                {/* Content Rows */}
                <div className="space-y-12">
                    {sections.map((section, sectionIndex) => (
                        <div
                            key={`${section.title}-${sectionIndex}`}
                            className={`grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start py-8 ${sectionIndex < sections.length - 1 ? 'border-b border-white/5' : ''
                                }`}
                        >
                            <h3 className="font-oranienbaum text-2xl text-bg-light md:col-span-1">
                                {section.title}
                            </h3>

                            {section.layout === 'cards' ? (
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(section.items ?? []).map((item, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center">
                                                <Icon name={item.icon} className="w-5 h-5 text-primary-dark" />
                                            </div>
                                            <h4 className="font-oranienbaum text-xl text-bg-light">
                                                {item.title}
                                            </h4>
                                            <p className="font-instrument text-sm text-bg-light/70 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="md:col-span-3 space-y-3">
                                    {(section.items ?? []).map((item, index) => (
                                        <div key={index} className="space-y-3">
                                            <h4 className="font-oranienbaum text-2xl md:text-3xl text-bg-light">
                                                {item.title}
                                            </h4>
                                            {item.subtitle && (
                                                <p className="font-instrument text-xl text-primary-dark">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="font-instrument text-base text-bg-light/70">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
