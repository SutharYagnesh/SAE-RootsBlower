import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Settings from '@/models/Settings';
import Link from 'next/link';
import Image from 'next/image';
import HomeContactForm from '@/components/HomeContactForm';
import { FaCogs, FaAward, FaShieldAlt, FaArrowRight, FaIndustry, FaCheckCircle } from 'react-icons/fa';
import {
  FadeUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  ClientTicker,
} from '@/components/FramerMotionWrappers';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Roots Blower Manufacturer in India | Twin Lobe & Tri Lobe Blowers – Shree Ambika Engineering',
  description: 'ISO 9001:2015 certified Roots blower manufacturer in Ahmedabad. Twin lobe, tri lobe and water cooled blowers, 10–10,000 m³/hr. Get a quote today.',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    title: 'Roots Blower Manufacturer in India | Shree Ambika Engineering',
    description: 'ISO 9001:2015 certified Roots blower manufacturer in Ahmedabad. Twin lobe, tri lobe and water cooled blowers. Get a quote today.',
    url: `${siteUrl}/`,
    siteName: 'Shree Ambika Engineering',
    locale: 'en_IN',
    images: [{
      url: `${siteUrl}/images/about-us/about-us-2.webp`,
      width: 1200,
      height: 630,
      alt: 'Twin lobe Roots blower assembly at Shree Ambika Engineering, Ahmedabad',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roots Blower Manufacturer in India | Shree Ambika Engineering',
    description: 'ISO 9001:2015 certified Roots blower manufacturer in Ahmedabad.',
    images: [`${siteUrl}/images/about-us/about-us-2.webp`],
  },
};

const homepageFaqs = [
  {
    question: 'What is a Roots blower?',
    answer: 'A Roots blower is a positive displacement blower with two or three lobed rotors that move a fixed volume of air per rotation. It is commonly used to provide oil-free air at low to medium pressure.',
  },
  {
    question: 'What determines the price of a Roots blower in India?',
    answer: 'Price depends on airflow, operating pressure, motor power, construction material, cooling method and accessories. Share your requirements to receive a quotation with technical specifications.',
  },
  {
    question: 'What is the difference between twin lobe and tri lobe Roots blowers?',
    answer: 'Twin lobe blowers use two lobes per rotor. Tri lobe blowers use three, which can reduce pressure pulsation and noise. The right option depends on the process and operating conditions.',
  },
  {
    question: 'Which Roots blower is suitable for sewage treatment plant aeration?',
    answer: 'Twin lobe or tri lobe blowers can be configured for continuous aeration. Selection depends on airflow demand, tank depth, diffuser type and site conditions.',
  },
  {
    question: 'How do I select the right Roots blower?',
    answer: 'Selection requires airflow, operating pressure or tank depth, gas type, duty cycle, ambient temperature and noise limits. Our engineers can review these details and recommend a suitable configuration.',
  },
  {
    question: 'Do you supply Roots blowers outside India?',
    answer: 'Shree Ambika Engineering supplies equipment to customers in India and international markets, including the UAE, Saudi Arabia, Qatar and Oman.',
  },
  {
    question: 'Do you supply Roots blower spare parts and service support?',
    answer: 'Yes. Contact our sales team for information about compatible spare parts and service support for your blower.',
  },
];

export default async function Home() {
  await connectDB();

  const [products, quoteProducts, blogs, savedSettings] = await Promise.all([
    Product.find({ status: 'published' })
      .select('title slug shortDescription specifications images sourceCategory sourceCategories sourcePrice')
      .limit(4),
    Product.find({ status: 'published' })
      .select('title')
      .sort({ title: 1 }),
    Blog.find({ status: 'published' })
      .select('title slug excerpt category featuredImage createdAt')
      .sort({ createdAt: -1 })
      .limit(3),
    Settings.findOne({}),
  ]);

  const settings = savedSettings || {
    phone: '+91 63545 86037, +91 81550 78276',
    email: 'sales@saerootsblower.com',
    address:
      'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India',
    googleMapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7346.752869004515!2d72.62734677770999!3d22.973181100000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e89b0e7cd54e5%3A0xd3ceb43cc42a6433!2sShree%20Ambika%20Engineering%2C%20Root%20blower%20manufacturer!5e0!3m2!1sen!2sus!4v1784869188802!5m2!1sen!2sus',
    metaTitle: 'Roots Blower Manufacturer in India | Twin Lobe & Tri Lobe | Shree Ambika Engineering',
    metaDescription: 'ISO 9001:2015 roots blower manufacturer in Ahmedabad, Gujarat. Twin lobe, tri lobe and water cooled blowers, 10-10,000 m3/hr. Get a quote today.',
  };
  const primaryPhone = (settings.phone || '+91 63545 86037').split(',')[0].trim();
  const phoneLink = primaryPhone.replace(/[^\d+]/g, '');
  const whatsappNumber = (settings.whatsappNumber || '+916354586037').replace(/\D/g, '');

  const industries = [
    {
      name: 'Wastewater Treatment',
      slug: 'wastewater-treatment-plants',
      desc: 'Continuous aeration air supply for municipal sewage and industrial effluent treatment plants.',
      image: '/images/innerpage/application/sewage-plant.webp',
      imageAlt: 'Aeration tank at a wastewater treatment plant',
    },
    {
      name: 'Aquaculture Aeration',
      slug: 'aquaculture-fish-farming',
      desc: 'Promotes healthy growth in shrimp and fish farming by providing dissolved oxygen throughout ponds.',
      image: '/images/innerpage/application/air-dying.webp',
      imageAlt: 'Roots blower air supply for aquaculture pond aeration',
    },
    {
      name: 'Pneumatic Conveying',
      slug: 'pneumatic-conveying-industries',
      desc: 'Efficient transfer of bulk dry materials such as cement, fly ash, grains, and flour.',
      image: '/images/innerpage/application/pneumatic-conveying-system.webp',
      imageAlt: 'Pneumatic conveying system for cement and dry bulk materials',
    },
    {
      name: 'Chemical Processing',
      slug: 'chemical-industries',
      desc: 'Safe conveying of industrial gases and maintaining chemical reactor aeration.',
      image: '/images/innerpage/application/gas-booster.webp',
      imageAlt: 'Industrial Roots blower gas booster for chemical processing',
    },
  ];

  const stats = [
    { number: '15+', label: 'Years Of Experience' },
    { number: '150+', label: 'Clients' },
    { number: '300+', label: 'Installations' },
    { number: '25,000+', label: 'Sq. Ft. Manufacturing Area' },
  ];

  const clientLogos = [
    { name: 'Aquaproof', src: '/images/clients-logo/aquaproof.webp' },
    { name: 'Damodar Industries', src: '/images/clients-logo/damodar-industries.webp' },
    { name: 'Kaluram Food Products', src: '/images/clients-logo/kaluram-food-products.webp' },
    { name: 'Kedia Carbon', src: '/images/clients-logo/kedia-carbon-pvt-ltd.webp' },
    { name: 'Kinc Mineral', src: '/images/clients-logo/kinc-mineral-technologis.webp' },
    { name: 'Mahi', src: '/images/clients-logo/mahi.webp' },
    { name: 'RB Woven', src: '/images/clients-logo/rb-wovwn-pvt-ltd.webp' },
    { name: 'Shant Procon', src: '/images/clients-logo/shant-procon-llp.webp' },
    { name: 'Sree Balaji', src: '/images/clients-logo/sree-balaji.webp' },
    { name: 'West Coast', src: '/images/clients-logo/west-cost-corporation.webp' },
  ];

  const productVideos = [
    { id: 'Kf_7XA5c47U', title: 'Cast Iron Roots Blower' },
    { id: 'CaqHhAvL5Yo', title: 'MS Roots Blower' },
    { id: 'N-nH_PmRPDI', title: 'Roots Blower Price India' },
    { id: 'QS4ajWhtgyY', title: 'Buy Roots Blower Online' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[#08223c] text-white py-20 lg:py-32 overflow-hidden border-b-2 border-accent/25">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left */}
            <div className="space-y-6 lg:col-span-7">
              <FadeUp delay={0.1}>
                <span className="seo-fade-up bg-accent/15 text-accent font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-accent/25 inline-block backdrop-blur-sm">
                  ISO 9001:2015 Certified Manufacturer
                </span>
              </FadeUp>
              <FadeUp delay={0.25}>
                <h1 className="seo-fade-up seo-fade-delay-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight">
                  <span className="text-accent drop-shadow-sm">Roots Blower</span> Manufacturer in Ahmedabad, India
                </h1>
              </FadeUp>
              <FadeUp delay={0.35}>
                <p className="seo-fade-up seo-fade-delay-1 text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
                  Shree Ambika Engineering is a trusted twin lobe blower manufacturer and Roots blower supplier in India. We design and build heavy-duty positive displacement blowers from 10 to 10,000 m³/hr for customers across India and the GCC.
                </p>
              </FadeUp>
              <FadeUp delay={0.45}>
                <div className="seo-fade-up flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/products"
                    className="bg-accent hover:bg-accent/90 text-primary font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-accent/15 flex items-center"
                  >
                    Explore Products <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-transparent border border-white/30 hover:bg-white hover:text-primary text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    Get a Quote
                  </Link>
                </div>
              </FadeUp>
            </div>

            {/* Hero Right - Section 1 Image */}
            <div className="relative justify-center flex lg:col-span-5 w-full z-10">
              <FadeIn delay={0.4}>
                <div className="relative bg-gradient-to-b from-[#e5e7eb] to-[#d1d5db] p-3 sm:p-4 rounded-3xl shadow-2xl border-2 border-accent/50 hover:border-accent transition-all duration-300 w-full max-w-[480px]">
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent z-20 pointer-events-none"></div>
                  <div className="absolute bottom-14 right-3 w-8 h-8 border-b-2 border-r-2 border-accent z-20 pointer-events-none"></div>
                  <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[400px] rounded-2xl overflow-hidden bg-white shadow-md flex items-center justify-center p-2">
                    <Image
                      src="/images/about-us/about-us-2.webp"
                      alt="Twin lobe Roots blower assembly at Shree Ambika Engineering in Ahmedabad"
                      fill
                      preload
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className="w-full h-full object-contain hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-3.5 flex justify-between items-center text-xs font-semibold px-1 gap-2">
                    <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] sm:text-xs shadow-sm border border-white/10">
                      Capacity: 10 - 10,000 m³/hr
                    </span>
                    <span className="bg-accent text-primary px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-sm">
                      100% Oil-Free Air
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>



          </div>
        </div>
      </section>

      {/* 2. Stats Section with Count Up */}
      <section className="bg-[#0a2948] py-10 text-white relative z-20 shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-accent font-heading">
                  <AnimatedCounter value={stat.number} />
                </div>
                <div className="text-xs sm:text-sm text-white/70 uppercase tracking-wider font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section 2 / Company Overview & Flagship System Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <FadeUp>
                <span className="text-secondary font-bold text-sm tracking-wider uppercase">
                  Welcome to Shree Ambika Engineering
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-2 mb-6 leading-tight">
                  Leading Roots Blower & Positive Displacement Blower Manufacturer
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                  <p>
                    Since 2011, Shree Ambika Engineering has manufactured Roots blowers at our CNC-equipped facility in Vatva GIDC, Ahmedabad, Gujarat. Our twin lobe and tri lobe blowers deliver oil-free air for sewage treatment plants, aquaculture farms, cement plants, food processing units and chemical industries.
                  </p>
                  <p>
                    Each blower is machined on CNC equipment and tested for flow, pressure, vibration and temperature before dispatch. We offer cast iron and mild steel construction, air-cooled and water-cooled models, and packages with motors, silencers, base frames, safety valves and acoustic hoods.
                    <br /><br />
                    As a direct manufacturer, we provide custom capacity and pressure selection, spare-parts support and supply across India and GCC countries.
                  </p>
                </div>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaCheckCircle className="text-accent flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">ISO 9001:2015 Standards</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaCheckCircle className="text-secondary flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">100% Oil-Free Air Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaIndustry className="text-accent flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">Pneumatic Conveying Duty</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaAward className="text-secondary flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">Heavy Duty CNC Precision</span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Section 2 Image Display: Cement Feeding Machine System */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
              <FadeUp delay={0.2}>
                <div className="relative w-full max-w-[440px] bg-gradient-to-br from-bg-custom to-white p-4 sm:p-6 rounded-3xl border border-borders-custom shadow-xl group hover:shadow-2xl transition-all duration-300">
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src="/images/products/cement-feeding-machine-system.webp"
                      alt="Cement feeding machine system with Roots blower for pneumatic conveying"
                      width={490}
                      height={500}
                      sizes="(max-width: 1024px) 100vw, 440px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-primary/95 text-accent text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-accent/30 backdrop-blur-sm shadow-md">
                      Flagship System
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 text-left">
                    <h3 className="text-lg font-bold font-heading text-primary group-hover:text-accent transition-colors">
                      Cement Feeding Machine System
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      High-efficiency pneumatic conveying system engineered for continuous transfer of cement, fly ash, and dry bulk materials.
                    </p>
                    <div className="pt-2 flex justify-between items-center text-xs font-semibold text-primary">
                      <span className="text-secondary">Duty: Heavy-Duty Continuous</span>
                      <Link
                        href="/products/cement-bulker-unloading-system"
                        className="text-primary hover:text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Learn More <FaArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Section */}
      <section className="py-24 bg-bg-custom border-y border-borders-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-bold text-sm tracking-wider uppercase">
              Our Product Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-2">
              High-Performance Industrial Roots Blowers
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Explore our range of twin lobe blowers, tri lobe blowers, and positive displacement blower assemblies engineered for continuous heavy-duty industrial operation.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const model = product.specifications.find(({ key }) =>
                  /model|model name|model no/i.test(key)
                );
                const category = product.sourceCategory || product.sourceCategories?.[0];

                return (
                <StaggerItem key={product._id}>
                  <div className="bg-white border border-borders-custom rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group hover:border-accent/40">
                    <div className="p-5">
                      {/* Product Image */}
                      <div className="aspect-square w-full bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-gray-100 p-4">
                        {product.images?.[0]?.startsWith('/') ? (
                          <Image
                            src={product.images[0]}
                            alt={`${product.title} industrial blower`}
                            width={490}
                            height={500}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : product.images?.[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.images[0]}
                            alt={`${product.title} industrial blower`}
                            width={490}
                            height={500}
                            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <FaCogs className="w-12 h-12 text-gray-300" />
                        )}
                      </div>
                      {category && (
                        <span className="mb-2 inline-flex max-w-full truncate rounded-full bg-bg-custom px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {category}
                        </span>
                      )}
                      <h3 className="text-base font-bold font-heading text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      {model?.value && (
                        <p className="mb-2 text-[11px] font-semibold text-gray-500">
                          Model: <span className="text-gray-700">{model.value}</span>
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mb-4 line-clamp-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Specifications Preview */}
                      <div className="border-t border-gray-100 pt-3 space-y-1.5">
                        {product.specifications.slice(0, 3).map((spec, sIdx) => (
                          <div key={sIdx} className="flex justify-between text-[11px] py-0.5">
                            <span className="text-gray-600 font-medium">{spec.key}:</span>
                            <span className="font-semibold text-gray-700">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      {product.sourcePrice && (
                        <p className="mb-3 text-center text-xs font-bold text-primary">
                          {product.sourcePrice}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="block rounded-lg border border-primary px-2 py-2.5 text-center text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                        >
                          Specifications
                        </Link>
                        <Link
                          href={`/products/${product.slug}#request-quote`}
                          className="block rounded-lg bg-accent px-2 py-2.5 text-center text-xs font-bold text-primary transition hover:bg-accent/80"
                        >
                          Get a Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 inline-block shadow-sm text-sm"
            >
              View Complete Product Catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-borders-custom bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold font-heading text-primary">
              Why Choose Shree Ambika Engineering
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Work directly with an Ahmedabad manufacturer for blower selection, configuration and support.
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
              <li><strong className="text-primary">Custom engineering:</strong> select flow, pressure, cooling and drive options to suit the process.</li>
              <li><strong className="text-primary">CNC precision machining:</strong> rotor profiles and casing components are produced using CNC equipment.</li>
              <li><strong className="text-primary">Oil-free air delivery:</strong> Roots blowers use non-contacting rotors and are suited to process air applications.</li>
              <li><strong className="text-primary">Low-noise configurations:</strong> tri lobe models and acoustic enclosures are available for noise-sensitive sites.</li>
              <li><strong className="text-primary">India and GCC supply:</strong> the team supports product enquiries from Ahmedabad for domestic and export requirements.</li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                ['Pneumatic Conveying Systems', '/products/pneumatic-conveying-system'],
                ['Industrial Air Blowers', '/products/industrial-air-blowers'],
                ['Water Treatment Plant Blowers', '/products/water-treatment-plant-roots-blower'],
                ['Roots Blower Motors', '/products/roots-blower-motors'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-borders-custom bg-bg-custom px-4 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:text-secondary"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold font-heading text-primary">
              Twin Lobe vs Tri Lobe vs Water Cooled Roots Blower
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Compare the published product ranges. Final selection depends on the required operating point and installation.
            </p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-borders-custom">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-bg-custom text-primary">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Model</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Flow rate</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Pressure</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Configuration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <th scope="row" className="px-4 py-3 font-semibold text-primary">Twin lobe</th>
                    <td className="px-4 py-3">10–10,000 m³/hr</td>
                    <td className="px-4 py-3">0.1–1.0 kg/cm²</td>
                    <td className="px-4 py-3">Air or water cooled</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-semibold text-primary">Tri lobe</th>
                    <td className="px-4 py-3">20–8,500 m³/hr</td>
                    <td className="px-4 py-3">0.1–0.8 kg/cm²</td>
                    <td className="px-4 py-3">Below 78 dB(A) with discharge silencer</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-semibold text-primary">Water cooled</th>
                    <td className="px-4 py-3">50–12,000 m³/hr</td>
                    <td className="px-4 py-3">0.6–1.2 kg/cm²</td>
                    <td className="px-4 py-3">Water-jacketed casing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Industries Served with Images */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-bold text-sm tracking-wider uppercase font-semibold">
              Applications
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-2">
              Industries We Serve
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Roots blowers are vital components across multiple process frameworks. Shree Ambika Engineering provides specialized positive displacement blower designs to optimize airflow requirements.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {industries.map((ind, idx) => (
                <StaggerItem key={idx}>
                  <div className="bg-bg-custom border border-borders-custom rounded-2xl overflow-hidden shadow-sm hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                        <Image
                          src={ind.image}
                          alt={ind.imageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                          0{idx + 1}
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-heading font-bold text-primary text-base">{ind.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{ind.desc}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <Link
                        href={`/applications/${ind.slug}`}
                        className="text-xs font-bold text-primary hover:text-accent flex items-center group-hover:translate-x-1 transition-transform"
                      >
                        Engineering Guide &rarr;
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* 5.5 Homepage Technical Blogs Section */}
      <section className="py-24 bg-bg-custom border-t border-borders-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-bold text-sm tracking-wider uppercase font-semibold">
              Technical Resources
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-2">
              Latest Engineering Insights
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Read technical articles and guidelines on roots blower operation, twin lobe blower design, and aeration efficiency.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <StaggerItem key={blog._id}>
                  <article className="bg-white border border-borders-custom rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group hover:border-accent/40">
                    <div className="p-5">
                      {/* Blog Image */}
                      <div className="aspect-video w-full bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative border border-gray-100">
                        {blog.featuredImage?.startsWith('/') ? (
                          <Image
                            src={blog.featuredImage}
                            alt={`${blog.title} article image`}
                            width={640}
                            height={360}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : blog.featuredImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={blog.featuredImage}
                            alt={`${blog.title} article image`}
                            width={640}
                            height={360}
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-600 text-xs">Technical Article</span>
                        )}
                      </div>
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block mb-1">
                        {blog.category}
                      </span>
                      <h3 className="text-base font-bold font-heading text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mt-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="p-5 pt-0 flex justify-between items-center text-xs border-t border-gray-50 mt-4">
                      <span className="text-gray-600 font-medium">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="font-bold text-primary hover:text-accent flex items-center transition-colors"
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <div className="text-center mt-12">
            <Link
              href="/blogs"
              className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 inline-block shadow-sm text-sm"
            >
              View All Technical Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Clients Sponsors Infinite Scrolling Marquee */}
      <section className="py-16 bg-bg-custom border-t border-borders-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase font-semibold">
              Trusted By Leading Corporates
            </span>
          </div>
          <ClientTicker items={clientLogos} />
        </div>
      </section>

      {/* 7. Inquiries and Form */}
      <section className="py-24 bg-white border-t border-borders-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info Left */}
            <div className="space-y-6 flex flex-col justify-center">
              <FadeUp>
                <span className="text-secondary font-bold text-sm tracking-wider uppercase font-semibold">
                  Contact Our Sales Engineers
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-1">
                  Need a Custom Roots Blower Quotation?
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tell us your airflow, operating pressure and application. Our sales engineers will review your requirements and help identify a suitable Roots blower configuration for quotation.
                </p>
                <div className="space-y-3.5 pt-4">
                  <div className="flex items-center space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary">Email:</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-accent hover:underline">{settings.email}</a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary">Sales Line:</span>
                    <a href={`tel:${phoneLink}`} className="hover:text-accent hover:underline">{primaryPhone}</a>
                  </div>
                  <div className="flex items-start space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary flex-shrink-0">Address:</span>
                    <span className="text-sm">{settings.address}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`tel:${phoneLink}`}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                  >
                    Call {primaryPhone}
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#20ba5a]"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Form Right */}
            <div>
              <FadeUp delay={0.2}>
                <HomeContactForm products={JSON.parse(JSON.stringify(quoteProducts))} />
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Technical Help</span>
            <h2 className="mt-2 text-3xl font-bold font-heading text-primary">Roots Blower FAQs</h2>
          </div>
          <div className="space-y-4">
            {homepageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-borders-custom bg-bg-custom/50 p-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-primary marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Product demonstration videos */}
      <section className="py-20 bg-bg-custom border-t border-borders-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">
              See Our Blowers in Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mt-2">
              Roots Blower Product Videos
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Watch product demonstrations of Shree Ambika Engineering roots blower systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-xl border border-borders-custom bg-white shadow-sm"
              >
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={`${video.title} product demonstration`}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <h3 className="px-4 py-4 font-heading text-sm font-bold text-primary">
                  {video.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Google Maps Embed */}
      <section className="h-96 w-full border-t border-borders-custom relative">
        <iframe
          src={settings.googleMapEmbed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Shree Ambika Engineering Factory Location Map Vatva Ahmedabad"
        ></iframe>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
              name: homepageFaqs[0].question,
                acceptedAnswer: {
                  '@type': 'Answer',
                text: homepageFaqs[0].answer,
                },
              },
              ...homepageFaqs.slice(1).map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            ],
          }),
        }}
      />
    </div>
  );
}
