import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaShareAlt, FaWhatsapp, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return { title: 'Article Not Found' };
  }

  return {
    title: blog.seoTitle || `${blog.title} | Shree Ambika Engineering`,
    description: blog.seoDescription || blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    notFound();
  }

  // Fetch recent posts
  const recentBlogs = await Blog.find({
    status: 'published',
    _id: { $ne: blog._id },
  })
    .select('title slug category createdAt')
    .sort({ createdAt: -1 })
    .limit(4);

  // Sharing links (since this is SSR, we generate based on localhost for dev)
  const shareUrl = `https://saerootsblower.com/blogs/${blog.slug}`;
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <div className="bg-bg-custom min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-borders-custom py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-primary">Blogs</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{blog.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Left Column: Post Content */}
          <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-xl border border-borders-custom shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-3">
              <span className="bg-primary/5 text-primary px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                {blog.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-primary leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center text-xs text-gray-400 space-x-4 border-b border-gray-100 pb-4">
                <span>By SAE Engineering Dept</span>
                <span>•</span>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rich Content */}
            <div
              className="prose max-w-none text-gray-650 text-sm leading-relaxed space-y-4 whitespace-normal"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
                {blog.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-bg-custom border border-borders-custom text-gray-600 px-3 py-1 rounded text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center space-x-3 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider flex items-center">
                <FaShareAlt className="mr-1.5" /> Share Article:
              </span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white hover:opacity-90 px-3 py-1.5 rounded flex items-center space-x-1 font-semibold"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0077b5] text-white hover:opacity-90 px-3 py-1.5 rounded flex items-center space-x-1 font-semibold"
              >
                <FaLinkedinIn size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:?subject=${shareTitle}&body=Check out this article from Shree Ambika Engineering: ${shareUrl}`}
                className="bg-gray-650 text-white hover:opacity-90 px-3 py-1.5 rounded flex items-center space-x-1 font-semibold"
              >
                <FaEnvelope size={14} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Right Column: Recent Insights */}
          <aside className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wider border-b border-gray-100 pb-2">
                Recent Insights
              </h3>
              {recentBlogs.length === 0 ? (
                <p className="text-gray-500 text-xs">No recent posts found.</p>
              ) : (
                <div className="space-y-4">
                  {recentBlogs.map((rec) => (
                    <Link
                      key={rec._id}
                      href={`/blogs/${rec.slug}`}
                      className="block group border-b border-gray-55 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                        {rec.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors line-clamp-2 mt-1">
                        {rec.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {new Date(rec.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-primary text-white p-6 rounded-xl shadow-md text-center space-y-4">
              <h4 className="font-heading font-bold text-accent text-base">Engineering Consultation</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Contact our factory directly to discuss flow calculations, custom motor ratings, and warranty parameters.
              </p>
              <Link
                href="/contact"
                className="bg-accent hover:bg-accent/90 text-primary font-bold px-4 py-2 rounded text-xs transition-all inline-block w-full"
              >
                Contact Sales Team
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
