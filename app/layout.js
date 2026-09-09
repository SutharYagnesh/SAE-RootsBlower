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
  let metaTitle = 'Roots Blower Manufacturer in India | Shree Ambika Engineering';
  let metaDesc = 'Shree Ambika Engineering is a leading Roots Blower Manufacturer in India offering high-performance twin lobe blowers, industrial roots blowers & positive displacement blowers.';

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
    'Roots Blower Manufacturer in India',
    'Roots Blower Manufacturer',
    'Twin Lobe Blower Manufacturer',
    'Roots Blower Supplier in India',
    'Industrial Roots Blower',
    'Positive Displacement Blower Manufacturer',
    'Roots Blower Manufacturer in Ahmedabad',
    'Roots Blower Manufacturer in Gujarat',
    'Roots Blower Price in India',
    'Roots Blower Supplier',
    'Roots Blower Quotation',
    'Buy Roots Blower',
    'Shree Ambika Engineering',
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: metaDesc,
    keywords: keywords.join(', '),
    icons: {
      icon: [
        { url: '/images/sae.png', type: 'image/png' }
      ],
      shortcut: '/images/sae.png',
      apple: '/images/sae.png',
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
          url: `${siteUrl}/images/sae.png`,
          width: 800,
          height: 600,
          alt: 'Shree Ambika Engineering Logo',
        },
        {
          url: `${siteUrl}/images/about-us/about-us-2.webp`,
          width: 1200,
          height: 630,
          alt: 'Roots Blower Manufacturer in India - Shree Ambika Engineering',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [`${siteUrl}/images/sae.png`],
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
    logo: `${siteUrl}/images/sae.png`,
    image: `${siteUrl}/images/sae.png`,
    description: 'Premier Roots Blower Manufacturer in India offering high-efficiency Twin Lobe & Tri Lobe Blowers, Vacuum Blowers, and Cement Feeding Machine Systems.',
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
        <link rel="icon" href="/images/sae.png" type="image/png" />
        <link rel="shortcut icon" href="/images/sae.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/sae.png" />
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


