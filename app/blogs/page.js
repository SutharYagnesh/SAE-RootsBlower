import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering Blog & Insights | Shree Ambika Engineering',
  description: 'Read technical engineering articles about positive displacement blowers, dissolved oxygen in wastewater aeration, and pneumatic conveying tips.',
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage({ searchParams }) {
  await connectDB();
  
  // Await searchParams in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category || 'All';
  const searchQuery = resolvedSearchParams.search || '';

  // Retrieve all distinct categories for filtering
  const allCategories = await Blog.distinct('category', { status: 'published' });
  const categoriesList = ['All', ...allCategories];

  // Build query
  const query = { status: 'published' };
  if (activeCategory !== 'All') {
    query.category = activeCategory;
  }
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { excerpt: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  const blogs = await Blog.find(query)
    .select('title slug excerpt category featuredImage createdAt')
    .sort({ createdAt: -1 });

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Engineering Blog & News</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            In-depth guides, comparison sheets, and process solutions from our technical department.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Left Column: Blogs Grid */}
            <div className="lg:col-span-3 space-y-8">
              {blogs.length === 0 ? (
                <div className="text-center py-16 bg-white border border-borders-custom rounded-xl">
                  <p className="text-gray-500">No blog posts found matching your criteria.</p>
                  <Link
                    href="/blogs"
                    className="mt-4 bg-primary text-white px-6 py-2.5 rounded hover:bg-accent hover:text-primary transition-colors inline-block"
                  >
                    Clear Filters
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="bg-white border border-borders-custom rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                    >
                      <div className="p-6">
                        <div className="aspect-video w-full bg-gray-150 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative border border-gray-100">
                          {blog.featuredImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Technical Article</span>
                          )}
                        </div>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                          {blog.category}
                        </span>
                        <h3 className="text-lg font-bold font-heading text-primary mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="p-6 pt-0 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="text-xs font-bold text-primary hover:text-accent hover:underline flex items-center"
                        >
                          Read More &rarr;
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="space-y-8">
              {/* Search Widget */}
              <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-sm">
                <h4 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Search Blog</h4>
                <form action="/blogs" method="GET" className="flex">
                  {activeCategory !== 'All' && (
                    <input type="hidden" name="category" value={activeCategory} />
                  )}
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchQuery}
                    placeholder="Search keywords..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-l focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white hover:bg-accent hover:text-primary px-4 rounded-r text-xs font-bold transition-all cursor-pointer"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* Categories Widget */}
              <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-sm">
                <h4 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Categories</h4>
                <div className="flex flex-col space-y-2 text-xs">
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat}
                      href={`/blogs?category=${cat}${searchQuery ? `&search=${searchQuery}` : ''}`}
                      className={`py-1.5 px-3 rounded hover:bg-bg-custom hover:text-primary transition-all font-semibold ${
                        activeCategory === cat ? 'bg-primary text-white hover:bg-primary hover:text-white' : 'text-gray-600'
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
