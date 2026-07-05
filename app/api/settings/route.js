import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    let settings = await Settings.findOne({});

    if (!settings) {
      // Create default settings if not exists
      settings = new Settings({});
      await settings.save();
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    let settings = await Settings.findOne({});

    if (!settings) {
      settings = new Settings(data);
    } else {
      // Update fields
      settings.companyName = data.companyName !== undefined ? data.companyName : settings.companyName;
      settings.address = data.address !== undefined ? data.address : settings.address;
      settings.phone = data.phone !== undefined ? data.phone : settings.phone;
      settings.email = data.email !== undefined ? data.email : settings.email;
      settings.whatsappNumber = data.whatsappNumber !== undefined ? data.whatsappNumber : settings.whatsappNumber;
      settings.socialLinks = data.socialLinks !== undefined ? data.socialLinks : settings.socialLinks;
      settings.logo = data.logo !== undefined ? data.logo : settings.logo;
      settings.favicon = data.favicon !== undefined ? data.favicon : settings.favicon;
      settings.metaTitle = data.metaTitle !== undefined ? data.metaTitle : settings.metaTitle;
      settings.metaDescription = data.metaDescription !== undefined ? data.metaDescription : settings.metaDescription;
      settings.googleAnalyticsId = data.googleAnalyticsId !== undefined ? data.googleAnalyticsId : settings.googleAnalyticsId;
      settings.googleMapEmbed = data.googleMapEmbed !== undefined ? data.googleMapEmbed : settings.googleMapEmbed;
    }

    await settings.save();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
