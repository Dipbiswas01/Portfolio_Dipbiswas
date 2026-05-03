import React from 'react';

function Education({ data }) {
  if (!data) return null;

  return (
    <section id="education" className="py-6 md:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
          Formation
        </p>

        <div className="space-y-6">
          {data.map((edu) => (
            <div key={edu.id} className="border-b border-gray-200 pb-6 last:border-0 flex gap-4">
              {/* Icon or Image */}
              {(edu.image || edu.institution === 'Chandigarh University' || edu.institution === 'Kumarkhatri Govt. College, Kushia') ? (
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={edu.image || (edu.institution === 'Chandigarh University' ? '/chandigarh-university.png' : '/images.png')}
                    alt={edu.institution}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : edu.icon ? (
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-2xl">
                  {edu.icon}
                </div>
              ) : null}
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  {edu.institution}
                </h3>
                <p className="text-base text-gray-600 mb-1">
                  {edu.degree}
                </p>
                <p className="text-sm text-gray-500 mb-3">{edu.period}</p>
                {edu.details && <p className="text-sm text-gray-600 leading-relaxed">+ {edu.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
