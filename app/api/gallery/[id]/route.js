import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gallery item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
