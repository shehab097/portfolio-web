import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import About from '../components/About';
import Contact from '../components/Contact';
import { useContent } from '../lib/content';
import { useAuth } from '../lib/auth';

export default function Home() {
    const { content } = useContent();
    const { user, isAdmin } = useAuth();

    return (
        <div className="selection:bg-primary-dark/20 selection:text-primary-dark">
            <Navbar />
            <Hero />
            <Projects />
            <Skills />
            <About />
            <Contact />

            <footer className="bg-bg-dark border-t border-white/10 px-6 py-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-instrument text-sm text-bg-light/40">
                        © {new Date().getFullYear()} {content.hero?.name}
                    </p>
                    <a
                        href={user ? '/admin' : '/login'}
                        className="font-instrument text-sm text-bg-light/40 hover:text-primary-dark transition-colors"
                    >
                        {isAdmin ? 'Admin dashboard' : 'Owner login'}
                    </a>
                </div>
            </footer>
        </div>
    );
}
