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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Fetch blog detail error:', error);
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

    let blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    if (data.title && data.title !== blog.title) {
      let baseSlug = slugify(data.title);
      let slug = baseSlug;
      let count = 1;
      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      blog.slug = slug;
    }

    blog.title = data.title !== undefined ? data.title : blog.title;
    blog.content = data.content !== undefined ? data.content : blog.content;
    blog.excerpt = data.excerpt !== undefined ? data.excerpt : blog.excerpt;
    blog.featuredImage = data.featuredImage !== undefined ? data.featuredImage : blog.featuredImage;
    blog.category = data.category !== undefined ? data.category : blog.category;
    blog.tags = data.tags !== undefined ? data.tags : blog.tags;
    blog.seoTitle = data.seoTitle !== undefined ? data.seoTitle : blog.seoTitle;
    blog.seoDescription = data.seoDescription !== undefined ? data.seoDescription : blog.seoDescription;
    blog.status = data.status !== undefined ? data.status : blog.status;

    await blog.save();
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Update blog error:', error);
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
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
