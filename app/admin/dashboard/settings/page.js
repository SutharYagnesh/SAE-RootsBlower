'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaUpload, FaTimes } from 'react-icons/fa';

export default function AdminSettingsCMS() {
  const [formData, setFormData] = useState({
    companyName: 'Shree Ambika Engineering',
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
    logo: '',
    favicon: '',
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    googleMapEmbed: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setFormData(data.settings);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  const compressAndConvertToBase64 = (file, isFavicon = false) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Scale constraints
          const MAX_WIDTH = isFavicon ? 64 : 320;
          const MAX_HEIGHT = isFavicon ? 64 : 120;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(isFavicon ? 'image/png' : 'image/jpeg', 0.85));
        };
      };
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await compressAndConvertToBase64(file, false);
      setFormData((prev) => ({ ...prev, logo: b64 }));
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await compressAndConvertToBase64(file, true);
      setFormData((prev) => ({ ...prev, favicon: b64 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading website configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-borders-custom">
        <h1 className="text-2xl font-bold font-heading text-primary">General Settings</h1>
        <p className="text-xs text-gray-500">Configure factory address details, tracking codes, and home meta tags.</p>
      </div>

      {message.text && (
        <div
          className={`p-3.5 rounded text-xs border ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Contacts */}
        <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
            Factory Address & Contacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sales Phones *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Factory Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp Chat Line</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Google Map Embed Src Link
              </label>
              <input
                type="text"
                value={formData.googleMapEmbed}
                onChange={(e) => handleInputChange('googleMapEmbed', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
            Social Networks Profiles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['facebook', 'twitter', 'linkedin', 'youtube'].map((network) => (
              <div key={network}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 capitalize">
                  {network}
                </label>
                <input
                  type="url"
                  value={formData.socialLinks[network] || ''}
                  onChange={(e) => handleSocialChange(network, e.target.value)}
                  placeholder={`https://${network}.com/...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Default SEO Tag */}
        <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
            Global Search Engine Metadata
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Default Meta Title *
              </label>
              <input
                type="text"
                required
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Default Meta Description *
              </label>
              <input
                type="text"
                required
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Google Analytics ID (e.g. G-XXXXXXX)
            </label>
            <input
              type="text"
              value={formData.googleAnalyticsId}
              onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
              className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
            />
          </div>
        </div>

        {/* Section 4: Brand Graphics */}
        <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
            Brand Assets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo upload */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Corporate Logo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group w-full sm:w-44">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold text-center group-hover:text-primary">
                    Upload Logo
                  </span>
                </div>
                {formData.logo && (
                  <div className="relative aspect-video w-full sm:w-32 border border-gray-200 rounded bg-gray-50 flex items-center justify-center p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.logo} alt="Corporate Logo" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleInputChange('logo', '')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100"
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Favicon upload */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Tab Favicon (64x64 PNG)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group w-full sm:w-44">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleFaviconUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold text-center group-hover:text-primary">
                    Upload Favicon
                  </span>
                </div>
                {formData.favicon && (
                  <div className="relative aspect-square w-12 border border-gray-200 rounded flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.favicon} alt="Favicon" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleInputChange('favicon', '')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-70 hover:opacity-100"
                    >
                      <FaTimes size={6} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-borders-custom">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-10 py-3 rounded text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <FaSave />
            <span>{isSubmitting ? 'Saving settings...' : 'Update Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
