import React from 'react';

function Skills({ data }) {
  if (!data) return null;

  return (
    <section id="skills" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-12">
          Skills
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((skill, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-black text-gray-900 mb-2">
                {skill.category}
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                {skill.level}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
