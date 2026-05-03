import React from 'react';

function Experience({ data }) {
  if (!data) return null;

  return (
    <section id="experience" className="py-6 md:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-[0.35em] text-orange-500 font-semibold mb-3">
          Experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-gray-200">
          {data.map((exp, index) => (
            <article
              key={exp.id}
              className="min-h-[220px] border-r border-b border-gray-200 p-4 md:p-5 hover:bg-gray-50 transition-colors duration-200"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-4">
                {String(index + 1).padStart(2, '0')}
              </p>

              <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                {exp.position}
              </h3>

              <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-1">
                {exp.company}
              </p>

              <p className="text-sm text-gray-500 mb-3">{exp.period}</p>

              <p className="text-sm text-gray-600 leading-relaxed">
                {exp.description?.[0]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
