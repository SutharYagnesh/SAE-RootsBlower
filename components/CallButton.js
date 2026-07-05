'use client';

import { useState, useEffect } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

export default function CallButton() {
  const [phoneNumber, setPhoneNumber] = useState('+9163545486037');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings && data.settings.phone) {
          const displayPhone = data.settings.phone.split(',')[0].trim();
          setPhoneNumber(displayPhone);
        }
      })
      .catch((err) => console.error('Error fetching settings in CallButton:', err));
  }, []);

  return (
    <a
      href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
      className="fixed bottom-6 left-6 z-40 md:hidden bg-primary hover:bg-accent text-white hover:text-primary p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20 cursor-pointer"
      aria-label="Call Us"
    >
      <FaPhoneAlt size={20} />
    </a>
  );
}
