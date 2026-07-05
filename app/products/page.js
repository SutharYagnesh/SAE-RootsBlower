import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';

export const metadata = {
  title: 'Roots Blower Catalog | Shree Ambika Engineering',
  description: 'Browse the complete range of rotary blowers manufactured by Shree Ambika Engineering, including Twin Lobe Roots Blowers, Tri Lobe Roots Blowers, and Water Cooled systems.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ status: 'published' })
    .select('title slug shortDescription specifications images')
    .sort({ createdAt: -1 });

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Industrial Roots Blower Catalog</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Precision engineering solutions for high-volumetric and continuous air displacement.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white border border-borders-custom rounded-xl">
              <p className="text-gray-500">No products published yet. Seed the database to view sample products.</p>
              <Link
                href="/api/seed"
                className="mt-4 bg-primary text-white px-6 py-2.5 rounded hover:bg-accent hover:text-primary transition-colors inline-block"
              >
                Run Database Seeder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-borders-custom rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="p-6">
                    {/* Visual Placeholder for base64 images */}
                    <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden border border-gray-150 relative">
                      {product.images && product.images[0] ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="6" strokeDasharray="12 6" />
                        </svg>
                      )}
                    </div>

                    <h3 className="text-xl font-bold font-heading text-primary mb-2 group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                      {product.shortDescription}
                    </p>

                    {/* Specifications List */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Specifications</h4>
                      {product.specifications.slice(0, 4).map((spec, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                          <span className="text-gray-450">{spec.key}:</span>
                          <span className="font-semibold text-gray-700">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-center w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-3 rounded-md text-sm transition-all duration-300 hover:scale-[1.02] shadow-sm cursor-pointer"
                    >
                      View Specifications & Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
