import React from 'react';

function About({ data }) {
  if (!data) return null;

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-8">
          About
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-4">Overview</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              {data.about}
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-3">
              Location
            </h3>
            <p className="text-base text-gray-900 font-medium">{data.location}</p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-3">
              Email
            </h3>
            <a href={`mailto:${data.email}`} className="text-base text-gray-900 font-medium hover:text-gray-600 transition">
              {data.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
