import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

export const revalidate = 86400; // Revalidate sitemap daily

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

  try {
    await connectDB();

    // Query products
    const products = await Product.find({ status: 'published' }).lean();
    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // Query blogs
    const blogs = await Blog.find({ status: 'published' }).lean();
    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Sitemap generator error:', error);
    return staticRoutes;
  }
}

