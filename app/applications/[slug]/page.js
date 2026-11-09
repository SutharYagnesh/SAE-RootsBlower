import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaIndustry, FaInfoCircle, FaFileContract, FaRegLightbulb, FaWhatsapp, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import { getApplicationBySlug, applicationsList } from '@/lib/applicationsData';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getApplicationBySlug(slug);

  if (!data) {
    return { title: 'Application Not Found | Shree Ambika Engineering' };
  }

  const canonicalUrl = `${siteUrl}/applications/${data.slug}`;

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
      type: 'article',
    },
  };
}

export default async function ApplicationDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;
  const data = getApplicationBySlug(slug);

  if (!data) {
    notFound();
  }

  // Find products that match this application title dynamically or fetch published products
  const keyword = data.title.split(' ')[0];
  const matchRegex = new RegExp(keyword, 'i');
  let suitableProducts = await Product.find({
    status: 'published',
    $or: [
      { applications: { $regex: matchRegex } },
      { title: { $regex: matchRegex } },
    ],
  }).limit(4);

  if (suitableProducts.length === 0) {
    suitableProducts = await Product.find({ status: 'published' }).limit(4);
  }

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
        name: 'Applications',
        item: `${siteUrl}/applications`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: `${siteUrl}/applications/${data.slug}`,
      },
    ],
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
    `Hello Shree Ambika Engineering, I need engineering information and a quote for Roots Blowers used in ${data.title}. Please share specifications and pricing.`
  );

  return (
    <div className="bg-bg-custom min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-borders-custom py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/applications" className="hover:text-primary">Applications</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{data.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-borders-custom shadow-sm space-y-10">
          {/* Header Info */}
          <div>
            <div className="inline-flex items-center space-x-2 text-accent bg-accent/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <FaIndustry size={14} />
              <span>Industrial Process Guide</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-primary leading-tight">
              {data.title}
            </h1>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4 whitespace-pre-line">
              {data.overview}
            </p>
          </div>

          {/* Key Engineering Requirements */}
          <div className="border-t border-gray-100 pt-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-primary flex items-center space-x-2">
              <FaFileContract className="text-accent" />
              <span>Critical Engineering & Design Requirements</span>
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {data.requirements.map((req, idx) => {
                const parts = req.split(':');
                const boldPart = parts[0];
                const restPart = parts.slice(1).join(':');
                return (
                  <li key={idx} className="flex items-start space-x-3 bg-bg-custom/60 p-3 rounded-lg border border-borders-custom/50">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2"></span>
                    <span>
                      <strong className="text-primary font-semibold">{boldPart}:</strong> {restPart}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Technical Tips Callout */}
          <div className="bg-primary/5 border border-primary/15 p-6 rounded-xl space-y-2 flex items-start space-x-4">
            <FaRegLightbulb className="text-accent mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-heading font-bold text-primary text-base">Engineering Selection Advice</h3>
              <p className="text-gray-700 text-sm leading-relaxed mt-1">{data.technicalTips}</p>
            </div>
          </div>

          {/* Suitable Products Grid */}
          <div className="border-t border-gray-100 pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl font-bold font-heading text-primary flex items-center space-x-2">
                <FaInfoCircle className="text-primary" />
                <span>Recommended Roots Blowers & Equipment</span>
              </h2>
              <Link href="/products" className="text-xs font-bold text-accent hover:underline">
                View All Industrial Products →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suitableProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="border border-borders-custom hover:border-accent p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-all bg-white"
                >
                  <div>
                    <h3 className="font-heading font-bold text-primary text-base">{prod.title}</h3>
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">{prod.shortDescription}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[11px] bg-green-50 text-green-700 px-2.5 py-1 rounded font-semibold">100% Oil-Free</span>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-xs font-bold text-primary hover:text-accent underline"
                    >
                      Specifications & Quote →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application FAQs */}
          {data.faqs && data.faqs.length > 0 && (
            <div className="border-t border-gray-100 pt-8 space-y-6">
              <h2 className="text-xl font-bold font-heading text-primary flex items-center space-x-2">
                <FaQuestionCircle className="text-accent" />
                <span>Frequently Asked Questions – {data.title}</span>
              </h2>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-bg-custom/50 border border-borders-custom rounded-xl p-5 space-y-2">
                    <h3 className="text-sm font-bold font-heading text-primary flex items-start space-x-2">
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

          {/* Inquiry / Action Banner */}
          <div className="bg-gradient-to-r from-primary to-[#08223c] text-white p-6 sm:p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold font-heading">
                Require Engineering Sizing for Your Facility?
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                Our application engineers will calculate your required air mass flow (CFM / m³/hr) and pressure head.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/916354586037?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow"
              >
                <FaWhatsapp size={16} />
                <span>Inquire on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-primary px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow"
              >
                <FaEnvelope size={14} />
                <span>Request Custom Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
