import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocation, locationsList } from '@/lib/locationsData';
import {
  FaMapMarkerAlt,
  FaIndustry,
  FaShippingFast,
  FaTemperatureHigh,
  FaCheckCircle,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaQuestionCircle,
} from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export async function generateStaticParams() {
  return locationsList.map((loc) => ({
    region: loc.region,
    city: loc.city,
  }));
}

export async function generateMetadata({ params }) {
  const { region, city } = await params;
  const data = getLocation(region, city);

  if (!data) {
    return { title: 'Location Not Found | Shree Ambika Engineering' };
  }

  const canonicalUrl = `${siteUrl}/locations/${data.region}/${data.city}`;

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    keywords: data.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDesc,
      url: canonicalUrl,
      siteName: 'SAE Roots Blower',
      images: [
        {
          url: `${siteUrl}/images/sae-logo.webp`,
          width: 800,
          height: 600,
          alt: `${data.title} - Shree Ambika Engineering`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function LocationDetailPage({ params }) {
  const { region, city } = await params;
  const data = getLocation(region, city);

  if (!data) {
    notFound();
  }

  const isInternational = data.region === 'international';

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
        name: 'Supply Network',
        item: `${siteUrl}/locations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.cityName,
        item: `${siteUrl}/locations/${data.region}/${data.city}`,
      },
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'IndustrialBusiness',
    '@id': `${siteUrl}/locations/${data.region}/${data.city}/#business`,
    name: `Shree Ambika Engineering - ${data.cityName}`,
    url: `${siteUrl}/locations/${data.region}/${data.city}`,
    logo: `${siteUrl}/images/sae-logo.webp`,
    image: `${siteUrl}/images/sae.png`,
    description: data.metaDesc,
    telephone: '+91-6354586037',
    priceRange: '₹₹₹',
    areaServed: {
      '@type': isInternational ? 'Country' : 'AdministrativeArea',
      name: data.countryName,
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Shree Ambika Engineering',
      url: siteUrl,
    },
  };

  const faqSchema = data.faqs && data.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const whatsappMessage = encodeURIComponent(
    `Hello Shree Ambika Engineering, I am contacting you regarding your Roots Blowers & equipment supply for ${data.cityName}. Please share product catalog and quotation.`
  );

  return (
    <div className="bg-bg-custom min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c'),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-borders-custom py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-primary">Supply Network</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{data.cityName}</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-primary via-primary to-[#08223c] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <FaMapMarkerAlt size={13} />
            <span>{isInternational ? `GCC Export Market · ${data.countryName}` : `Domestic Supply Hub · ${data.countryName}`}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading mb-4 tracking-tight leading-tight">
            {data.headline}
          </h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed mb-8">
            {data.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/916354586037?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg text-sm font-bold shadow transition-all"
            >
              <FaWhatsapp size={18} />
              <span>Inquire for {data.cityName}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-primary px-5 py-3 rounded-lg text-sm font-bold shadow transition-all"
            >
              <FaEnvelope size={15} />
              <span>Request Factory Quotation</span>
            </Link>
            <a
              href="tel:+916354586037"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-semibold border border-white/20 transition-all"
            >
              <FaPhoneAlt size={14} />
              <span>+91 63545 86037</span>
            </a>
          </div>
        </div>
      </section>

      {/* Engineering & Logistics Specifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-md space-y-2">
            <div className="flex items-center space-x-2 text-accent">
              <FaIndustry size={18} />
              <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Industrial Corridors</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {data.industrialCorridors}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-md space-y-2">
            <div className="flex items-center space-x-2 text-accent">
              <FaTemperatureHigh size={18} />
              <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Climate Engineering</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {data.climateConsiderations}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-borders-custom shadow-md space-y-2">
            <div className="flex items-center space-x-2 text-accent">
              <FaShippingFast size={18} />
              <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Freight & Logistics</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {data.logistics}
            </p>
          </div>
        </div>
      </div>

      {/* Core Products for this Region */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-borders-custom shadow-sm space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary">
              Recommended Products for {data.cityName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manufactured to ISO quality standards, tested for vibration, noise, and pressure integrity before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.keyProducts.map((prod, idx) => (
              <div
                key={idx}
                className="border border-borders-custom hover:border-accent p-6 rounded-xl flex flex-col justify-between hover:shadow-md transition-all bg-bg-custom/30 group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    100% Oil-Free
                  </span>
                  <h3 className="text-lg font-bold font-heading text-primary mt-3 group-hover:text-accent transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Capacity/Rating:</strong> {prod.capacity}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="text-xs font-bold text-primary hover:text-accent underline"
                  >
                    View Specs & Quote →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Export & Supply Assurance */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-heading text-primary flex items-center space-x-2">
              <FaCheckCircle className="text-green-600" />
              <span>Direct Manufacturer Advantage for Buyers in {data.cityName}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
              <div className="space-y-2">
                <p>✔ <strong>Direct Factory Sourcing:</strong> Eliminate trader and agent markups with transparent manufacturer pricing directly from our Vatva GIDC production facility.</p>
                <p>✔ <strong>Customized Pressure Ratings:</strong> Every blower is dynamically matched to your specific piping resistance and discharge head (0.1 to 1.2 kg/cm²).</p>
              </div>
              <div className="space-y-2">
                <p>✔ <strong>Full Spare Parts Availability:</strong> Timing gears, labyrinth seals, and bearings stocked for fast dispatch to avoid process downtime.</p>
                <p>✔ <strong>Export Documentation:</strong> Complete Certificate of Origin, inspection test certificates, and Chamber attestations included with international shipments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location FAQs */}
        {data.faqs && data.faqs.length > 0 && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-borders-custom shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary flex items-center space-x-2">
              <FaQuestionCircle className="text-accent" />
              <span>Frequently Asked Questions – {data.cityName} Supply</span>
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="bg-bg-custom/50 border border-borders-custom rounded-xl p-5 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold font-heading text-primary flex items-start space-x-2">
                    <span className="text-accent font-extrabold">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-primary to-[#08223c] text-white p-8 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading">
              Request Delivery Timeline & Pricing for {data.cityName}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl">
              Get in touch directly with our application engineers for sizing calculations, CAD drawings, and an official commercial quotation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/916354586037?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg text-xs sm:text-sm font-bold shadow transition-all"
            >
              <FaWhatsapp size={16} />
              <span>WhatsApp Inquiry</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-primary px-5 py-3 rounded-lg text-xs sm:text-sm font-bold shadow transition-all"
            >
              <FaEnvelope size={14} />
              <span>Submit RFQ Form</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

