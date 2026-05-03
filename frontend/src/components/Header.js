import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-gray-900 hover:text-gray-600 transition">
          Dip<span className="text-gray-400">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12">
          <Link to="/projects" className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition">
            Work
          </Link>
          <Link to="/gallery" className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition">
            Gallery
          </Link>
          <Link to="/resume" className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition">
            Resume
          </Link>
          <Link to="/contact" className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition text-left">
              Work
            </Link>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition text-left">
              Gallery
            </Link>
            <Link to="/resume" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition text-left">
              Resume
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-medium transition text-left">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
