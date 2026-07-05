'use client';

import { useState } from 'react';
import { FaTimes, FaAngleLeft, FaAngleRight, FaVideo } from 'react-icons/fa';

export default function GalleryClient({ initialItems = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Extract unique categories
  const categories = ['All', ...new Set(initialItems.map((item) => item.category))];

  // Filter items
  const filteredItems = activeCategory === 'All'
    ? initialItems
    : initialItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const activeItem = lightboxIndex >= 0 ? filteredItems[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-white text-gray-600 border-borders-custom hover:bg-bg-custom'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border border-borders-custom rounded-xl">
          No items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => openLightbox(idx)}
              className="bg-white border border-borders-custom rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              {/* Media Thumb */}
              <div className="aspect-square bg-gray-55 flex items-center justify-center overflow-hidden relative">
                {item.type === 'image' && item.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center p-4">
                    <FaVideo className="text-primary mb-2" size={32} />
                    <span className="text-xs text-primary/75 font-semibold text-center leading-tight">{item.title}</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest">
                  {item.type === 'video' ? 'Play Video' : 'View Zoom'}
                </div>
              </div>

              {/* Title & Category info */}
              <div className="p-4 border-t border-gray-100">
                <span className="text-[10px] text-accent font-bold uppercase tracking-wider">{item.category}</span>
                <h4 className="font-heading font-bold text-primary text-sm mt-1 line-clamp-1 group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-accent p-2 bg-white/5 rounded-full"
            aria-label="Close Lightbox"
          >
            <FaTimes size={24} />
          </button>

          {/* Navigation controls */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={showPrev}
                className="absolute left-4 sm:left-8 text-white hover:text-accent p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                aria-label="Previous Slide"
              >
                <FaAngleLeft size={30} />
              </button>
              <button
                onClick={showNext}
                className="absolute right-4 sm:right-8 text-white hover:text-accent p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                aria-label="Next Slide"
              >
                <FaAngleRight size={30} />
              </button>
            </>
          )}

          {/* Lightbox Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center space-y-4"
          >
            {activeItem.type === 'image' && activeItem.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[75vh] object-contain rounded shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-video bg-black rounded overflow-hidden shadow-2xl">
                <iframe
                  src={activeItem.videoUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeItem.title}
                ></iframe>
              </div>
            )}

            <div className="text-center text-white max-w-lg">
              <span className="text-[10px] text-accent font-bold uppercase tracking-wider block mb-1">
                {activeItem.category}
              </span>
              <h3 className="text-lg font-bold font-heading">{activeItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
