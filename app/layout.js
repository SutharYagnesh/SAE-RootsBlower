import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import CallButton from '@/components/CallButton';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';


const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.findOne({});
    if (settings) {
      return {
        title: settings.metaTitle || 'Shree Ambika Engineering | Leading Roots Blower Manufacturer',
        description: settings.metaDescription || 'Shree Ambika Engineering manufactures premium Twin Lobe and Tri Lobe Roots Blowers.',
      };
    }
  } catch (error) {
    console.error('Metadata generation error:', error);
  }

  return {
    title: 'Shree Ambika Engineering | Leading Roots Blower Manufacturer',
    description: 'Shree Ambika Engineering manufactures premium Twin Lobe and Tri Lobe Roots Blowers for industrial aeration and pneumatic conveying.',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-full flex flex-col font-sans bg-bg-custom text-dark-custom">
          <Navbar />
          <main className="flex-grow pt-[105px] md:pt-[125px]">{children}</main>
          <Footer />
          <ScrollToTop />
          <WhatsAppButton />
          <CallButton />
        </div>
      </body>
    </html>
  );
}
