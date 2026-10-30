'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductImageGallery({ images = [], productTitle }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return (
      <div className="aspect-video w-full bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-300"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="6" strokeDasharray="12 6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-150 bg-gray-50 p-4">
        <Image
          src={selectedImage}
          alt={`${productTitle} industrial roots blower`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label={`${productTitle} image gallery`}>
          {images.map((image, index) => (
            <button
              key={`${image.slice(0, 40)}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View ${productTitle} image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-1 ${
                selectedIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${productTitle} product view ${index + 1}`}
                fill
                unoptimized
                sizes="96px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
