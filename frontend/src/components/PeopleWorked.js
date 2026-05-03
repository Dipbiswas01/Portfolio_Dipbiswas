import React, { useState } from 'react';

function PeopleWorked({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentPerson = data[currentIndex];
  const nextPerson = data[(currentIndex + 1) % data.length];

  return (
    <section id="people-worked" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-[0.35em] text-orange-500 font-bold mb-4">
          People I Worked With
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)] gap-4 items-stretch border-t border-gray-100">
          {/* Main Card */}
          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            <div className="p-5 md:p-6 min-h-[220px] md:min-h-[260px] flex items-center">
              <p className="text-base md:text-lg font-semibold text-gray-700 leading-relaxed max-w-3xl">
                {currentPerson.testimonial}
              </p>
            </div>

            <div className="border-t border-gray-200 p-4 md:p-5 flex items-center gap-3 bg-white">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center text-xl">
                {currentPerson.avatar}
              </div>
              <div>
                <h4 className="text-sm md:text-base font-black text-gray-900">
                  {currentPerson.name}
                </h4>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-500 mt-1">
                  {currentPerson.role}
                </p>
              </div>
            </div>
          </div>

          {/* Preview / Slide Panel */}
          <div className="relative border border-gray-200 rounded-2xl bg-white overflow-hidden min-h-[220px] md:min-h-[260px] flex">
            <div className="flex-1 p-5 md:p-6 opacity-55 flex flex-col justify-between">
              <p className="text-sm md:text-base font-semibold text-gray-600 leading-relaxed max-w-sm">
                {nextPerson.testimonial}
              </p>

              <div className="flex items-center gap-3 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center text-xl">
                  {nextPerson.avatar}
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black text-gray-900">
                    {nextPerson.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-1">
                    {nextPerson.role}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-900 text-gray-900 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5S0 3.75 0 5v12c0 7 4 8 7 8z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-7 3.75-7 5v12c0 7 4 8 7 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PeopleWorked;
