import React from 'react';
import { useContent } from '../lib/content';
import { Icon } from '../lib/icons';

export default function Skills() {
    const { content } = useContent();
    const skillsConfig = content.skills ?? {};
    const skillCategories = skillsConfig.categories ?? [];

    return (
        <section id="skills" className="bg-bg-dark text-bg-light py-14 md:py-24 px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-10 md:space-y-16">

                {/* Section Header */}
                <div className="flex flex-col items-start space-y-2 md:space-y-3 border-b border-white/10 pb-4 md:pb-6">
                    <span className="font-instrument text-xl md:text-2xl text-primary-dark tracking-wide">{skillsConfig.label}</span>
                    <h2 className="font-oranienbaum text-3xl md:text-6xl tracking-tight text-bg-light">
                        {skillsConfig.heading}
                    </h2>
                </div>

                {/* Simplified Rows Layout with Icons */}
                <div className="space-y-2 md:space-y-6">
                    {skillCategories.map((group, index) => (
                        <div
                            key={`${group.category}-${index}`}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start py-4 md:py-6 border-b border-white/5 last:border-b-0"
                        >
                            {/* Category Title */}
                            <h3 className="font-oranienbaum text-xl md:text-2xl text-bg-light md:col-span-1">
                                {group.category}
                            </h3>

                            {/* Skill Tags with Icons */}
                            <div className="flex flex-wrap gap-2 md:gap-2.5 md:col-span-3">
                                {(group.skills ?? []).map((skill, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 md:gap-2 font-instrument text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5 rounded-md bg-white/5 text-bg-light/80 border border-white/10 hover:border-primary-dark/50 hover:text-bg-light transition-all duration-200 group"
                                    >
                                        <span className="text-bg-light/60 group-hover:text-primary-dark transition-colors">
                                            <Icon name={skill.icon} className="w-4 h-4" />
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
