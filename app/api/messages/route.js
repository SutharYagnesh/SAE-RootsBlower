import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Populate product if referenced
    const messages = await Message.find({})
      .populate('product', 'title slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { name, email, phone, subject, message, product } = data;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required' },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
      product: product || undefined,
      isRead: false,
    });

    await newMessage.save();
    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit inquiry error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
