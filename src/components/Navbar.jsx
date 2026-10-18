import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="bg-bg-dark text-bg-light  border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-end">

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
        </div>
      </div>
    </nav>
  );
}