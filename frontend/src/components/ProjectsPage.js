import React from 'react';
import { Link } from 'react-router-dom';

function ProjectsPage({ data }) {
  if (!data || data.length === 0) return null;

  const visibleProjects = data;

  // Generate a color based on programming language
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'from-yellow-400 to-yellow-600',
      'React': 'from-blue-400 to-blue-600',
      'Python': 'from-blue-500 to-yellow-500',
      'Java': 'from-red-400 to-orange-600',
      'HTML': 'from-orange-400 to-red-600',
      'CSS': 'from-blue-500 to-purple-600',
      'TypeScript': 'from-blue-600 to-blue-800',
      'Node.js': 'from-green-500 to-green-700'
    };
    return colors[language] || 'from-gray-400 to-gray-600';
  };

  return (
    <section id="projects-page" className="bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-500 font-semibold mb-3">
            Work
          </p>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-3">
            GitHub Projects
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-2xl">
            My latest public repositories updated in real-time from GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {visibleProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group relative rounded-lg overflow-hidden bg-black min-h-[200px] md:min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Background gradient based on language */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getLanguageColor(project.language)}`} />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Simplified Content */}
              <div className="absolute inset-0 flex items-end justify-between p-3 md:p-4 text-white z-10">
                <h3 className="text-lg md:text-xl font-black leading-tight max-w-[75%] break-words">
                  {project.title}
                </h3>

                <div className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform hover:bg-gray-100 shrink-0 font-bold text-sm">
                  ↗
                </div>
              </div>

              {/* Hover effect line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
