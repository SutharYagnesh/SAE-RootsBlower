import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

// Helper to generate a unique slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const adminMode = searchParams.get('admin') === 'true';

    // If adminMode is true, verify user
    if (adminMode) {
      const decoded = await getAuthUser(req);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const query = {};
    if (status) {
      query.status = status;
    } else if (!adminMode) {
      query.status = 'published';
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, shortDescription, longDescription, specifications, features, applications, images, status } = data;

    if (!title || !shortDescription) {
      return NextResponse.json(
        { error: 'Title and short description are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const newProduct = new Product({
      title,
      slug,
      shortDescription,
      longDescription,
      specifications: specifications || [],
      features: features || [],
      applications: applications || [],
      images: images || [],
      seoTitle: data.seoTitle || title,
      seoDescription: data.seoDescription || shortDescription,
      status: status || 'draft',
    });

    await newProduct.save();
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
