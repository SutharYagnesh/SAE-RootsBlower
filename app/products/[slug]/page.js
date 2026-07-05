import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductInquiryForm from '@/components/ProductInquiryForm';
import { FaCheck, FaIndustry, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  const product = await Product.findOne({ slug });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.seoTitle || `${product.title} | Shree Ambika Engineering`,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;

  const product = await Product.findOne({ slug });
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await Product.find({
    status: 'published',
    _id: { $ne: product._id },
  })
    .select('title slug shortDescription')
    .limit(3);

  return (
    <div className="bg-bg-custom min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-borders-custom py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left/Middle Columns: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-borders-custom shadow-sm space-y-6">
              <h1 className="text-3xl font-extrabold font-heading text-primary">{product.title}</h1>
              
              {/* Product Image */}
              <div className="aspect-video w-full bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center p-6 overflow-hidden">
                {product.images && product.images[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="max-h-[320px] object-contain"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-gray-300"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="6" strokeDasharray="12 6" />
                  </svg>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading text-primary flex items-center space-x-2">
                  <FaInfoCircle className="text-accent" />
                  <span>Product Overview</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.longDescription || product.shortDescription}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold font-heading text-primary flex items-center space-x-2">
                    <FaFileAlt className="text-secondary" />
                    <span>Salient Design Features</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <FaCheck className="text-green-600 mt-1 flex-shrink-0" size={12} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-borders-custom shadow-sm space-y-6">
                <h3 className="text-lg font-bold font-heading text-primary">Technical Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-55 text-left text-gray-500 font-bold uppercase tracking-wider text-xs">
                        <th className="px-6 py-3 font-semibold">Parameter Description</th>
                        <th className="px-6 py-3 font-semibold">Specification Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {product.specifications.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                          <td className="px-6 py-4 font-medium text-gray-700">{spec.key}</td>
                          <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-borders-custom shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-heading text-primary flex items-center space-x-2">
                  <FaIndustry className="text-primary" />
                  <span>Standard Application Spheres</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app, index) => (
                    <span
                      key={index}
                      className="bg-bg-custom border border-borders-custom text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry Form & Related Products */}
          <div className="space-y-8">
            <ProductInquiryForm productId={product._id.toString()} productTitle={product.title} />

            {/* Related Products list */}
            {relatedProducts.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-sm space-y-4">
                <h3 className="text-base font-bold font-heading text-primary border-b border-gray-100 pb-2">
                  Other Blower Systems
                </h3>
                <div className="space-y-4">
                  {relatedProducts.map((rel) => (
                    <Link
                      key={rel._id}
                      href={`/products/${rel.slug}`}
                      className="block group hover:bg-bg-custom p-3 rounded-lg border border-transparent hover:border-borders-custom transition-all"
                    >
                      <h4 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        {rel.shortDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
