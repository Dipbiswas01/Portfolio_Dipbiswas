import React from 'react';

function Achievements({ data }) {
  if (!data) return null;

  return (
    <section id="achievements" className="py-4 md:py-5 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-3 md:mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Achievements
          </h2>
        </div>

        <div className="grid gap-2 md:gap-3">
          {data.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center justify-between gap-3 border-b border-gray-200 pb-2 md:pb-3"
            >
              <h3 className="text-sm md:text-base font-semibold text-gray-800">
                {achievement.title}
              </h3>
              <span className="text-xs md:text-sm font-medium text-gray-500 flex-shrink-0">
                {achievement.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
