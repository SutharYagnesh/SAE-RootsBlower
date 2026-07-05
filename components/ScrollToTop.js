'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className="fixed bottom-24 right-6 z-40 bg-primary hover:bg-accent text-white hover:text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none border border-accent/20 cursor-pointer"
      aria-label="Scroll to top"
    >
      <FaArrowUp size={18} />
    </button>
  );
}
