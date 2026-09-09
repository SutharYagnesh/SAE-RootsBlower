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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export async function generateMetadata() {
  let metaTitle = 'Root Blower Manufacturer in India | SAE Roots Blower';
  let metaDesc = 'Leading root blower manufacturer in India offering premium three lobe roots blowers, positive displacement blowers, vacuum blowers, cement feeding machine systems, and industrial aeration solutions.';

  try {
    await connectDB();
    const settings = await Settings.findOne({});
    if (settings) {
      metaTitle = settings.metaTitle || metaTitle;
      metaDesc = settings.metaDescription || metaDesc;
    }
  } catch (error) {
    console.error('Metadata generation error:', error);
  }

  const keywords = [
    'root blower manufacturer',
    'roots blower manufacturer',
    'three lobe roots blower',
    'twin lobe roots blower',
    'industrial roots blower',
    'positive displacement blower',
    'roots blower supplier',
    'roots blower exporter',
    'cement feeding machine system',
    'wastewater treatment blower',
    'pneumatic conveying blower',
    'air cooled roots blower',
    'vacuum blower manufacturer India',
    'Shree Ambika Engineering',
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: metaDesc,
    keywords: keywords.join(', '),
    icons: {
      icon: [
        { url: '/images/sae-logo.webp', type: 'image/webp' },
        { url: '/favicon.ico' }
      ],
      shortcut: '/images/sae-logo.webp',
      apple: '/images/sae-logo.webp',
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: siteUrl,
      siteName: 'SAE Roots Blower',
      images: [
        {
          url: `${siteUrl}/images/sae-logo.webp`,
          width: 800,
          height: 600,
          alt: 'Shree Ambika Engineering Logo',
        },
        {
          url: `${siteUrl}/images/banner/sae-banner-1.webp`,
          width: 1200,
          height: 630,
          alt: 'SAE Industrial Roots Blower Systems',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [`${siteUrl}/images/sae-logo.webp`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'Shree Ambika Engineering',
    alternateName: 'SAE Roots Blower',
    url: siteUrl,
    logo: `${siteUrl}/images/sae-logo.webp`,
    image: `${siteUrl}/images/sae-logo.webp`,
    description: 'Leading manufacturer of Roots Blowers, Three Lobe Air Blowers, Twin Lobe Blowers, Cement Feeding Machine Systems, and Vacuum Blowers in India.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '382418',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.9731811',
      longitude: '72.6273467',
    },
    telephone: '+91 63545 86037',
    priceRange: '₹₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SAE Roots Blower',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased overflow-x-hidden`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/sae-logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/images/sae-logo.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <div className="min-h-full flex flex-col font-sans bg-bg-custom text-dark-custom overflow-x-hidden">
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

