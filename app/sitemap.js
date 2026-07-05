import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/applications',
    '/gallery',
    '/blogs',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    await connectDB();

    // Query products
    const products = await Product.find({ status: 'published' });
    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || p.createdAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Query blogs
    const blogs = await Blog.find({ status: 'published' });
    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt || b.createdAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Sitemap generator error:', error);
    return staticRoutes;
  }
}
