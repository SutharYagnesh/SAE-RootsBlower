'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaTimes, FaAngleLeft, FaAngleRight, FaVideo, FaSearch, FaExpandAlt } from 'react-icons/fa';

const pageSize = 48;

export default function GalleryClient({ initialItems = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isZoomed, setIsZoomed] = useState(false);

  const categories = useMemo(
    () => ['All', ...new Set(initialItems.map((item) => item.category).filter(Boolean))],
    [initialItems]
  );
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery =
        !query || `${item.title} ${item.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, initialItems, searchQuery]);
  const activeItem = lightboxIndex >= 0 ? filteredItems[lightboxIndex] : null;

  useEffect(() => {
    if (!activeItem) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(-1);
        setIsZoomed(false);
      } else if (event.key === 'ArrowRight' && filteredItems.length > 1) {
        setLightboxIndex((index) => (index + 1) % filteredItems.length);
        setIsZoomed(false);
      } else if (event.key === 'ArrowLeft' && filteredItems.length > 1) {
        setLightboxIndex((index) => (index - 1 + filteredItems.length) % filteredItems.length);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, filteredItems.length]);

  const showNext = () => {
    setLightboxIndex((index) => (index + 1) % filteredItems.length);
    setIsZoomed(false);
  };

  const showPrevious = () => {
    setLightboxIndex((index) => (index - 1 + filteredItems.length) % filteredItems.length);
    setIsZoomed(false);
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search gallery</span>
          <FaSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setVisibleCount(pageSize);
              setLightboxIndex(-1);
            }}
            placeholder="Search products, installations, or categories"
            className="w-full rounded-lg border border-borders-custom bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <p className="self-center text-sm text-gray-500" aria-live="polite">
          {filteredItems.length.toLocaleString()} images and videos
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setVisibleCount(pageSize);
              setLightboxIndex(-1);
            }}
            aria-pressed={activeCategory === category}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category
                ? 'border-primary bg-primary text-white shadow'
                : 'border-borders-custom bg-white text-gray-600 hover:bg-bg-custom'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-borders-custom bg-white py-12 text-center text-gray-500">
          No gallery items match this search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredItems.slice(0, visibleCount).map((item, index) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  setLightboxIndex(index);
                  setIsZoomed(false);
                }}
                aria-label={`View ${item.title} in full size`}
                className="group overflow-hidden rounded-xl border border-borders-custom bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {item.type === 'image' && item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      width={500}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-primary/10 p-4">
                      <FaVideo aria-hidden="true" className="mb-2 text-primary" size={32} />
                      <span className="text-center text-xs font-semibold leading-tight text-primary/75">
                        {item.title}
                      </span>
                    </div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-primary/35 text-xs font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {item.type === 'video' ? 'Play video' : 'View image'}
                  </span>
                </div>
                <span className="block border-t border-gray-100 p-3">
                  <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-secondary">
                    {item.category}
                  </span>
                  <span className="mt-1 block truncate text-sm font-bold text-primary">
                    {item.title}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {visibleCount < filteredItems.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + pageSize)}
                className="rounded-lg border border-primary bg-white px-7 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
              >
                Load more ({(filteredItems.length - visibleCount).toLocaleString()} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} full-size view`}
          onClick={() => setLightboxIndex(-1)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(-1)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 hover:text-accent sm:right-6 sm:top-6"
            aria-label="Close image viewer"
          >
            <FaTimes size={22} />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 hover:text-accent sm:left-8"
                aria-label="Previous image"
              >
                <FaAngleLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 hover:text-accent sm:right-8"
                aria-label="Next image"
              >
                <FaAngleRight size={28} />
              </button>
            </>
          )}

          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-6xl flex-col items-center gap-4"
          >
            {activeItem.type === 'image' && activeItem.image ? (
              <div className="max-h-[78vh] max-w-full overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  width={1600}
                  height={1200}
                  decoding="async"
                  onClick={() => setIsZoomed((zoomed) => !zoomed)}
                  className={`max-h-[78vh] rounded-lg object-contain shadow-2xl transition-transform duration-200 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                />
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                <iframe
                  src={activeItem.videoUrl}
                  title={activeItem.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="text-center text-white">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                {activeItem.category}
              </span>
              <h2 className="mt-1 text-lg font-bold font-heading">{activeItem.title}</h2>
            </div>

            {activeItem.type === 'image' && activeItem.image && (
              <button
                type="button"
                onClick={() => setIsZoomed((zoomed) => !zoomed)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                aria-pressed={isZoomed}
              >
                <FaExpandAlt aria-hidden="true" />
                {isZoomed ? 'Fit to screen' : 'Zoom image'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
