import React from 'react';
import { Link } from 'react-router-dom';

function Projects({ data }) {
  if (!data || data.length === 0) return null;

  const featuredProjects = data;

  // Generate a color based on programming language
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f7df1e',
      'Python': '#3776ab',
      'Java': '#f89820',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'TypeScript': '#2b7a0b',
      'React': '#61dafb'
    };
    return colors[language] || '#999';
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-12">
          Work
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group cursor-pointer border-b border-gray-200 pb-6 hover:border-gray-400 transition-colors duration-200"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-32 mb-4 rounded-lg">
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: getLanguageColor(project.language) }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                <div className="absolute inset-0 flex items-end justify-between p-3 text-gray-900">
                  <h3 className="text-lg font-black leading-tight max-w-[75%] break-words text-white drop-shadow-sm">
                    {project.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 font-bold text-sm">
                    ↗
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* View all projects link */}
        <div className="mt-12 text-center">
          <Link 
            to="/projects"
            className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-200 rounded-lg"
          >
            View All Projects ({data.length})
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Projects;
