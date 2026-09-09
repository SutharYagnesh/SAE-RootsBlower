import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Settings from '@/models/Settings';
import Link from 'next/link';
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

export default async function Home() {
  await connectDB();

  // Optimize: project only necessary fields for products to make the site faster
  const products = await Product.find({ status: 'published' })
    .select('title slug shortDescription specifications images')
    .limit(4);

  // Fetch the latest 3 blogs for the homepage
  const blogs = await Blog.find({ status: 'published' })
    .select('title slug excerpt category featuredImage createdAt')
    .sort({ createdAt: -1 })
    .limit(3);

  const settings = (await Settings.findOne({})) || {
    phone: '+91 63545 86037, +91 81550 78276',
    email: 'sales@saerootsblower.com',
    address:
      'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India',
    googleMapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7346.752869004515!2d72.62734677770999!3d22.973181100000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e89b0e7cd54e5%3A0xd3ceb43cc42a6433!2sShree%20Ambika%20Engineering%2C%20Root%20blower%20manufacturer!5e0!3m2!1sen!2sus!4v1784869188802!5m2!1sen!2sus',
    metaTitle: 'Roots Blower Manufacturer in India | Shree Ambika Engineering',
    metaDescription: 'Shree Ambika Engineering is a leading Roots Blower Manufacturer in India offering high-performance twin lobe blowers, industrial roots blowers & positive displacement blowers.',
  };

  const industries = [
    {
      name: 'Wastewater Treatment',
      desc: 'Continuous aeration air supply for municipal sewage and industrial effluent treatment plants.',
      image: '/images/innerpage/application/sewage-plant.webp',
    },
    {
      name: 'Aquaculture Aeration',
      desc: 'Promotes healthy growth in shrimp and fish farming by providing dissolved oxygen throughout ponds.',
      image: '/images/innerpage/application/air-dying.webp',
    },
    {
      name: 'Pneumatic Conveying',
      desc: 'Efficient transfer of bulk dry materials such as cement, fly ash, grains, and flour.',
      image: '/images/innerpage/application/pneumatic-conveying-system.webp',
    },
    {
      name: 'Chemical Processing',
      desc: 'Safe conveying of industrial gases and maintaining chemical reactor aeration.',
      image: '/images/innerpage/application/gas-booster.webp',
    },
  ];

  const stats = [
    { number: '10+', label: 'Years Of Experiences' },
    { number: '150+', label: 'Happy Clients' },
    { number: '300+', label: 'Installations' },
    { number: '25k+', label: 'Sq. Ft. Manufacturing Area' },
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
                <span className="bg-accent/15 text-accent font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-accent/25 inline-block backdrop-blur-sm">
                  ISO 9001:2015 Certified Manufacturer
                </span>
              </FadeUp>
              <FadeUp delay={0.25}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight">
                  Premier <span className="text-accent drop-shadow-sm">Roots Blower</span> Manufacturer in India
                </h1>
              </FadeUp>
              <FadeUp delay={0.35}>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
                  Shree Ambika Engineering is a trusted <strong>Twin Lobe Blower Manufacturer</strong> and <strong>Roots Blower Supplier in India</strong>, designing heavy-duty industrial roots blowers and positive displacement blowers engineered for maximum volumetric efficiency.
                </p>
              </FadeUp>
              <FadeUp delay={0.45}>
                <div className="flex flex-wrap gap-4 pt-4">
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
                    Contact Sales
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/about-us/about-us-2.webp"
                      alt="Roots Blower Manufacturer in India - Shree Ambika Engineering Assembly"
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
                  Leading Industrial Roots Blower Manufacturer & Positive Displacement Blower Expert
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                  <p>
                    Established with a commitment to quality and precision engineering, Shree Ambika Engineering has emerged as a premier <strong>Positive Displacement Blower Manufacturer</strong> and leading <strong>Roots Blower Supplier in India</strong>.
                  </p>
                  <p>
                    Our blowers and pneumatic conveying systems are constructed using advanced CNC machining tools and undergo rigorous mechanical testing to ensure they deliver 100% oil-free air under continuous operating pressure. We supply custom twin lobe blowers, tri-lobe blowers, acoustic silencing enclosures, and heavy-duty cement feeding machine systems tailored for demanding industrial requirements.
                  </p>
                </div>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaCheckCircle className="text-accent flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">ISO 9001:2015 Standards</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-bg-custom rounded-xl border border-borders-custom">
                    <FaCheckCircle className="text-secondary flex-shrink-0" size={20} />
                    <span className="text-sm font-semibold text-primary">100% Oil-Free Air Certified</span>
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/products/cement-feeding-machine-system.webp"
                      alt="Cement Feeding Machine System - Industrial Roots Blower Manufacturer in India"
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
                        href="/products/twin-lobe-roots-blower"
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
              {products.map((product) => (
                <StaggerItem key={product._id}>
                  <div className="bg-white border border-borders-custom rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group hover:border-accent/40">
                    <div className="p-5">
                      {/* Product Image */}
                      <div className="aspect-square w-full bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-gray-100 p-4">
                        {product.images && product.images[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.images[0]}
                            alt={`${product.title} - Roots Blower Manufacturer in India`}
                            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <FaCogs className="w-12 h-12 text-gray-300" />
                        )}
                      </div>
                      <h3 className="text-base font-bold font-heading text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-4 line-clamp-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Specifications Preview */}
                      <div className="border-t border-gray-100 pt-3 space-y-1.5">
                        {product.specifications.slice(0, 3).map((spec, sIdx) => (
                          <div key={sIdx} className="flex justify-between text-[11px] py-0.5">
                            <span className="text-gray-400 font-medium">{spec.key}:</span>
                            <span className="font-semibold text-gray-700">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-center w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 rounded-lg text-xs transition-all duration-300 shadow-sm"
                      >
                        View Specifications
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ind.image}
                          alt={`${ind.name} - SAE Industrial Roots Blower Application`}
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
                        href={`/applications/${ind.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                        {blog.featuredImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={blog.featuredImage}
                            alt={`${blog.title} - Roots Blower Engineering Article`}
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Technical Article</span>
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
                      <span className="text-gray-400 font-medium">
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
                  As a leading <strong>Roots Blower Supplier in India</strong>, our team is ready to analyze your airflow volume, operating pressure, and environment parameters to provide competitive Roots Blower prices and quotations.
                </p>
                <div className="space-y-3.5 pt-4">
                  <div className="flex items-center space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary">Email:</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-accent hover:underline">{settings.email}</a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary">Sales Line:</span>
                    <span>{settings.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-gray-700 text-sm">
                    <span className="font-bold text-primary flex-shrink-0">Address:</span>
                    <span className="text-sm">{settings.address}</span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Form Right */}
            <div>
              <FadeUp delay={0.2}>
                <HomeContactForm products={JSON.parse(JSON.stringify(products))} />
              </FadeUp>
            </div>
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
                name: 'Who is the leading Roots Blower Manufacturer in India?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Shree Ambika Engineering is a premier Roots Blower Manufacturer in India, engineering high-precision twin lobe blowers, tri-lobe blowers, and positive displacement air blowers since 2011.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the difference between a Twin Lobe Blower and a Tri Lobe Blower?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Twin lobe blowers feature two figure-eight lobes providing high volumetric capacity, while tri lobe blowers feature three lobes for lower pressure pulsation and lower noise levels.',
                },
              },
              {
                '@type': 'Question',
                name: 'How can I request a Roots Blower quotation or price in India?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can contact Shree Ambika Engineering directly via our website inquiry form or call +91 63545 86037 to receive a custom technical quotation and competitive Roots Blower price.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}


