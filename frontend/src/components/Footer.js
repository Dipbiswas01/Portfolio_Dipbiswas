import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          © {currentYear} Dip Biswas. All rights reserved.
        </p>
        <p className="text-sm text-gray-600">
          Designed & Built with <span className="text-red-500">❤</span> by Dip Biswas
        </p>
      </div>
    </footer>
  );
}

export default Footer;
