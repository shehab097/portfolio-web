import React from 'react';
import { useContent } from '../lib/content';

export default function Hero() {
    const { content } = useContent();
    const hero = content.hero ?? {};

    return (
        <section className="bg-bg-dark text-bg-light min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-6 py-12 md:py-0">
            <div className="max-w-6xl w-full mx-auto flex flex-col items-start space-y-6">

                {/* Role & Status */}
                <div className="font-instrument text-xl md:text-2xl tracking-wide text-primary-dark">
                    {hero.role}
                </div>

                {/* Name */}
                <h1 className="font-oranienbaum text-5xl sm:text-6xl md:text-8xl tracking-tight text-bg-light leading-none">
                    {hero.name}
                </h1>

                {/* Bio & Current Focus */}
                <div className="max-w-2xl space-y-3 pt-1">
                    <p className="font-instrument text-xl md:text-2xl text-bg-light/90 leading-relaxed">
                        {hero.bio}
                    </p>
                    <p className="font-instrument text-lg md:text-xl text-bg-light/60 italic">
                        {hero.focus}
                    </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 pt-4 font-instrument text-xl tracking-wide">
                    {(hero.links ?? []).map((link, index) => (
                        <React.Fragment key={`${link.label}-${index}`}>
                            {index > 0 && <span className="text-bg-light/30">·</span>}
                            <a
                                href={link.href}
                                target={link.href?.startsWith('#') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="hover:text-primary-dark transition-colors duration-200 underline underline-offset-8 decoration-white/20 hover:decoration-primary-dark"
                            >
                                {link.label}
                            </a>
                        </React.Fragment>
                    ))}
                </div>

            </div>
        </section>
    );
}
