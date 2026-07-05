import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Check if ID is a Mongoose ObjectId or slug
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    let product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If title has changed and slug wasn't manually overridden, update slug
    if (data.title && data.title !== product.title) {
      let baseSlug = slugify(data.title);
      let slug = baseSlug;
      let count = 1;
      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      product.slug = slug;
    }

    // Update other fields
    product.title = data.title !== undefined ? data.title : product.title;
    product.shortDescription = data.shortDescription !== undefined ? data.shortDescription : product.shortDescription;
    product.longDescription = data.longDescription !== undefined ? data.longDescription : product.longDescription;
    product.specifications = data.specifications !== undefined ? data.specifications : product.specifications;
    product.features = data.features !== undefined ? data.features : product.features;
    product.applications = data.applications !== undefined ? data.applications : product.applications;
    product.images = data.images !== undefined ? data.images : product.images;
    product.seoTitle = data.seoTitle !== undefined ? data.seoTitle : product.seoTitle;
    product.seoDescription = data.seoDescription !== undefined ? data.seoDescription : product.seoDescription;
    product.status = data.status !== undefined ? data.status : product.status;

    await product.save();
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
