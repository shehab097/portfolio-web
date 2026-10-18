import React from 'react';

export default function NotFound({ path }) {
    return (
        <main className="min-h-screen bg-bg-dark text-bg-light flex items-center justify-center px-6">
            <div className="max-w-lg text-center space-y-5">
                <span className="font-instrument text-xl text-primary-dark tracking-wide">404</span>
                <h1 className="font-oranienbaum text-4xl md:text-5xl tracking-tight">Page not found</h1>
                <p className="font-instrument text-lg text-bg-light/60">
                    Nothing is published at <code className="text-bg-light/80">{path}</code>.
                </p>
                <a
                    href="/"
                    className="inline-block font-instrument text-lg px-6 py-3 rounded-lg border border-white/20 hover:border-primary-dark hover:text-primary-dark transition-colors"
                >
                    Back to the portfolio
                </a>
            </div>
        </main>
    );
}
