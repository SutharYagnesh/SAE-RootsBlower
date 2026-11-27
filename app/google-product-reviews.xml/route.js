import { createHash } from 'node:crypto';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getValidReviews(reviews) {
  return (reviews || []).filter(
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
}

function getReviewXml(product, review) {
  const productUrl = new URL(`/products/${product.slug}`, siteUrl).toString();
  const reviewUrl = `${productUrl}#customer-reviews`;
  const reviewId = createHash('sha256')
    .update(
      `${product._id}\0${review.author}\0${new Date(review.datePublished).toISOString()}\0${review.reviewBody}`
    )
    .digest('hex');

  return `    <review>
      <review_id>${reviewId}</review_id>
      <reviewer>
        <name>${xmlEscape(review.author)}</name>
      </reviewer>
      <review_timestamp>${new Date(review.datePublished).toISOString()}</review_timestamp>
      <content>${xmlEscape(review.reviewBody)}</content>
      <review_url type="group">${xmlEscape(reviewUrl)}</review_url>
      <ratings>
        <overall min="1" max="5">${Number(review.ratingValue)}</overall>
      </ratings>
      <products>
        <product>
          <product_ids>
            <brands>
              <brand>Shree Ambika Engineering</brand>
            </brands>
          </product_ids>
          <product_name>${xmlEscape(product.title)}</product_name>
          <product_url>${xmlEscape(productUrl)}</product_url>
        </product>
      </products>
    </review>`;
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({
      status: 'published',
      'reviews.0': { $exists: true },
    })
      .select('_id title slug reviews')
      .lean();

    const reviews = products.flatMap((product) =>
      getValidReviews(product.reviews).map((review) => getReviewXml(product, review))
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:vc="http://www.w3.org/2007/XMLSchema-versioning"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd">
  <version>2.3</version>
  <publisher>
    <name>Shree Ambika Engineering</name>
    <favicon>${xmlEscape(new URL('/images/sae-logo.webp', siteUrl).toString())}</favicon>
  </publisher>
  <reviews>
${reviews.join('\n')}
  </reviews>
</feed>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=900',
      },
    });
  } catch (error) {
    console.error('Google product reviews feed generation error:', error);
    return new Response('Unable to generate the product reviews feed.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
