import Link from 'next/link';
import { locationsList } from '@/lib/locationsData';
import { FaMapMarkerAlt, FaGlobeAmericas, FaIndustry, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Global Supply & Distribution Network | India, UAE, Dubai & Saudi Arabia | SAE',
  description: 'Shree Ambika Engineering distributes high-performance Roots blowers, cement bulker unloading systems, and aeration blowers across India (Ahmedabad, Mumbai, Delhi, Chennai) and GCC (Dubai, UAE, Saudi Arabia, Qatar, Oman).',
  keywords: 'Roots Blower Manufacturer India, Roots Blower Supplier Dubai, Roots Blower UAE, Roots Blower Saudi Arabia, Bulker Unloading System Supplier UAE, Industrial Air Blower Exporter',
  alternates: {
    canonical: `${siteUrl}/locations`,
  },
  openGraph: {
    title: 'Global Industrial Roots Blower Supply Network | SAE',
    description: 'Direct factory supply and international export network covering India and GCC industrial hubs.',
    url: `${siteUrl}/locations`,
    siteName: 'SAE Roots Blower',
    images: [{ url: `${siteUrl}/images/sae-logo.webp` }],
  },
};

export default function LocationsOverviewPage() {
  const domesticLocations = locationsList.filter((loc) => loc.region === 'india');
  const internationalLocations = locationsList.filter((loc) => loc.region === 'international');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Supply Network & Locations',
        item: `${siteUrl}/locations`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Hero Header */}
      <section className="bg-primary text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="text-xs text-white/60 mb-4 flex items-center space-x-2">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <span className="text-white">Supply Network</span>
          </nav>
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <FaGlobeAmericas size={14} />
            <span>National Distribution & International Exports</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading mb-4 tracking-tight">
            Roots Blower Supply Hubs: India & GCC Markets
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-3xl leading-relaxed">
            From our primary manufacturing facility in Vatva GIDC, Ahmedabad, Shree Ambika Engineering delivers high-capacity twin-lobe blowers, bulker unloading machines, and pneumatic conveying systems to key industrial centers across India, the United Arab Emirates, Saudi Arabia, Qatar, and Oman.
          </p>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="bg-white border-b border-borders-custom py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="flex items-center space-x-3">
              <FaShippingFast className="text-accent text-2xl flex-shrink-0" />
              <div>
                <strong className="block text-primary">Rapid Port Logistics</strong>
                <span>4-6 days sea transit from Gujarat to Jebel Ali & GCC ports.</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaIndustry className="text-accent text-2xl flex-shrink-0" />
              <div>
                <strong className="block text-primary">Direct Factory Sourcing</strong>
                <span>Zero middleman markups; full factory warranty and spare parts.</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-accent text-2xl flex-shrink-0" />
              <div>
                <strong className="block text-primary">Middle East Climate Ready</strong>
                <span>Specialized 50°C+ ambient heat dissipation & dual 50/60Hz motors.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Location Grids */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* International GCC Hubs */}
        <div>
          <div className="border-b-2 border-accent/30 pb-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-primary flex items-center space-x-3">
              <FaGlobeAmericas className="text-accent" />
              <span>International Export Hubs (Dubai, UAE & Gulf Countries)</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Serving industrial contractors, cement plants, and municipal water authorities across the GCC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalLocations.map((loc) => (
              <div
                key={loc.city}
                className="bg-white border border-borders-custom p-6 rounded-xl shadow-sm hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded">
                      {loc.countryName}
                    </span>
                    <FaMapMarkerAlt className="text-gray-400 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-primary mb-2 group-hover:text-accent transition-colors">
                    {loc.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {loc.subheadline}
                  </p>
                  <div className="text-[11px] text-gray-500 bg-bg-custom p-2.5 rounded-lg border border-borders-custom/50 mb-4">
                    <strong>Transit Time:</strong> {loc.logistics.split(';')[0]}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/locations/${loc.region}/${loc.city}`}
                    className="inline-flex items-center text-primary font-bold hover:text-accent text-xs underline group-hover:no-underline"
                  >
                    <span>View Specifications & Local Support</span>
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domestic Indian Industrial Hubs */}
        <div>
          <div className="border-b-2 border-accent/30 pb-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-primary flex items-center space-x-3">
              <FaMapMarkerAlt className="text-accent" />
              <span>Domestic Industrial Centers (India)</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Direct factory supply, next-day dispatch, and on-site commissioning across key manufacturing belts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domesticLocations.map((loc) => (
              <div
                key={loc.city}
                className="bg-white border border-borders-custom p-6 rounded-xl shadow-sm hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                      {loc.countryName}
                    </span>
                    <FaMapMarkerAlt className="text-gray-400 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-primary mb-2 group-hover:text-accent transition-colors">
                    {loc.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {loc.subheadline}
                  </p>
                  <div className="text-[11px] text-gray-500 bg-bg-custom p-2.5 rounded-lg border border-borders-custom/50 mb-4">
                    <strong>Coverage:</strong> {loc.industrialCorridors}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/locations/${loc.region}/${loc.city}`}
                    className="inline-flex items-center text-primary font-bold hover:text-accent text-xs underline group-hover:no-underline"
                  >
                    <span>View Specifications & Local Support</span>
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

