import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Fetch gallery error:', error);
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
    const { title, category, type, image, videoUrl } = data;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    if (type === 'image' && !image) {
      return NextResponse.json(
        { error: 'Base64 image is required for image type' },
        { status: 400 }
      );
    }

    if (type === 'video' && !videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required for video type' },
        { status: 400 }
      );
    }

    const newItem = new Gallery({
      title,
      category,
      type: type || 'image',
      image: type === 'image' ? image : '',
      videoUrl: type === 'video' ? videoUrl : '',
    });

    await newItem.save();
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Create gallery item error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
