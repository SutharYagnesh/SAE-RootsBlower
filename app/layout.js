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
import Script from 'next/script';

export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export async function generateMetadata() {
  let metaTitle = 'Roots Blower Manufacturer in India | Twin Lobe & Tri Lobe | Shree Ambika Engineering';
  let metaDesc = 'ISO 9001:2015 roots blower manufacturer in Ahmedabad, Gujarat. Twin lobe, tri lobe and water cooled blowers, 10-10,000 m3/hr. Get a quote today.';

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

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: metaDesc,
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
      siteName: 'Shree Ambika Engineering',
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
    '@type': ['Organization', 'LocalBusiness', 'Manufacturer'],
    '@id': `${siteUrl}/#organization`,
    name: 'Shree Ambika Engineering',
    alternateName: 'SAE',
    url: siteUrl,
    logo: `${siteUrl}/images/sae.png`,
    image: `${siteUrl}/images/sae.png`,
    description: 'Premier Roots Blower Manufacturer in India offering high-efficiency twin lobe and tri-lobe blowers, water cooled blowers, pneumatic conveying systems and cement unloading systems.',
    foundingDate: '2011',
    sameAs: [
      'https://facebook.com/saerootsblower',
      'https://linkedin.com/company/shree-ambika-engineering',
      'https://instagram.com/saerootsblower',
      'https://youtube.com/saerootsblower',
    ],
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
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9VLDYSKHTK');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9VLDYSKHTK"
          strategy="lazyOnload"
        />
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
      </body>
    </html>
  );
}
