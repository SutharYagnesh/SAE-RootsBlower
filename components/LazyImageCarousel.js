'use client';

import dynamic from 'next/dynamic';

const ImageCarousel = dynamic(() => import('./ImageCarousel'));

export default function LazyImageCarousel({ items }) {
  return <ImageCarousel items={items} />;
}
