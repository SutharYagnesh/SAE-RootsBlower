'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ImageCarousel({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full relative px-2 sm:px-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="gallery-swiper rounded-2xl overflow-hidden pb-12"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item._id || idx}>
            <div className="bg-white rounded-2xl overflow-hidden border border-borders-custom hover:border-accent/40 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-[320px]">
              <div className="relative flex-grow overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm text-white font-semibold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-4 border-t border-gray-50 flex flex-col justify-center min-h-[70px] bg-white">
                <h4 className="font-heading font-bold text-primary text-sm line-clamp-1 group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
