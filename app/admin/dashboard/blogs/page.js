'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, FaEye, FaCode } from 'react-icons/fa';

export default function AdminBlogsCMS() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Tabs for Rich Text editor preview
  const [editorTab, setEditorTab] = useState('write'); // 'write' or 'preview'

  // Form State
  const [editingId, setEditingId] = useState(null); // null = list, 'new' = add, string = edit ID
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: 'General',
    tags: [''],
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?admin=true');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      content: '<h2>Heading 2</h2><p>Start writing your technical article here...</p>',
      excerpt: '',
      featuredImage: '',
      category: 'General',
      tags: ['Blower Installation'],
      seoTitle: '',
      seoDescription: '',
      status: 'draft',
    });
    setEditorTab('write');
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      featuredImage: blog.featuredImage || '',
      category: blog.category || 'General',
      tags: blog.tags && blog.tags.length > 0 ? [...blog.tags] : [''],
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      status: blog.status || 'draft',
    });
    setEditorTab('write');
  };

  const handleCancel = () => {
    setEditingId(null);
    setMessage({ type: null, text: '' });
  };

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
      setFormData((prev) => ({ ...prev, featuredImage: compressed }));
    }
  };

  const handleTagChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(',').map((t) => t.trim()),
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        setMessage({ type: 'success', text: 'Blog post deleted successfully' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    const payload = {
      ...formData,
      tags: formData.tags.filter(Boolean),
    };

    const url = editingId === 'new' ? '/api/blogs' : `/api/blogs/${editingId}`;
    const method = editingId === 'new' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save blog post');
      }

      setMessage({
        type: 'success',
        text: editingId === 'new' ? 'Blog post published/drafted successfully!' : 'Blog post updated successfully!',
      });

      await fetchBlogs();
      setEditingId(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-borders-custom">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Manage Blogs & Insights</h1>
          <p className="text-xs text-gray-500">Create articles for sewage systems, aeration designs, and pond engineering.</p>
        </div>
        {editingId === null && (
          <button
            onClick={handleAddNew}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <FaPlus />
            <span>Write New Article</span>
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
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs"
          />

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading blog directory...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No blog posts found.</div>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-55 text-left text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3">Article Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredBlogs.map((b) => (
                    <tr key={b._id} className="hover:bg-bg-custom/50">
                      <td className="px-6 py-4 font-bold text-primary">{b.title}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{b.category}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(b.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            b.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 p-2 rounded cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
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
              {editingId === 'new' ? 'Write New Technical Post' : 'Edit Article Settings'}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-primary p-2 cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Post Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Mechanics of sewage treatment aeration..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Wastewater Treatment"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
            {/* Tags */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagChange}
                placeholder="Aeration, sewage treatment, blower design"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Short Excerpt / Summary *
            </label>
            <input
              type="text"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Provide a 2-3 sentence overview that appears on listing cards and search engines."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            />
          </div>

          {/* HTML Editor Tabbed Area */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-150 pb-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Article Body Content (Supports HTML Formatting) *
              </label>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`px-3 py-1 text-xs font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors ${
                    editorTab === 'write' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-150 text-gray-600'
                  }`}
                >
                  <FaCode size={11} /> <span>Write HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1 text-xs font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors ${
                    editorTab === 'preview' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-150 text-gray-600'
                  }`}
                >
                  <FaEye size={11} /> <span>Render Preview</span>
                </button>
              </div>
            </div>

            {editorTab === 'write' ? (
              <textarea
                rows={12}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<h2>Subheading</h2><p>Write content paragraphs here...</p>"
                className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
              ></textarea>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 min-h-[300px] max-h-[450px] overflow-y-auto bg-gray-50/50 prose max-w-none text-sm leading-relaxed whitespace-normal">
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Featured Image (Stored as compressed Base64 string)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group w-full sm:w-64">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center space-y-1 text-gray-400 group-hover:text-primary transition-colors">
                  <FaUpload className="mx-auto" size={20} />
                  <p className="text-[10px] font-semibold">Select Article Image</p>
                </div>
              </div>

              {formData.featuredImage && (
                <div className="relative aspect-video w-full sm:w-48 border border-gray-200 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.featuredImage} alt="Featured Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featuredImage: '' })}
                    className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEO Details */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">SEO Meta Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SEO Title Tag
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Enter customized SEO title tag"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SEO Description tag
                </label>
                <input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Enter meta description copy"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
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
              <span>{isSubmitting ? 'Saving post...' : 'Save Article'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
