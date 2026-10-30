import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductInquiryForm from '@/components/ProductInquiryForm';
import ProductImageGallery from '@/components/ProductImageGallery';
import { FaCheck, FaIndustry, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

function getProductImageUrl(image) {
  if (typeof image !== 'string' || !image) {
    return null;
  }

  const cdnUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  const imageUrl = new URL(image, siteUrl);
  const siteHost = new URL(siteUrl).hostname;

  if (imageUrl.hostname === siteHost) {
    if (cdnUrl && imageUrl.pathname.startsWith('/images/products/')) {
      return new URL(
        imageUrl.pathname.replace(/^\/+/, ''),
        `${cdnUrl.replace(/\/+$/, '')}/`
      ).toString();
    }

    return `${imageUrl.pathname}${imageUrl.search}${imageUrl.hash}`;
  }

  return image;
}

function getAbsoluteHttpImageUrls(images) {
  return images
    .map((image) => {
      try {
        const url = new URL(image, siteUrl);
        return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  const product = await Product.findOne({ slug });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = product.seoTitle || `${product.title} | Shree Ambika Engineering`;
  const description = product.seoDescription || product.shortDescription;
  const canonical = new URL(`/products/${product.slug}`, siteUrl).toString();
  const images = getAbsoluteHttpImageUrls(
    (product.images || []).map(getProductImageUrl).filter(Boolean)
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'SAE Roots Blower',
      type: 'website',
      ...(images.length > 0 ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images.length > 0 ? { images } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;

  const product = await Product.findOne({ slug });
  if (!product) {
    notFound();
  }

  const canonical = new URL(`/products/${product.slug}`, siteUrl).toString();
  const productImages = [
    ...new Set((product.images || []).map(getProductImageUrl).filter(Boolean)),
  ];
  const offers = (product.offers || []).filter(
    (offer) =>
      offer &&
      typeof offer.name === 'string' &&
      offer.name.trim() &&
      Number.isFinite(Number(offer.price)) &&
      Number(offer.price) > 0
  );
  const reviews = (product.reviews || []).filter(
    (review) =>
      review &&
      typeof review.author === 'string' &&
      review.author.trim() &&
      typeof review.reviewBody === 'string' &&
      review.reviewBody.trim() &&
      Number.isFinite(Number(review.ratingValue)) &&
      Number(review.ratingValue) >= 1 &&
      Number(review.ratingValue) <= 5 &&
      review.datePublished &&
      !Number.isNaN(new Date(review.datePublished).getTime())
  );
  const prices = offers.map((offer) => Number(offer.price));
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'SAE Roots Blower',
    },
    url: canonical,
    ...(productImages.length > 0 ? { image: productImages } : {}),
    ...(offers.length === 1
      ? {
          offers: {
            '@type': 'Offer',
            name: offers[0].name,
            priceCurrency: 'INR',
            price: prices[0],
            url: canonical,
          },
        }
      : offers.length > 1
        ? {
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice: Math.min(...prices),
              highPrice: Math.max(...prices),
              offerCount: offers.length,
              offers: offers.map((offer) => ({
                '@type': 'Offer',
                name: offer.name,
                priceCurrency: 'INR',
                price: Number(offer.price),
                url: canonical,
              })),
            },
          }
        : {}),
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue:
              reviews.reduce((total, review) => total + Number(review.ratingValue), 0) /
              reviews.length,
            reviewCount: reviews.length,
          },
          review: reviews.map((review) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: review.author,
            },
            reviewBody: review.reviewBody,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: Number(review.ratingValue),
              bestRating: 5,
              worstRating: 1,
            },
            datePublished: new Date(review.datePublished).toISOString(),
          })),
        }
      : {}),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: new URL('/products', siteUrl).toString(),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: canonical,
      },
    ],
  };
  const priceFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

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
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {offers.length > 0 ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price {offers.length > 1 ? 'range' : 'from'}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-primary">
                        {offers.length > 1
                          ? `${priceFormatter.format(Math.min(...prices))} – ${priceFormatter.format(Math.max(...prices))}`
                          : priceFormatter.format(prices[0])}
                      </p>
                      {offers.length > 1 && (
                        <ul className="mt-2 space-y-1 text-xs text-gray-600">
                          {offers.map((offer, index) => (
                            <li key={`${offer.name}-${index}`} className="flex justify-between gap-4">
                              <span>{offer.name}</span>
                              <span className="font-semibold">
                                {priceFormatter.format(Number(offer.price))}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-gray-600">
                      Pricing available on request
                    </p>
                  )}
                </div>
                <Link
                  href="#request-quote"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-bold text-primary shadow transition-colors hover:bg-accent/90"
                >
                  Request a Quote
                </Link>
              </div>

              <ProductImageGallery images={productImages} productTitle={product.title} />

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
                      <tr className="bg-gray-100 text-left text-gray-500 font-bold uppercase tracking-wider text-xs">
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

      {/* JSON-LD is rendered once on the server for this product page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
    </div>
  );
}
