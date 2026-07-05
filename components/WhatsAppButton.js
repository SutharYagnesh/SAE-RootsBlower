'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('+916354586037');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings && data.settings.whatsappNumber) {
          const cleanNum = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
          setWhatsappNumber(cleanNum);
        }
      })
      .catch((err) => console.error('Error fetching settings in WhatsAppButton:', err));
  }, []);

  const message = 'Hello Shree Ambika Engineering, I am interested in your Roots Blowers. Please share your catalog and price list.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20 cursor-pointer"
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}
