import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import GalleryClient from '@/components/GalleryClient';
import Link from 'next/link';

export const metadata = {
  title: 'Media Gallery | Shree Ambika Engineering',
  description: 'View photos and videos of our manufacturing facility, CNC machinery, product lines, and heavy-duty roots blower quality testing systems at Vatva, Ahmedabad.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  await connectDB();
  const items = await Gallery.find({}).sort({ createdAt: -1 });

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Factory & Media Gallery</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            A visual overview of our manufacturing facilities, machining tools, and finished blower setups.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white border border-borders-custom rounded-xl">
              <p className="text-gray-500">No gallery items uploaded yet.</p>
              <Link
                href="/api/seed"
                className="mt-4 bg-primary text-white px-6 py-2.5 rounded hover:bg-accent hover:text-primary transition-colors inline-block"
              >
                Run Database Seeder
              </Link>
            </div>
          ) : (
            <GalleryClient initialItems={JSON.parse(JSON.stringify(items))} />
          )}
        </div>
      </section>
    </div>
  );
}
