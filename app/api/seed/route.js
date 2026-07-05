import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Gallery from '@/models/Gallery';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 1. Seed Admin User
    const adminEmail = 'admin@saerootsblower.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@SAE2026!', 10);
      admin = new User({
        name: 'SAE Admin',
        email: adminEmail,
        password: hashedPassword,
      });
      await admin.save();
    }

    // 2. Seed Settings
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({
        companyName: 'Shree Ambika Engineering',
        address: 'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India',
        phone: '+91 63545 486037, +91 81550 78276',
        email: 'sales@saerootsblower.com',
        whatsappNumber: '+9163545486037',
        socialLinks: {
          facebook: 'https://facebook.com/saerootsblower',
          twitter: 'https://twitter.com/saerootsblower',
          linkedin: 'https://linkedin.com/company/shree-ambika-engineering',
          youtube: 'https://youtube.com/saerootsblower',
        },
        googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.2081684724017!2d72.617478!3d22.9803123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87b7a13c9e6d%3A0xe54d3ccbe1d1ba0a!2sVatva%20GIDC%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
      });
      await settings.save();
    } else {
      // Update with exact live details
      settings.address = 'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India';
      settings.phone = '+91 63545 486037, +91 81550 78276';
      settings.whatsappNumber = '+9163545486037';
      await settings.save();
    }

    // 3. Clear and Re-seed Products
    await Product.deleteMany({});
    const productsData = [
      {
        title: 'Twin Lobe Roots Blower',
        slug: 'twin-lobe-roots-blower',
        shortDescription: 'Heavy-duty industrial twin lobe rotary air blowers designed for high volumetric efficiency and continuous duty.',
        longDescription: 'Shree Ambika Engineering Twin Lobe Roots Blowers are robust machines capable of handling varying capacities against resistance pressures. Ideal for wastewater aeration, pneumatic conveying, aquaculture, and chemical processing. They are manufactured under strict quality standards to ensure long-term durability and minimal maintenance.',
        specifications: [
          { key: 'Flow Rate', value: '10 m³/hr to 10,000 m³/hr' },
          { key: 'Pressure Range', value: '0.1 kg/cm² to 1.0 kg/cm²' },
          { key: 'Cooling Method', value: 'Air Cooled / Water Cooled' },
          { key: 'Drive Type', value: 'V-Belt / Direct Coupled' },
          { key: 'Material of Construction', value: 'Cast Iron (Gr. FG 260) / Alloy Steel' },
          { key: 'Speed', value: '600 RPM to 1800 RPM' },
        ],
        features: [
          '100% Oil-Free air delivery',
          'Dynamically balanced rotors for vibration-free running',
          'Hardened and ground timing gears for low noise and long life',
          'Heavy-duty roller bearings',
          'Large inlet and outlet ports for reduced friction'
        ],
        applications: ['Wastewater Treatment Plants', 'Aquaculture & Fish Farming', 'Pneumatic Conveying Systems', 'Chemical & Process Industries'],
        images: [
          '/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp'
        ],
        seoTitle: 'Twin Lobe Roots Blower Manufacturer India | SAE',
        seoDescription: 'High quality Twin Lobe Roots Blowers by Shree Ambika Engineering. 100% Oil-Free air, robust construction, high volumetric efficiency. Request a quote today.',
        status: 'published',
      },
      {
        title: 'Tri Lobe Roots Blower',
        slug: 'tri-lobe-roots-blower',
        shortDescription: 'Advanced tri lobe design offering lower noise, reduced pressure pulsations, and increased efficiency.',
        longDescription: 'The Tri Lobe Roots Blower from Shree Ambika Engineering features a three-lobe rotor profile that significantly reduces gas backflow pulsations, resulting in quieter operation and lower mechanical strain on bearings and gears. This premium engineering choice ensures exceptional performance in sensitive industrial applications.',
        specifications: [
          { key: 'Flow Rate', value: '20 m³/hr to 8,500 m³/hr' },
          { key: 'Pressure Range', value: '0.1 kg/cm² to 0.8 kg/cm²' },
          { key: 'Noise Level', value: 'Below 80 dB(A) with silencer' },
          { key: 'Lubrication', value: 'Dual Splash Oil Lubrication' },
          { key: 'Sealing', value: 'Labyrinth & Piston Ring Seals' },
        ],
        features: [
          'Tri-lobe design reduces pulsations by up to 5dB',
          'Extended bearing life due to reduced vibration',
          'Highly efficient cooling design',
          'Precision machined components using CNC technology'
        ],
        applications: ['Pneumatic Conveying', 'Water Treatment Aeration', 'Flour Mills & Food Processing', 'Vacuum Applications'],
        images: [
          '/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp'
        ],
        seoTitle: 'Tri Lobe Roots Blower | Reduced Noise Industrial Blower | SAE',
        seoDescription: 'Get premium Tri Lobe Roots Blowers with low noise design, minimal vibration, and maximum reliability. Manufactured by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Water Cooled Roots Blower',
        slug: 'water-cooled-roots-blower',
        shortDescription: 'Specially designed blower with water-jacketed casing for continuous high-pressure operations.',
        longDescription: 'When operating pressures exceed 0.6 kg/cm², the air temperature rises rapidly. Shree Ambika Engineering Water Cooled Roots Blowers feature a water jacket surrounding the casing to dissipate heat, preventing thermal expansion of rotors and maintaining close clearances for high efficiency during continuous heavy-duty runs.',
        specifications: [
          { key: 'Flow Rate', value: '50 m³/hr to 12,000 m³/hr' },
          { key: 'Pressure Range', value: '0.6 kg/cm² to 1.2 kg/cm²' },
          { key: 'Water Consumption', value: '2 to 10 LPM (depending on size)' },
          { key: 'Max Temp Rise', value: 'Controlled under 95°C' },
        ],
        features: [
          'Water cooling jacket for thermal control',
          'Suitable for high pressure/high temperature duty',
          'Prevents rotor seizure and extends machine life',
          'Heavy duty spheroidal graphite iron gears'
        ],
        applications: ['Steel Plants & Smelters', 'Cement Plants', 'High Vacuum Systems', 'Power Generation Plants'],
        images: [
          '/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp'
        ],
        seoTitle: 'Water Cooled Roots Blower Manufacturer | SAE',
        seoDescription: 'Water-cooled roots blowers by Shree Ambika Engineering. Engineered for continuous operation at high discharge pressures up to 1.2 kg/cm².',
        status: 'published',
      },
      {
        title: 'Acoustic Hood Roots Blower System',
        slug: 'acoustic-hood-roots-blower-system',
        shortDescription: 'Complete blower package enclosed in a soundproof acoustic enclosure for noise-sensitive installations.',
        longDescription: 'For installations near residential areas, commercial zones, or where factory safety standards limit sound exposure, Shree Ambika Engineering provides fully integrated Acoustic Enclosures. These custom-engineered hoods reduce blower operating noise levels by up to 15-20 dB(A) while incorporating proper forced ventilation to keep the motor and blower cool.',
        specifications: [
          { key: 'Noise Reduction', value: '15 dB(A) to 25 dB(A) reduction' },
          { key: 'Enclosure Material', value: 'Acoustic Foam lined CRCA sheets' },
          { key: 'Ventilation', value: 'Forced cooling via exhaust fan' },
          { key: 'Access', value: 'Removable panels for easy maintenance' },
        ],
        features: [
          'Exceeds OSHA safety requirements for sound control',
          'Weather-proof construction for outdoor use',
          'Integrated ventilation system prevents overheating',
          'Quick-release doors for routine maintenance access'
        ],
        applications: ['Municipal Wastewater Plants', 'Aquaculture Farms near cities', 'Indoor Factories', 'Hospitals & Institutions'],
        images: [
          '/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp'
        ],
        seoTitle: 'Acoustic Hood Blower Systems | Soundproof Blower Package',
        seoDescription: 'Acoustic Hood Roots Blower systems by Shree Ambika Engineering. Reduce factory noise and comply with environmental safety regulations.',
        status: 'published',
      }
    ];
    await Product.insertMany(productsData);

    // 4. Clear and Re-seed Blogs
    await Blog.deleteMany({});
    const blogsData = [
      {
        title: 'The Role of Roots Blowers in Wastewater Treatment Plants',
        slug: 'role-of-roots-blowers-in-wastewater-treatment',
        excerpt: 'Aeration is key in biological wastewater treatment. Learn how roots blowers provide the constant, energy-efficient airflow needed to digest organic waste.',
        content: '<h2>Introduction to Wastewater Aeration</h2><p>In municipal and industrial wastewater treatment, the biological process is crucial. Microorganisms digest organic pollutants in the wastewater. For these aerobic bacteria to survive and multiply, they require a steady supply of dissolved oxygen.</p><h2>How Roots Blowers Fit In</h2><p>Roots blowers, or rotary lobe blowers, are the workhorses of the aeration basin. They deliver a high volume of oil-free air at the moderate pressures required to overcome the water head. Oil-free air is critical: any oil contamination in the airflow would kill the bacterial culture and ruin the biological digestion process.</p><h2>Key Selection Criteria</h2><p>When selecting a blower for wastewater treatment, engineers look for:<ul><li><strong>100% Oil-Free Air:</strong> To maintain biological process integrity.</li><li><strong>Energy Efficiency:</strong> Aeration can account for up to 60% of a plant\'s electricity usage.</li><li><strong>Reliability:</strong> Plants operate 24/7/365, so downtime is not an option.</li></ul><p>At Shree Ambika Engineering, our Twin Lobe and Tri Lobe blowers are custom engineered to maximize aeration efficiency while maintaining maximum mechanical uptime.</p>',
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'Wastewater Treatment',
        tags: ['Aeration', 'Roots Blower', 'Sewage Treatment', 'Industrial Engineering'],
        seoTitle: 'Roots Blowers in Wastewater Treatment Aeration | SAE',
        seoDescription: 'Discover the vital role of oil-free rotary lobe roots blowers in biological wastewater treatment plants. Learn about aeration efficiency and selection tips.',
        status: 'published',
      },
      {
        title: 'Why Twin Lobe vs. Tri Lobe Roots Blowers: A Comparison Guide',
        slug: 'twin-lobe-vs-tri-lobe-roots-blower-comparison',
        excerpt: 'Understanding the key mechanical and performance differences between twin lobe and tri lobe blower configurations to make the right engineering choice.',
        content: '<h2>Deciding Between Lobe Types</h2><p>Rotary lobe blowers typically come in two distinct rotor designs: twin lobe (two lobes) and tri lobe (three lobes). While both operate on the principle of positive displacement, their performance characteristics vary.</p><h2>1. Pressure Pulsations and Noise</h2><p>A twin-lobe blower discharges air twice per revolution of each rotor, while a tri-lobe blower discharges three times. This higher frequency of discharge in tri-lobe blowers reduces pressure pulsations by up to 50%, resulting in significantly quieter operation and less piping vibration.</p><h2>2. Mechanical Stress and Reliability</h2><p>Lower pressure pulsations mean less shock loading on the timing gears and shaft bearings. Therefore, tri-lobe blowers generally experience less mechanical wear, translating to longer periods between maintenance shutdowns.</p><h2>3. Flow Capacity</h2><p>For a given housing size, twin-lobe blowers typically offer slightly higher volumetric displacement because the rotors take up less internal volume. However, the efficiency gains of tri-lobe configurations at higher pressures often offset this difference.</p><h2>Conclusion</h2><p>If low noise and minimal vibration are critical (such as in indoor or urban settings), the <strong>Tri Lobe Blower</strong> is highly recommended. For raw volumetric throughput in heavy industrial environments where noise is less of a concern, the classic <strong>Twin Lobe Blower</strong> remains a cost-effective, rugged choice.</p>',
        featuredImage: '/images/products/roots-blower.webp',
        category: 'Product Guide',
        tags: ['Blower Comparison', 'Twin Lobe', 'Tri Lobe', 'Engineering Principles'],
        seoTitle: 'Twin Lobe vs Tri Lobe Blower Comparison | SAE Blog',
        seoDescription: 'Compare Twin Lobe and Tri Lobe Roots Blowers. Learn about noise levels, pressure pulsations, efficiency, and which design fits your industrial application.',
        status: 'published',
      }
    ];
    await Blog.insertMany(blogsData);

    // 5. Clear and Re-seed Gallery
    await Gallery.deleteMany({});
    const galleryData = [
      { title: 'CNC Rotor Machining Center', category: 'Infrastructure', type: 'image', image: '/images/about-us/about-us-1.webp' },
      { title: 'Roots Blower Quality Testing Bench', category: 'Quality Control', type: 'image', image: '/images/about-us/about-us-2.webp' },
      { title: 'Heavy Duty Blower Casing Casting', category: 'Manufacturing', type: 'image', image: '/images/products/roots-blower.webp' },
      { title: 'Tri-Lobe Blower Assembly Line', category: 'Manufacturing', type: 'image', image: '/images/products/twin-lobe-roots-blower.webp' },
      { title: 'Bulker Unloading System - Installation', category: 'Installation', type: 'image', image: 'https://saerootsblower.com/images/gallery/buker-unloading-system-1.webp' },
      { title: 'Bulker Unloading Site View', category: 'Installation', type: 'image', image: 'https://saerootsblower.com/images/gallery/buker-unloading-system-2.webp' },
      { title: 'Pneumatic Bulker Unloader Assembly', category: 'Installation', type: 'image', image: 'https://saerootsblower.com/images/gallery/buker-unloading-system-3.webp' },
      { title: 'Dual Cement Feeding Machine Setup', category: 'Manufacturing', type: 'image', image: 'https://saerootsblower.com/images/gallery/dual-cement-feeding-machine-1.webp' },
      { title: 'Cement Feeding System Factory Testing', category: 'Quality Control', type: 'image', image: 'https://saerootsblower.com/images/gallery/dual-cement-feeding-machine-2.webp' },
      { title: 'Dual Cement Feeding System at Client Site', category: 'Installation', type: 'image', image: 'https://saerootsblower.com/images/gallery/dual-cement-feeding-machine-3.webp' },
      { title: 'ETP STP Roots Blower Package', category: 'Manufacturing', type: 'image', image: 'https://saerootsblower.com/images/gallery/etp-stp-roots-blower-1.webp' },
      { title: 'Water Treatment Plant Blower Installation', category: 'Installation', type: 'image', image: 'https://saerootsblower.com/images/gallery/etp-stp-roots-blower-2.webp' }
    ];
    await Gallery.insertMany(galleryData);

    return NextResponse.json(
      {
        message: 'Database re-seeded with actual website images successfully',
        adminUser: {
          email: adminEmail,
          password: 'Admin@SAE2026! (Please change this in Settings)',
        },
        productsSeeded: true,
        blogsSeeded: true,
        gallerySeeded: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Server error during seeding' }, { status: 500 });
  }
}
