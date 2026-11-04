import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import Product from '@/models/Product';
import GalleryClient from '@/components/GalleryClient';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Roots Blower Manufacturing & Installation Gallery | SAE',
  description: 'Visual gallery of SAE roots blower manufacturing facility, CNC machining tooling, and on-site industrial installations.',
  keywords: 'Roots blower photos, roots blower installation gallery, Shree Ambika Engineering manufacturing facility',
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: {
    title: 'Roots Blower Manufacturing & Installation Gallery | SAE',
    description: 'Visual photo gallery of SAE roots blower manufacturing & installations.',
    url: `${siteUrl}/gallery`,
    siteName: 'SAE Roots Blower',
    images: [{ url: `${siteUrl}/images/sae-logo.webp` }],
  },
};


export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  await connectDB();
  const [galleryItems, products] = await Promise.all([
    Gallery.find({}).sort({ createdAt: -1 }).lean(),
    Product.find({ status: 'published' })
      .select('title slug sourceCategory sourceCategories images createdAt')
      .sort({ title: 1 })
      .lean(),
  ]);
  const productImages = products.flatMap((product) =>
    (product.images || [])
      .filter((image) => typeof image === 'string' && image.trim())
      .map((image, index) => ({
        _id: `${product._id}-image-${index}`,
        title: `${product.title} — Image ${index + 1}`,
        category: product.sourceCategory || product.sourceCategories?.[0] || 'Products',
        type: 'image',
        image,
        productSlug: product.slug,
      }))
  );
  const items = [
    ...galleryItems.map((item) => ({ ...item, _id: item._id.toString() })),
    ...productImages,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Product & Manufacturing Gallery</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explore product images from our full catalogue alongside factory, installation, and media highlights.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white border border-borders-custom rounded-xl">
              <p className="text-gray-500">No gallery items uploaded yet.</p>
              <Link
                href="/api/seed"
                className="mt-4 bg-primary text-white px-6 py-2.5 rounded hover:bg-accent hover:text-primary transition-colors inline-block"
              >
                Run Database Seeder
              </Link>
            </div>
          ) : (
            <GalleryClient initialItems={JSON.parse(JSON.stringify(items))} />
          )}
        </div>
      </section>
    </div>
  );
}
