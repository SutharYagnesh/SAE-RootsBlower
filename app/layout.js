import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import CallButton from '@/components/CallButton';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
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
    'Roots Blower Supplier in India',
    'Twin Lobe Roots Blower Manufacturer',
    'Industrial Roots Blower',
    'Roots Blower Price in India',
    'Roots Blower Manufacturer in Gujarat',
    'Roots Blower Manufacturer in Ahmedabad',
    'Bulker Unloading System Manufacturer',
    'Pneumatic Cement Conveying System',
    'Roots Blower Motor Manufacturer',
    'Roots Blower Motor Supplier',
    'Roots Blower Supplier in Dubai',
    'Roots Blower Manufacturer in UAE',
    'Roots Blower Supplier in Saudi Arabia',
    'Twin Lobe Roots Blower Dubai',
    'Bulker Unloading System Supplier in UAE',
    'Industrial Air Blower Supplier in Dubai',
    'Roots Blower Exporter from India',
    'Positive Displacement Blower Manufacturer',
    'Shree Ambika Engineering',
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: metaDesc,
    keywords: keywords.join(', '),
    icons: {
      icon: [
        { url: '/images/sae-logo.webp', type: 'image/webp' }
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
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: 'Shree Ambika Engineering',
    alternateName: 'SAE Roots Blower',
    url: siteUrl,
    logo: `${siteUrl}/images/sae.png`,
    image: `${siteUrl}/images/sae.png`,
    description: 'Leading Roots Blower Manufacturer in India supplying high-performance Twin Lobe Blowers, Water Cooled Blowers, Cement Bulker Unloading Systems, and Roots Blower Motors across India, Dubai, UAE, and Saudi Arabia.',
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
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Oman' },
    ],
    knowsAbout: [
      'Roots Blowers',
      'Twin Lobe Roots Blowers',
      'Tri Lobe Roots Blowers',
      'Water Cooled Blowers',
      'Cement Bulker Unloading Systems',
      'Pneumatic Conveying Systems',
      'Roots Blower Motors',
      'Sewage STP ETP Aeration Blowers',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roots Blowers & Pneumatic Systems',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Twin Lobe Roots Blower',
          url: `${siteUrl}/products/twin-lobe-roots-blower`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Water Treatment Plant Roots Blower',
          url: `${siteUrl}/products/water-treatment-plant-roots-blower`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Cement Bulker Unloading System',
          url: `${siteUrl}/products/cement-bulker-unloading-system`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Roots Blower Motors',
          url: `${siteUrl}/products/roots-blower-motors`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Pneumatic Conveying System',
          url: `${siteUrl}/products/pneumatic-conveying-system`,
        },
      ],
    },
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
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
        <div className="min-h-full flex flex-col font-sans bg-bg-custom text-dark-custom overflow-x-hidden">
          <Navbar />
          <main className="flex-grow pt-[105px] md:pt-[125px]">{children}</main>
          <Footer />
          <ScrollToTop />
          <WhatsAppButton />
          <CallButton />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
