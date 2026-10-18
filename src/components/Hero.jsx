import React from 'react';

export default function Hero() {
    return (
        <section className="bg-bg-dark text-bg-light min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-6 py-12 md:py-0">
            <div className="max-w-6xl w-full mx-auto flex flex-col items-start space-y-6">

                {/* Role & Status */}
                <div className="font-instrument text-xl md:text-2xl tracking-wide text-primary-dark">
                    Software Developer & CSE Student
                </div>

                {/* Name */}
                <h1 className="font-oranienbaum text-5xl sm:text-6xl md:text-8xl tracking-tight text-bg-light leading-none">
                    Shehab Sarder
                </h1>

                {/* Bio & Current Focus */}
                <div className="max-w-2xl space-y-3 pt-1">
                    <p className="font-instrument text-xl md:text-2xl text-bg-light/90 leading-relaxed">
                        I build practical software with a focus on backend development, web applications, and machine learning.
                    </p>
                    <p className="font-instrument text-lg md:text-xl text-bg-light/60 italic">
                        Currently exploring Java, Spring Boot, React, and PyTorch.
                    </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 pt-4 font-instrument text-xl tracking-wide">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-dark transition-colors duration-200 underline underline-offset-8 decoration-white/20 hover:decoration-primary-dark"
                    >
                        GitHub
                    </a>
                    <span className="text-bg-light/30">·</span>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-dark transition-colors duration-200 underline underline-offset-8 decoration-white/20 hover:decoration-primary-dark"
                    >
                        LinkedIn
                    </a>
                    <span className="text-bg-light/30">·</span>
                    <a
                        href="#resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-dark transition-colors duration-200 underline underline-offset-8 decoration-white/20 hover:decoration-primary-dark"
                    >
                        Résumé
                    </a>
                </div>

            </div>
        </section>
    );
}