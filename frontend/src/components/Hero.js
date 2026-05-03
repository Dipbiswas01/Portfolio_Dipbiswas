import React from 'react';

function Hero({ data }) {
  if (!data) return null;

  return (
    <section id="hero" className="bg-white py-6 md:py-8 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-3 md:space-y-4">
            {/* Label */}
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
              Profile / Resume
            </p>

            {/* Name */}
            <h1 className="text-[20px] md:text-[22px] font-black text-gray-900 leading-tight">
              {data.name}
            </h1>

            {/* Main Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-md text-justify">
              {data.title} exploring technology, design, and innovation through thoughtful work and experimentation.
            </p>

            {/* Long Description */}
            <p className="text-base text-gray-500 leading-relaxed max-w-md text-justify">
              {data.about}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a 
                href={data.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                LinkedIn
              </a>
              <a 
                href={`mailto:${data.email}`}
                className="text-sm uppercase tracking-widest text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                Email
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image & Info */}
          <div className="space-y-3 md:space-y-4">
            {/* Profile Image */}
            <div className="rounded-2xl overflow-hidden h-64 md:h-72 w-full max-w-xs mx-auto md:mx-0">
              <img 
                src="/profile.jpeg" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Cards */}
            <div className="space-y-2 md:space-y-3">
              <div className="border-t border-gray-200 pt-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
                  Title
                </p>
                <p className="text-base text-gray-900 font-medium">
                  Engineer & Full Stack Developer
                </p>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
                  Location
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {data.location}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
                  Contact
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {data.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
