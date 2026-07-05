'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';

export default function AdminProductsCMS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null); // null means listing. 'new' means adding new. string means editing ID.
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    specifications: [{ key: '', value: '' }],
    features: [''],
    applications: [''],
    images: [],
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setFormData({
      title: prod.title || '',
      shortDescription: prod.shortDescription || '',
      longDescription: prod.longDescription || '',
      specifications: prod.specifications && prod.specifications.length > 0 ? [...prod.specifications] : [{ key: '', value: '' }],
      features: prod.features && prod.features.length > 0 ? [...prod.features] : [''],
      applications: prod.applications && prod.applications.length > 0 ? [...prod.applications] : [''],
      images: prod.images || [],
      seoTitle: prod.seoTitle || '',
      seoDescription: prod.seoDescription || '',
      status: prod.status || 'draft',
    });
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      shortDescription: '',
      longDescription: '',
      specifications: [{ key: 'Air Flow Rate', value: '' }, { key: 'Operating Pressure', value: '' }],
      features: [''],
      applications: ['Wastewater Treatment', 'Aquaculture Aeration'],
      images: [],
      seoTitle: '',
      seoDescription: '',
      status: 'draft',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setMessage({ type: null, text: '' });
  };

  // Dynamic Specs handler
  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData({ ...formData, specifications: updated });
  };

  const addSpecField = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }],
    });
  };

  const removeSpecField = (index) => {
    const updated = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: updated });
  };

  // Dynamic Features handler
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeatureField = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  // Image compress & Base64 handler
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
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(
      files.map((file) => compressAndConvertToBase64(file))
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setMessage({ type: 'success', text: 'Product deleted successfully' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    // Clean data arrays
    const cleanSpecs = formData.specifications.filter((s) => s.key && s.value);
    const cleanFeatures = formData.features.filter((f) => f.trim());
    const cleanApps = formData.applications.map(a => a.trim()).filter(Boolean);

    const payload = {
      ...formData,
      specifications: cleanSpecs,
      features: cleanFeatures,
      applications: cleanApps,
    };

    const url = editingId === 'new' ? '/api/products' : `/api/products/${editingId}`;
    const method = editingId === 'new' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setMessage({
        type: 'success',
        text: editingId === 'new' ? 'Product created successfully!' : 'Product updated successfully!',
      });

      // Refetch
      await fetchProducts();
      setEditingId(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-borders-custom">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Manage Products</h1>
          <p className="text-xs text-gray-500">Add, edit, or remove roots blowers and specifications.</p>
        </div>
        {editingId === null && (
          <button
            onClick={handleAddNew}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <FaPlus />
            <span>Add New Product</span>
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

      {/* Listing Mode */}
      {editingId === null ? (
        <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-4">
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs"
          />

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading catalog items...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No products found.</div>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-55 text-left text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Short Description</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Specs Count</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-bg-custom/50">
                      <td className="px-6 py-4 font-bold text-primary">{p.title}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-xs">{p.shortDescription}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">{p.specifications.length} fields</td>
                      <td className="px-6 py-4 text-right flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 p-2 rounded cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-white hover:bg-red-50 border border-borders-custom text-red-500 p-2 rounded cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Form Add/Edit Mode */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-borders-custom p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="font-heading font-bold text-primary text-lg">
              {editingId === 'new' ? 'Add New Product Line' : 'Edit Product Specifications'}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-primary p-2 cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Blower Model Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Twin Lobe Roots Blower"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Live)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Short Summary Description *
            </label>
            <input
              type="text"
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Heavy-duty twin lobe rotary air blowers designed for STPs."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Detailed Mechanical Description
            </label>
            <textarea
              rows={5}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="Provide a comprehensive explanation of construction, bearings, rotor clearances, drive models, and applications..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            ></textarea>
          </div>

          {/* Specifications key-value pairs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Technical Specifications Table
              </label>
              <button
                type="button"
                onClick={addSpecField}
                className="text-xs font-bold text-primary hover:text-accent flex items-center space-x-1 cursor-pointer"
              >
                <FaPlus size={10} /> <span>Add Specification Field</span>
              </button>
            </div>
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Flow Rate"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                />
                <input
                  type="text"
                  placeholder="e.g. 10 to 5,000 m³/hr"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                />
                {formData.specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecField(idx)}
                    className="text-red-500 hover:text-red-750 p-2 cursor-pointer"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Key Design Features (Bullets)
              </label>
              <button
                type="button"
                onClick={addFeatureField}
                className="text-xs font-bold text-primary hover:text-accent flex items-center space-x-1 cursor-pointer"
              >
                <FaPlus size={10} /> <span>Add Feature Field</span>
              </button>
            </div>
            {formData.features.map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. 100% Oil-free air delivery"
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(idx)}
                    className="text-red-500 hover:text-red-750 p-2 cursor-pointer"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Applications list */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Applications (Comma Separated tags)
            </label>
            <input
              type="text"
              value={formData.applications.join(', ')}
              onChange={(e) => setFormData({ ...formData, applications: e.target.value.split(',') })}
              placeholder="Wastewater Aeration, Pond Aeration, Pneumatic Conveying"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Product Images (Will be stored as compressed Base64 strings)
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center space-y-1.5 text-gray-400 group-hover:text-primary transition-colors">
                <FaUpload className="mx-auto" size={24} />
                <p className="text-xs font-semibold">Click or drag images to compress & upload</p>
                <p className="text-[10px]">PNG, JPG, WEBP (Autocompressed under 100KB)</p>
              </div>
            </div>

            {/* Uploaded Images List preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-gray-200 rounded overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Blower" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Details */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">SEO Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="SEO Title tag"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SEO Meta Description
                </label>
                <input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Meta description content"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 px-6 py-2.5 rounded text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-accent text-white hover:text-primary px-8 py-2.5 rounded text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <FaSave />
              <span>{isSubmitting ? 'Saving specifications...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
