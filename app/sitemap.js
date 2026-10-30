import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';
  const currentDate = new Date();

  // Core static routes with daily update frequency
  const staticRoutes = [
    { route: '', priority: 1.0 },
    { route: '/products', priority: 0.9 },
    { route: '/applications', priority: 0.8 },
    { route: '/about', priority: 0.8 },
    { route: '/gallery', priority: 0.7 },
    { route: '/blogs', priority: 0.7 },
    { route: '/contact', priority: 0.8 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority,
  }));

  await connectDB();

  const [products, blogs] = await Promise.all([
    Product.find({ status: 'published', slug: { $type: 'string', $ne: '' } })
      .select('slug updatedAt')
      .lean(),
    Blog.find({ status: 'published', slug: { $type: 'string', $ne: '' } })
      .select('slug updatedAt')
      .lean(),
  ]);

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : currentDate,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
