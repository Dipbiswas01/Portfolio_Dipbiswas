import React from 'react';
import { Link, useParams } from 'react-router-dom';

function ProjectDetailPage({ data }) {
  const { projectId } = useParams();

  if (!data || data.length === 0) return null;

  const currentIndex = Math.max(0, data.findIndex((project) => String(project.id) === String(projectId)));
  const project = data[currentIndex] || data[0];
  const previousProject = data[(currentIndex - 1 + data.length) % data.length];
  const nextProject = data[(currentIndex + 1) % data.length];
  const images = project.detailImages && project.detailImages.length > 0
    ? project.detailImages
    : [project.image, project.image, project.image, project.image].filter(Boolean);

  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-10 pb-6 md:pb-8">
        <div className="max-w-2xl">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-orange-500 font-semibold mb-2">
            {project.company}
          </p>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
            {project.title}
          </h1>
          <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[9px] md:text-[10px] font-semibold border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
          {(project.github_url || project.link) && (
            <div className="mt-4">
              <a
                href={project.github_url || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-[10px] md:text-xs font-semibold hover:bg-gray-700 transition-colors"
              >
                Open GitHub Repo <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-10">
        <div className="grid gap-6 md:gap-8">
          <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Project Goals & Vision</h2>
            <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-2xl">
              {project.goal}
            </p>
          </div>

          <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Key Results & Achievements</h2>
            <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-2xl">
              {project.results}
            </p>
          </div>

          <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Project Overview & Development</h2>
            <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-2xl">
              {project.overview}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className={`rounded-[18px] overflow-hidden bg-gray-100 ${index === 1 ? 'md:row-span-2 min-h-[140px] md:min-h-[280px]' : 'min-h-[130px] md:min-h-[180px]'}`}
            >
              <img src={image} alt={`${project.title} ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-10">
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200">
          <Link
            to={`/projects/${previousProject.id}`}
            className="text-[10px] md:text-xs text-gray-900 hover:text-gray-600 transition flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span> Previous
          </Link>
          <Link
            to={`/projects/${nextProject.id}`}
            className="text-[10px] md:text-xs text-gray-900 hover:text-gray-600 transition flex items-center gap-1.5"
          >
            Next project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProjectDetailPage;