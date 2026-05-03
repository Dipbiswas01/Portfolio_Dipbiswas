import React from 'react';

function Toolbox({ data }) {
  const toolbox = data && data.length > 0 && data.some((tool) => tool.image)
    ? data
    : [
        { id: 1, name: 'Figma', image: '/Figma.png' },
        { id: 2, name: 'VS Code', image: '/VSCode.png' },
        { id: 3, name: 'ChatGPT', image: '/Chatgpt.png' },
        { id: 4, name: 'Photoshop', image: '/Photoshop.png' },
        { id: 5, name: 'Canva', image: '/Canva.png' },
        { id: 6, name: 'IntelliJ', image: '/IntelliJ_IDEA.png' },
        { id: 7, name: 'MongoDB', image: '/MongoDB.png' }
      ];

  return (
    <section id="toolbox" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
          Working System
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {toolbox.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-center group cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              {/* Tool Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-900">{tool.icon}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Toolbox;
