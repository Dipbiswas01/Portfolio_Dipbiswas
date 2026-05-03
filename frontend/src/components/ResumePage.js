import React from 'react';
import { Link } from 'react-router-dom';

function ResumePage() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-semibold mb-3">
            CV & Resume
          </p>
          <h1 className="text-[20px] md:text-[22px] font-black text-gray-900 leading-[0.95] max-w-2xl mb-4">
            Full Resume.
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
            A complete overview of my background, experience, education, and technical expertise.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/resume.pdf"
            download="Biswas_Dip_Resume.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
          >
            <span>↓</span> Download PDF
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
        <div className="rounded-[28px] overflow-hidden border border-gray-200 shadow-[0_20px_60px_rgba(17,17,17,0.12)] bg-gray-50">
          <iframe
            src="/resume.pdf"
            title="Resume PDF"
            className="w-full"
            style={{ height: '800px' }}
            frameBorder="0"
          />
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Tip:</span> You can download the PDF using the button above, or view it fullscreen by clicking inside the embedded viewer.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ResumePage;
