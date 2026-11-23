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

function isValidImage(image) {
  if (typeof image !== 'string' || !image.trim()) {
    return false;
  }

  if (/^data:image\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(image)) {
    return true;
  }

  try {
    const url = new URL(image, siteUrl);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function getImageLink(image, slug, index) {
  if (/^data:image\//i.test(image)) {
    return new URL(
      `/merchant-feed/images/${encodeURIComponent(slug)}/${index}`,
      siteUrl
    ).toString();
  }

  const imageUrl = new URL(image, siteUrl);
  const siteHost = new URL(siteUrl).hostname;
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
}

function getOfferXml(product, offer, offerIndex, imageUrl) {
  const title =
    product.offers.length > 1 ? `${product.title} - ${offer.name}` : product.title;
  const itemId = `${product._id}-${offerIndex + 1}`;

  return `    <item>
      <g:id>${xmlEscape(itemId)}</g:id>
      <g:title>${xmlEscape(title)}</g:title>
      <g:description>${xmlEscape(product.shortDescription)}</g:description>
      <g:link>${xmlEscape(new URL(`/products/${product.slug}`, siteUrl).toString())}</g:link>
      <g:image_link>${xmlEscape(imageUrl)}</g:image_link>
      <g:availability>${xmlEscape(product.merchantAvailability)}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${Number(offer.price).toFixed(2)} INR</g:price>
      <g:brand>Shree Ambika Engineering</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({
      status: 'published',
      merchantAvailability: { $in: ['in_stock', 'out_of_stock'] },
      offers: { $elemMatch: { price: { $gt: 0 } } },
      images: { $exists: true, $ne: [] },
    })
      .select('_id title slug shortDescription images offers merchantAvailability')
      .lean();

    const items = products.flatMap((product) => {
      const imageIndex = product.images.findIndex(isValidImage);
      if (imageIndex < 0) {
        return [];
      }

      const imageUrl = getImageLink(
        product.images[imageIndex],
        product.slug,
        imageIndex
      );

      return (product.offers || [])
        .map((offer, offerIndex) => ({ offer, offerIndex }))
        .filter(
          ({ offer }) =>
            offer &&
            typeof offer.name === 'string' &&
            offer.name.trim() &&
            Number.isFinite(Number(offer.price)) &&
            Number(offer.price) > 0
        )
        .map(({ offer, offerIndex }) =>
          getOfferXml(product, offer, offerIndex, imageUrl)
        );
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Shree Ambika Engineering Product Feed</title>
    <link>${xmlEscape(siteUrl)}</link>
    <description>Published industrial blower products with current prices and confirmed availability.</description>
${items.join('\n')}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=900',
      },
    });
  } catch (error) {
    console.error('Merchant Center feed generation error:', error);
    return new Response('Unable to generate the product feed.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
