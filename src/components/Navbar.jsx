import React, { useState, useEffect } from 'react';
import { useContent } from '../lib/content';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useContent();
  const { user, isAdmin } = useAuth();

  const navLinks = content.navbar?.links ?? [];
  const adminHref = user ? '/admin' : '/login';

  // Prevent background scrolling when the full-screen mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="bg-bg-dark text-bg-light  border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Admin access — quiet by default, loud once signed in */}
        <a
          href={adminHref}
          title={isAdmin ? 'Admin dashboard' : 'Sign in'}
          aria-label={isAdmin ? 'Admin dashboard' : 'Sign in'}
          className="font-instrument text-lg tracking-wide flex items-center gap-2 text-bg-light/40 hover:text-primary-dark transition-colors duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span className={isAdmin ? 'text-primary-dark' : 'hidden sm:inline'}>
            {isAdmin ? 'Admin' : 'Login'}
          </span>
        </a>

        {/* Desktop Navigation Links (Right-Aligned) */}
        <div className="hidden md:flex items-center gap-10 font-instrument text-2xl tracking-wide">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-primary-dark transition-colors duration-200 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-dark transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Animated Mobile Menu Toggle Button (Right-Aligned) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-bg-light focus:outline-none z-50 p-2"
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between relative">
            <span
              className={`w-full h-[2px] bg-bg-light transition-transform duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[9px]' : ''
                }`}
            ></span>
            <span
              className={`w-full h-[2px] bg-bg-light transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''
                }`}
            ></span>
            <span
              className={`w-full h-[2px] bg-bg-light transition-transform duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''
                }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Full-Screen Mobile Menu Overlay with Staggered Animation */}
      <div
        className={`fixed inset-0 bg-bg-dark z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isOpen
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-4'
          }`}
      >
        <div className="flex flex-col items-center space-y-8 text-center">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                transitionDelay: `${isOpen ? index * 75 + 150 : 0}ms`,
              }}
              className={`font-instrument text-6xl italic text-bg-light hover:text-primary-dark transition-all duration-500 transform ${isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href={adminHref}
            onClick={() => setIsOpen(false)}
            style={{ transitionDelay: `${isOpen ? navLinks.length * 75 + 150 : 0}ms` }}
            className={`font-instrument text-2xl tracking-wide text-bg-light/60 hover:text-primary-dark transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            {isAdmin ? 'Admin Dashboard' : 'Login'}
          </a>
        </div>
      </div>
    </nav>
  );
}
