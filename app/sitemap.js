import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import { applicationsList } from '@/lib/applicationsData';
import { locationsList } from '@/lib/locationsData';

export const dynamic = 'force-dynamic';

function getSitemapImageUrl(image, slug, index, baseUrl) {
  if (typeof image !== 'string' || !image.trim()) {
    return null;
  }

  if (/^data:image\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(image)) {
    return new URL(
      `/merchant-feed/images/${encodeURIComponent(slug)}/${index}`,
      baseUrl
    ).toString();
  }

  try {
    const imageUrl = new URL(image, baseUrl);
    if (!['http:', 'https:'].includes(imageUrl.protocol)) {
      return null;
    }

    const siteHost = new URL(baseUrl).hostname;
    const cdnUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    if (
      cdnUrl &&
      imageUrl.hostname === siteHost &&
      imageUrl.pathname.startsWith('/images/products/')
    ) {
      return new URL(
        imageUrl.pathname.replace(/^\/+/, ''),
        `${cdnUrl.replace(/\/+$/, '')}/`
      ).toString();
    }

    return imageUrl.toString();
  } catch {
    return null;
  }
}

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';
  const currentDate = new Date();

  // Core routes with per-page update frequency and priority.
  const staticRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' },
    { route: '/products', priority: 0.95, changeFrequency: 'daily' },
    { route: '/applications', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/locations', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/about', priority: 0.75, changeFrequency: 'monthly' },
    { route: '/gallery', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/blogs', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/contact', priority: 0.85, changeFrequency: 'weekly' },
    { route: '/privacy-policy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/return-policy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/shipping-policy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    ...(route === '' ? { images: [`${baseUrl}/images/sae-logo.webp`] } : {}),
    changeFrequency,
    priority,
  }));

  // Dynamic application vertical pages
  const applicationRoutes = applicationsList.map((app) => ({
    url: `${baseUrl}/applications/${app.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Dynamic location landing pages (India & International)
  const locationRoutes = locationsList.map((loc) => ({
    url: `${baseUrl}/locations/${loc.region}/${loc.city}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  await connectDB();

  const [products, blogs] = await Promise.all([
    Product.find({ status: 'published', slug: { $type: 'string', $ne: '' } })
      .select('slug updatedAt images')
      .lean(),
    Blog.find({ status: 'published', slug: { $type: 'string', $ne: '' } })
      .select('slug updatedAt')
      .lean(),
  ]);

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
    changeFrequency: 'daily',
    priority: 0.9,
    images: (product.images || [])
      .map((image, index) =>
        getSitemapImageUrl(image, product.slug, index, baseUrl)
      )
      .filter(Boolean)
      .slice(0, 1000),
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : currentDate,
    changeFrequency: 'daily',
    priority: 0.75,
  }));

  return [...staticRoutes, ...applicationRoutes, ...locationRoutes, ...productRoutes, ...blogRoutes];
}
