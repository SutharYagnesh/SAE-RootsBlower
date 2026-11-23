import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { slug, imageIndex } = await params;
    const index = Number(imageIndex);

    if (!Number.isInteger(index) || index < 0) {
      return new Response('Image not found.', { status: 404 });
    }

    const product = await Product.findOne({ slug, status: 'published' })
      .select('images')
      .lean();
    const image = product?.images?.[index];
    const match =
      typeof image === 'string' &&
      image.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([a-z0-9+/=\s]+)$/i);

    if (!match) {
      return new Response('Image not found.', { status: 404 });
    }

    const buffer = Buffer.from(match[2], 'base64');
    if (!buffer.length) {
      return new Response('Image not found.', { status: 404 });
    }

    return new Response(buffer, {
      headers: {
        'Content-Type': match[1].toLowerCase(),
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Merchant Center product image error:', error);
    return new Response('Unable to load the product image.', { status: 500 });
  }
}
