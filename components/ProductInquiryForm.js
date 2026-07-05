'use client';

import { useState, useEffect } from 'react';

export default function ProductInquiryForm({ productId, productTitle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: `Inquiry for ${productTitle}`,
    message: `Hello, I would like to request technical catalogs and a price quotation for the ${productTitle}. My requirements are: `,
    product: productId,
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const [whatsappNum, setWhatsappNum] = useState('+916354586037'); // Default fallback

  // Fetch settings to get active WhatsApp number
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings && data.settings.whatsappNumber) {
          const cleanNum = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
          setWhatsappNum(cleanNum);
        }
      })
      .catch((err) => console.error('Error fetching settings in ProductInquiryForm:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Construct WhatsApp message
      const whatsappText = `*Product Inquiry via Website*
---------------------------------------
⚙️ *Product:* ${productTitle}
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
📝 *Requirement details:*
${formData.message}`;

      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappText)}`;

      setStatus({ submitting: false, success: true, error: null });

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      setFormData((prev) => ({
        ...prev,
        name: '',
        email: '',
        phone: '',
        message: `Hello, I would like to request technical catalogs and a price quotation for the ${productTitle}. My requirements are: `,
      }));
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-borders-custom sticky top-28">
      <h3 className="text-xl font-bold font-heading text-primary mb-4">
        Request Technical Quote
      </h3>

      {status.success && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md border border-green-200 text-sm">
          Quote request sent successfully! Our sales engineers will contact you shortly.
        </div>
      )}

      {status.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
          Failed to send request: {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="sales@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 63545 86037"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Specific Requirements *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status.submitting}
          className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-3 rounded text-sm tracking-wide transition-all hover:scale-[1.01] cursor-pointer shadow"
        >
          {status.submitting ? 'Sending Request...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
