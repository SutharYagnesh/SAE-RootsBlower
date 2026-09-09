'use client';

import { useState, useEffect } from 'react';

const bannerImages = [
  {
    src: '/images/banner/sae-banner-1.webp',
    alt: 'SAE Roots Blower Manufacturing Banner 1',
  },
  {
    src: '/images/banner/sae-banner-2.webp',
    alt: 'SAE Heavy Duty Tri Lobe Blower Banner 2',
  },
  {
    src: '/images/banner/sae-banner-3.webp',
    alt: 'SAE Industrial Pneumatic Conveying Systems Banner 3',
  },
];

export default function HeroBackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div aria-hidden="true" className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {bannerImages.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-30 scale-105 transition-transform duration-[6000ms]' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      {/* Dark gradient overlay to preserve optimal contrast for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-[#08223c]/95" />
    </div>
  );
}
