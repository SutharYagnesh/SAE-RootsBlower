import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Gallery from '@/models/Gallery';
import Link from 'next/link';
import ProductsCatalog from '@/components/ProductsCatalog';
import ImageCarousel from '@/components/ImageCarousel';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Roots Blower Supplier & Price in India | Industrial Blower Catalog',
  description: 'Explore industrial roots blowers & twin lobe blowers from SAE. Request a Roots Blower quotation & competitive price in India today.',
  keywords: 'Twin Lobe Blower Manufacturer, Industrial Roots Blower, Roots Blower Price in India, Roots Blower Supplier, Roots Blower Quotation, Buy Roots Blower',
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: 'Roots Blower Supplier & Price in India | Industrial Blower Catalog',
    description: 'Explore industrial twin lobe blowers & positive displacement blowers. Request an instant Roots Blower quotation.',
    url: `${siteUrl}/products`,
    siteName: 'SAE Roots Blower',
    images: [{ url: `${siteUrl}/images/about-us/about-us-2.webp` }],
  },
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ status: 'published' })
    .select('title slug shortDescription specifications images sourceCategory sourceCategories sourcePrice')
    .sort({ createdAt: -1 });

  // Fetch gallery items for the Product Page Carousel
  const galleryItems = await Gallery.find({})
    .select('title category image')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Industrial Roots Blower Catalog</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            High-efficiency Twin Lobe Blowers, Tri Lobe Blowers & Positive Displacement Blower Systems. Request a competitive Roots Blower price & quotation.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#product-results"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-primary transition hover:bg-accent/85"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-primary"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="product-results" className="scroll-mt-28 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="rounded-xl border border-borders-custom bg-white py-16 text-center text-gray-500">
              No published products are available yet.
            </div>
          ) : (
            <ProductsCatalog products={JSON.parse(JSON.stringify(products))} />
          )}
        </div>
      </section>

      {/* Product Page Installation & Manufacturing Carousel */}
      {galleryItems && galleryItems.length > 0 && (
        <section className="py-16 bg-white border-t border-borders-custom relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-secondary font-bold text-xs tracking-widest uppercase font-semibold">
                Factory & Field Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary mt-2">
                On-Site Installations & Manufacturing Showcase
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Explore live installation photos of our Twin Lobe & Tri Lobe Roots Blowers across water treatment, aquaculture, and pneumatic conveying plants.
              </p>
            </div>

            <ImageCarousel items={JSON.parse(JSON.stringify(galleryItems))} />
          </div>
        </section>
      )}
    </div>
  );
}
