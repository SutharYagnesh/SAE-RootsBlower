import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
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

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const adminMode = searchParams.get('admin') === 'true';

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

    if (category && category !== 'All') {
      query.category = category;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Fetch blogs error:', error);
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
    const { title, content, excerpt, featuredImage, category, tags, status } = data;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      featuredImage: featuredImage || '',
      category: category || 'General',
      tags: tags || [],
      seoTitle: data.seoTitle || title,
      seoDescription: data.seoDescription || excerpt,
      status: status || 'draft',
    });

    await newBlog.save();
    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
