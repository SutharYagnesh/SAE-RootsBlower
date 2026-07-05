'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUpload, FaTimes, FaLink, FaImages, FaVideo } from 'react-icons/fa';

export default function AdminGalleryCMS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Manufacturing',
    type: 'image',
    image: '',
    videoUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
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
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressAndConvertToBase64(file);
      setFormData((prev) => ({ ...prev, image: compressed }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        setMessage({ type: 'success', text: 'Media item deleted successfully' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add media item');
      }

      setMessage({ type: 'success', text: 'Media item added successfully!' });
      setIsAdding(false);
      setFormData({
        title: '',
        category: 'Manufacturing',
        type: 'image',
        image: '',
        videoUrl: '',
      });
      await fetchGallery();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-borders-custom">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Manage Media Gallery</h1>
          <p className="text-xs text-gray-500">Upload photos of manufacturing benches or embed YouTube/Vimeo links.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <FaPlus />
            <span>Upload New Media</span>
          </button>
        )}
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

      {/* Add Media Form Modal/Inline */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Add Gallery Item</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-gray-400 hover:text-primary p-1 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Rotor balancing run"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Exhibitions">Exhibitions</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Media Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              >
                <option value="image">Photo Upload</option>
                <option value="video">Embedded Video Link</option>
              </select>
            </div>
          </div>

          {/* Conditional Media inputs */}
          {formData.type === 'image' ? (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select Photo File</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded p-6 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group w-full sm:w-64">
                  <input
                    type="file"
                    required={!formData.image}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center space-y-1 text-gray-400 group-hover:text-primary transition-colors">
                    <FaUpload className="mx-auto" size={18} />
                    <p className="text-[10px] font-semibold">Choose image file</p>
                  </div>
                </div>

                {formData.image && (
                  <div className="relative aspect-square w-24 border border-gray-200 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image} alt="Upload Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Video Embed URL *
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center">
                <FaLink className="mr-1" /> Use the embed url of YouTube/Vimeo (containing `/embed/` or `/video/`).
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-accent text-white hover:text-primary px-6 py-2 rounded text-xs font-bold transition-all cursor-pointer shadow"
            >
              {isSubmitting ? 'Uploading...' : 'Save Media'}
            </button>
          </div>
        </form>
      )}

      {/* Media Directory listing */}
      <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading gallery items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No media assets in library.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="border border-borders-custom rounded-lg overflow-hidden group flex flex-col justify-between"
              >
                <div className="aspect-square bg-gray-55 flex items-center justify-center relative overflow-hidden">
                  {item.type === 'image' && item.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center p-2">
                      <FaVideo className="text-primary mb-1" size={24} />
                      <span className="text-[10px] text-primary/70 font-semibold text-center truncate w-full">
                        {item.title}
                      </span>
                    </div>
                  )}
                  {/* Delete button appears on hover */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-650 text-white rounded-full p-2 shadow transition-colors cursor-pointer"
                    title="Delete asset"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
                <div className="p-3 bg-bg-custom/40 border-t border-gray-100 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[9px] text-accent font-bold uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-primary truncate block">{item.title}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {item.type === 'image' ? <FaImages /> : <FaVideo />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
