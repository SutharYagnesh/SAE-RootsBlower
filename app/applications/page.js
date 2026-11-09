import Link from 'next/link';
import { applicationsList } from '@/lib/applicationsData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Roots Blower Industrial Applications | 12 Industrial Sectors | SAE',
  description: 'Explore industrial process applications of positive displacement rotary lobe Roots blowers by Shree Ambika Engineering: cement plants, STP/ETP aeration, chemical processing, pneumatic conveying, and food manufacturing.',
  keywords: 'Roots blower applications, sewage aeration blower, aquaculture pond aeration, pneumatic conveying blower, cement plant roots blower, industrial blower uses India',
  alternates: {
    canonical: `${siteUrl}/applications`,
  },
  openGraph: {
    title: 'Roots Blower Industrial Applications | Shree Ambika Engineering',
    description: 'Discover how Shree Ambika Engineering positive displacement blowers power essential processes across 12 industrial manufacturing sectors.',
    url: `${siteUrl}/applications`,
    siteName: 'SAE Roots Blower',
    images: [{ url: `${siteUrl}/images/sae-logo.webp` }],
  },
};

export default function ApplicationsPage() {
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
        name: 'Industrial Applications',
        item: `${siteUrl}/applications`,
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

      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="text-xs text-white/60 mb-4 flex items-center space-x-2">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <span className="text-white">Applications</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading mb-4 tracking-tight">
            Industrial Applications & Engineering Solutions
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-3xl leading-relaxed">
            Discover how Shree Ambika Engineering positive displacement Roots blowers deliver continuous, 100% oil-free air to optimize efficiency and minimize downtime across 12 key industrial sectors.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applicationsList.map((app) => (
              <div
                key={app.slug}
                className="bg-white border border-borders-custom p-8 rounded-xl shadow-sm hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="text-3xl font-extrabold font-heading text-accent/40 mb-3 group-hover:text-accent transition-colors">
                    {app.icon}
                  </div>
                  <h2 className="text-xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors">
                    {app.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {app.shortDesc}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/applications/${app.slug}`}
                    className="inline-flex items-center text-primary font-bold hover:text-accent border-b-2 border-primary/20 hover:border-accent pb-1 text-sm transition-all"
                  >
                    <span>Engineering Specs & Suitable Blowers</span>
                    <span className="ml-2 font-normal">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
