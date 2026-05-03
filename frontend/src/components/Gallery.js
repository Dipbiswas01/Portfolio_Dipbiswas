import React, { useState } from 'react';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const publicBase = process.env.PUBLIC_URL ? process.env.PUBLIC_URL.replace(/\/$/, '') : '';
  const galleryImage = (fileName) => `${publicBase}/gallery/${encodeURIComponent(fileName)}`;

  const galleryImages = [
    {
      id: 1,
      title: 'Studio Frame',
      category: 'Photography',
      image: galleryImage('IMG_0538.JPG'),
      description: 'A local photo from the gallery folder with a clean editorial crop.',
      accent: 'md:row-span-2 md:col-span-2',
    },
    {
      id: 2,
      title: 'Portrait Study',
      category: 'Portrait',
      image: galleryImage('IMG_3364.JPG'),
      description: 'An image from the uploaded set, kept full-bleed for the grid.',
      accent: 'md:col-span-1',
    },
    {
      id: 3,
      title: 'Candid Moment',
      category: 'Lifestyle',
      image: galleryImage('IMG_5574.JPG'),
      description: 'A candid frame from the local photo folder.',
      accent: 'md:col-span-1 md:row-span-2',
    },
    {
      id: 4,
      title: 'Event Detail',
      category: 'Event',
      image: galleryImage('IMG_5881.JPG'),
      description: 'Another local image presented as a detail card.',
      accent: 'md:col-span-1',
    },
    {
      id: 5,
      title: 'Night Walk',
      category: 'Street',
      image: galleryImage('1726854847155.JPG'),
      description: 'A wider local shot balanced across the modal and grid.',
      accent: 'md:col-span-2',
    },
    {
      id: 6,
      title: 'Soft Light',
      category: 'Photography',
      image: galleryImage('WhatsApp Image 2026-04-28 at 3.23.21 AM.jpeg'),
      description: 'One of the WhatsApp images saved in the gallery folder.',
      accent: 'md:col-span-1',
    },
    {
      id: 7,
      title: 'Morning Shot',
      category: 'Photography',
      image: galleryImage('WhatsApp Image 2026-04-28 at 3.23.21 AM (1).jpeg'),
      description: 'A second WhatsApp upload from the local photo set.',
      accent: 'md:col-span-1',
    },
    {
      id: 8,
      title: 'Final Capture',
      category: 'Photography',
      image: galleryImage('WhatsApp Image 2026-04-28 at 3.23.22 AM.jpeg'),
      description: 'The last local image in the gallery folder.',
      accent: 'md:col-span-2',
    },
  ];

  return (
    <main className="bg-[#f7f5f1]">
      <section className="max-w-7xl mx-auto px-4 pt-10 md:pt-14 pb-8 md:pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-semibold mb-3">
              Visual Archive
            </p>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-[0.95] max-w-2xl">
              Gallery of selected frames and design studies.
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-600 max-w-xl leading-relaxed">
              A compact collection of visual experiments, photography, and brand explorations arranged like an editorial contact sheet.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-[22px] border border-gray-200 bg-white p-4 md:p-5 shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Frames</p>
              <p className="text-2xl md:text-3xl font-black text-gray-900">08</p>
            </div>
            <div className="rounded-[22px] border border-gray-200 bg-[#121212] p-4 md:p-5 text-white shadow-[0_12px_30px_rgba(17,17,17,0.08)] col-span-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 mb-2">Direction</p>
              <p className="text-lg md:text-xl font-bold leading-tight max-w-sm">
                Minimal, image-first, and intentionally compact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {galleryImages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedImage(item)}
              className={`group relative overflow-hidden rounded-lg bg-gray-200 text-left shadow-[0_10px_20px_rgba(17,17,17,0.08)] aspect-square`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-black/8" />

              <div className="absolute inset-x-0 bottom-0 p-3 text-white backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/80 mb-1">
                  {item.category}
                </p>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm md:text-base font-black leading-tight truncate max-w-[72%]">
                    {item.title}
                  </h2>
                  <div className="h-8 w-8 rounded-full bg-white text-gray-900 flex items-center justify-center text-sm">
                    ↗
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:scale-105"
              aria-label="Close gallery image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-[#f4f1eb] p-4 md:p-6">
                <div className="overflow-hidden rounded-[24px] bg-gray-200 aspect-[4/3] md:aspect-[5/4]">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between p-5 md:p-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-3">
                    {selectedImage.category}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                    {selectedImage.title}
                  </h2>
                  <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
                    {selectedImage.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4 flex items-center justify-between gap-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    Frame #{String(selectedImage.id).padStart(2, '0')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
                  >
                    Close view
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;
