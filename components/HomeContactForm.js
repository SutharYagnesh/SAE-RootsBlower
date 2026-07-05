'use client';

import { useState, useEffect } from 'react';

export default function HomeContactForm({ products = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    product: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const [whatsappNum, setWhatsappNum] = useState('916354586037'); // Default fallback

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
      .catch((err) => console.error('Error fetching settings in HomeContactForm:', err));
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

      // Find selected product title
      const selectedProduct = products.find((p) => p._id === formData.product);
      const productTitle = selectedProduct ? selectedProduct.title : '';

      // Construct WhatsApp message
      const whatsappText = `*New Blower Inquiry via Website*
---------------------------------------
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
⚙️ *Product:* ${productTitle || 'General Inquiry'}
📝 *Requirement details:*
${formData.message}`;

      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappText)}`;

      setStatus({ submitting: false, success: true, error: null });

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        product: '',
      });
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border border-borders-custom">
      <h3 className="text-2xl font-bold font-heading text-primary mb-6">
        Request a Catalog & Quote
      </h3>

      {status.success && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
          Thank you for contacting us! We have received your inquiry and will get back to you within 24 hours.
        </div>
      )}

      {status.error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
          Failed to send message: {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="product" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Product of Interest (Optional)
          </label>
          <select
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Your Requirement Details *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your airflow/pressure requirements, applications, etc..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status.submitting}
          className="w-full bg-primary hover:bg-accent text-white hover:text-primary py-3 rounded-md font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] cursor-pointer shadow-md"
        >
          {status.submitting ? 'Submitting...' : 'Send Inquiry Request'}
        </button>
      </form>
    </div>
  );
}
