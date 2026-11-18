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
    const siteSettings = {
      companyName: 'Shree Ambika Engineering',
      address: 'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India',
      phone: '+91 63545 86037, +91 81550 78276',
      email: 'sales@saerootsblower.com',
      whatsappNumber: '+916354586037',
      socialLinks: {
        facebook: 'https://facebook.com/saerootsblower',
        twitter: 'https://twitter.com/saerootsblower',
        linkedin: 'https://linkedin.com/company/shree-ambika-engineering',
        youtube: 'https://youtube.com/saerootsblower',
        instagram: 'https://instagram.com/saerootsblower',
      },
      googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7346.752869004515!2d72.62734677770999!3d22.973181100000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e89b0e7cd54e5%3A0xd3ceb43cc42a6433!2sShree%20Ambika%20Engineering%2C%20Root%20blower%20manufacturer!5e0!3m2!1sen!2sus!4v1784869188802!5m2!1sen!2sus',
      metaTitle: 'Roots Blower Manufacturer in India | Twin Lobe & Industrial Blowers | SAE',
      metaDescription: 'Shree Ambika Engineering is a leading Roots Blower Manufacturer in India offering high-performance twin lobe blowers, cement bulker unloading systems, and roots blower motors with global export to Dubai, UAE & Saudi Arabia.',
    };

    if (!settings) {
      settings = new Settings(siteSettings);
      await settings.save();
    } else {
      Object.assign(settings, siteSettings);
      await settings.save();
    }

    // 3. Clear and Re-seed Products (The 8 Core Categories + Specialty Packages)
    await Product.deleteMany({});
    const productsData = [
      {
        title: 'Twin Lobe Roots Blower',
        slug: 'twin-lobe-roots-blower',
        shortDescription: 'Heavy-duty industrial twin lobe rotary air blowers designed for high volumetric efficiency and continuous duty.',
        longDescription: 'Shree Ambika Engineering Twin Lobe Roots Blowers are robust positive displacement machines engineered for continuous, heavy-duty industrial service. Designed with precision CNC-profiled twin rotors, these blowers guarantee 100% oil-free air delivery against back-pressures up to 1.0 kg/cm². They are manufactured from high-tensile Cast Iron (FG 260) with dynamically balanced rotors to ensure minimal mechanical vibration and prolonged bearing life. Widely trusted across India, Dubai, UAE, and Saudi Arabia for wastewater treatment aeration, pneumatic material conveying, aquaculture, and chemical gas handling.',
        specifications: [
          { key: 'Flow Rate Capacity', value: '10 m³/hr to 10,000 m³/hr (10 CFM to 6,000 CFM)' },
          { key: 'Operating Pressure', value: '0.1 kg/cm² to 1.0 kg/cm² (1,000 mmWG to 10,000 mmWG)' },
          { key: 'Cooling Method', value: 'Air Cooled / Water Cooled Options' },
          { key: 'Drive Type', value: 'V-Belt Drive / Direct Flexible Coupling' },
          { key: 'Material of Construction', value: 'High Tensile Cast Iron (Gr. FG 260) / S.G. Iron' },
          { key: 'Operating Speed', value: '600 RPM to 1,800 RPM' },
          { key: 'Air Purity', value: '100% Oil-Free Certified Delivery' },
        ],
        features: [
          '100% Oil-Free air delivery guaranteed by atmospheric air gaps and dual labyrinth seals',
          'Dynamically balanced twin-lobe rotors for smooth, vibration-free operation',
          'Hardened and profile-ground alloy steel timing gears for whisper-quiet running',
          'Heavy-duty spherical and cylindrical roller bearings with extended service life',
          'Precision CNC machined casing and side plates maintaining ultra-close tolerances',
          'Export-ready packaging suited for high-ambient GCC climates up to 52°C',
        ],
        applications: [
          'Wastewater Treatment (STP/ETP Aeration)',
          'Pneumatic Conveying Systems (Cement, Fly Ash, Flour)',
          'Aquaculture & Shrimp Pond Aeration',
          'Chemical & Petrochemical Gas Boosting',
          'Silo Fluidization and Bulk Material Handling',
        ],
        images: [
          '/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Twin Lobe Roots Blower Manufacturer in India | SAE Roots Blower',
        seoDescription: 'Leading Twin Lobe Roots Blower Manufacturer in India. Oil-free, high volumetric efficiency blowers with direct factory pricing and export to Dubai, UAE & Saudi Arabia.',
        status: 'published',
      },
      {
        title: 'Water Treatment Plant Roots Blower',
        slug: 'water-treatment-plant-roots-blower',
        shortDescription: '100% oil-free aeration blowers designed for continuous 24/7 biological digestion in municipal STP and industrial ETP plants.',
        longDescription: 'Engineered specifically for municipal Sewage Treatment Plants (STP) and industrial Effluent Treatment Plants (ETP), the SAE Water Treatment Plant Roots Blower provides non-stop, oil-free aeration to support active bacterial waste digestion. Featuring specialized acoustic silencers and high oxygen transfer efficiency (OTE), these blowers overcome fluctuating hydrostatic heads without surging or stalling.',
        specifications: [
          { key: 'Flow Rate Range', value: '25 m³/hr to 8,500 m³/hr' },
          { key: 'Pressure Rating', value: '0.2 kg/cm² to 0.8 kg/cm² (up to 8m water depth)' },
          { key: 'Acoustic Footprint', value: 'Under 75 dB(A) with optional Acoustic Enclosure' },
          { key: 'Duty Cycle', value: 'Continuous 24/7/365 Non-Stop Operation' },
          { key: 'Sealing Mechanism', value: 'Double Labyrinth Seals with Atmospheric Breather Vent' },
          { key: 'Diffuser Compatibility', value: 'Fine Bubble, Coarse Bubble & Tubular Diffusers' },
        ],
        features: [
          'Guaranteed zero oil vapor migration protecting delicate aerobic biological bacteria',
          'Constant volumetric airflow independent of seasonal atmospheric temperature swings',
          'Acoustic silencer design with non-clogging sound-absorbent baffles',
          'Compatible with Variable Frequency Drives (VFD) for energy optimization during off-peak hours',
          'High volumetric efficiency reducing plant electricity bills by up to 20%',
        ],
        applications: [
          'Municipal Sewage Treatment Plants (STP)',
          'Industrial Effluent Treatment Plants (ETP)',
          'Sludge Digester Aeration & Agitation',
          'Common Effluent Treatment Plants (CETP)',
        ],
        images: [
          '/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Water Treatment Plant Roots Blower | STP & ETP Aeration | SAE',
        seoDescription: 'High-performance Water Treatment Plant Roots Blowers for STP and ETP aeration tanks. 100% oil-free, energy-efficient blowers by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Air-Cooled Roots Blower',
        slug: 'air-cooled-roots-blower',
        shortDescription: 'Self-cooling positive displacement rotary blowers for low to moderate discharge pressures up to 0.6 kg/cm².',
        longDescription: 'Shree Ambika Engineering Air-Cooled Roots Blowers are ideal for applications where discharge pressures remain under 0.6 kg/cm² (6,000 mmWG) and cooling water utilities are unavailable. Featuring deeply finned cast-iron casings and dual splash-lubricated bearing housings, these blowers utilize natural convective airflow to dissipate heat efficiently, reducing operational overhead.',
        specifications: [
          { key: 'Flow Capacity', value: '15 m³/hr to 6,000 m³/hr' },
          { key: 'Maximum Pressure', value: 'Up to 0.6 kg/cm² (6,000 mmWG)' },
          { key: 'Cooling Requirement', value: 'Zero Water Needed (Natural Convection Air Cooled)' },
          { key: 'Lubrication', value: 'Dual Splash Oil Lubrication with Sight Glass' },
          { key: 'Mounting Configuration', value: 'Horizontal / Vertical Air Flow Delivery' },
        ],
        features: [
          'No external cooling water or piping required, cutting installation costs',
          'Deep external heat-dissipation fins for reliable heat transfer',
          'Simple, low-maintenance design requiring only periodic oil changes',
          'Compact modular footprint suited for skid-mounted mobile equipment',
        ],
        applications: [
          'Fish & Shrimp Farming Aeration',
          'Flour Mill Pneumatic Transfer',
          'Vacuum Priming & Suction Systems',
          'Light Pneumatic Conveying Lines',
        ],
        images: [
          '/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
        ],
        seoTitle: 'Air-Cooled Roots Blower Manufacturer in India | SAE Roots Blower',
        seoDescription: 'High-efficiency Air-Cooled Roots Blowers with zero water cooling requirement. Ideal for aquaculture, flour mills, and wastewater aeration by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Water-Cooled Roots Blower',
        slug: 'water-cooled-roots-blower',
        shortDescription: 'Heavy-duty water-jacketed rotary air blowers for continuous high-pressure industrial applications up to 1.2 kg/cm².',
        longDescription: 'When operating pressures exceed 0.6 kg/cm², adiabatic air compression generates substantial thermal rise. Shree Ambika Engineering Water-Cooled Roots Blowers incorporate cast water jackets surrounding the main cylinder and end plates. Circulating cooling water actively extracts compression heat, stabilizing internal clearances, preventing rotor expansion, and extending bearing and seal life during 24/7 continuous runs.',
        specifications: [
          { key: 'Flow Rate Range', value: '50 m³/hr to 12,000 m³/hr' },
          { key: 'Discharge Pressure', value: '0.6 kg/cm² to 1.2 kg/cm² (6,000 to 12,000 mmWG)' },
          { key: 'Cooling Water Rate', value: '2 to 15 Liters per Minute (depending on frame size)' },
          { key: 'Max Air Temp Rise', value: 'Controlled under 85°C' },
          { key: 'Gear Material', value: 'Case-Hardened S.G. Iron / 20MnCr5 Alloy Steel' },
        ],
        features: [
          'Integral water cooling jacket prevents rotor thermal expansion and casing seizure',
          'Engineered for harsh, high-ambient Middle Eastern and tropical summer environments',
          'Heavy spheroidal graphite timing gears ground to AGMA Class 11 precision',
          'Labyrinth seals with Viton piston rings for zero leakage under high pressure',
        ],
        applications: [
          'Cement Plants & Raw Meal Fluidization',
          'Steel Plants & Cupola Furnaces',
          'Dense-Phase Pneumatic Conveying Systems',
          'High Vacuum Exhausters & Biogas Boosting',
        ],
        images: [
          '/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/air-cooled-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Water Cooled Roots Blower Manufacturer in India | High Pressure Blower | SAE',
        seoDescription: 'Heavy-duty Water Cooled Roots Blowers for continuous high pressure duty up to 1.2 kg/cm². Manufactured by Shree Ambika Engineering with export to UAE & Saudi Arabia.',
        status: 'published',
      },
      {
        title: 'Cement Bulker Unloading System',
        slug: 'cement-bulker-unloading-system',
        shortDescription: 'Complete high-pressure blower systems for rapid pneumatic discharging of dry bulk cement, fly ash, and bentonite road bulkers.',
        longDescription: 'The Shree Ambika Engineering Cement Bulker Unloading System is an integrated, heavy-duty pneumatic unloading package engineered specifically for cement tankers, fly ash bulkers, and bulk dry powder road transporters. Powered by our high-capacity positive displacement blower, it pressurizes the bulker tank and conveys 25 to 40 metric tons of dry cement into elevated storage silos in 25 to 40 minutes, minimizing tanker turnaround time and eliminating downtime.',
        specifications: [
          { key: 'Discharge Capacity', value: '25 to 45 Metric Tons per Hour' },
          { key: 'Operating Pressure', value: '1.5 to 2.2 bar (kg/cm²)' },
          { key: 'Drive Configuration', value: 'Electric Motor Driven / Diesel Engine Skid / PTO Driven' },
          { key: 'Blower Air Flow', value: '450 CFM to 850 CFM' },
          { key: 'Vertical Conveying Height', value: 'Up to 45 meters silo elevation' },
          { key: 'Horizontal Conveying Run', value: 'Up to 120 meters pipeline distance' },
        ],
        features: [
          'Unloads a 30-ton cement bulker tanker in approximately 30 minutes',
          'Direct drive or heavy V-belt options with quick-disconnect camlock couplings',
          'Integrated pressure relief safety valve, check valve, and vibration isolators',
          'Dust-tight heavy steel skid base with weather-proof protective canopy',
          'Heavily utilized across ready-mix concrete (RMC) plants in India, Dubai, and Saudi Arabia',
        ],
        applications: [
          'Ready-Mix Concrete (RMC) Batching Plants',
          'Fly Ash Transshipment Terminals',
          'Precast Concrete & Cement Siding Plants',
          'Port & Rail Bulk Material Depots',
        ],
        images: [
          '/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Cement Bulker Unloading System Manufacturer in India & UAE | SAE',
        seoDescription: 'High-speed Cement Bulker Unloading Systems by Shree Ambika Engineering. Fast pneumatic discharge for cement, fly ash, and RMC batching plants in India, Dubai & UAE.',
        status: 'published',
      },
      {
        title: 'Pneumatic Conveying System',
        slug: 'pneumatic-conveying-system',
        shortDescription: 'Engineered positive pressure and vacuum pneumatic conveying packages for damage-free bulk powder and granule transport.',
        longDescription: 'Shree Ambika Engineering designs and manufactures complete Pneumatic Conveying Systems utilizing our positive displacement Roots blowers as prime movers. Suitable for both dilute-phase and dense-phase pneumatic transport, our systems convey dry bulk solids—including cement, fly ash, plastic granules, chemical powders, grains, and sugar—through fully enclosed dust-free pipelines, eliminating spillage and product contamination.',
        specifications: [
          { key: 'Conveying Capacity', value: '1 to 60 Metric Tons per Hour' },
          { key: 'Conveying Distance', value: 'Up to 500 meters horizontal, 50 meters vertical' },
          { key: 'Operating Mode', value: 'Positive Pressure / Negative Vacuum Suction / Push-Pull' },
          { key: 'Pipeline Diameter', value: '50 mm to 300 mm NB Pipe' },
          { key: 'Air Mover', value: 'SAE Twin Lobe or Tri Lobe Roots Blower' },
        ],
        features: [
          'Enclosed, clean conveying with zero dust emission into the plant environment',
          'Flexible pipe routing navigating existing factory obstacles with ease',
          'Equipped with rotary airlock feeder, blow-through valves, and cyclone receivers',
          'Engineered velocity controls to prevent pipeline clogging and pipe wall erosion',
        ],
        applications: [
          'Cement & Fly Ash Conveying',
          'Flour Mills & Food Ingredient Transfer',
          'Plastic Resin & Pellet Conveyance',
          'Chemical Powder & Pigment Packaging',
        ],
        images: [
          '/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
        ],
        seoTitle: 'Pneumatic Conveying System Manufacturer | Bulk Powder Transport | SAE',
        seoDescription: 'Turnkey Pneumatic Conveying Systems by Shree Ambika Engineering. Reliable pressure and vacuum transport of cement, fly ash, food powders, and plastic pellets.',
        status: 'published',
      },
      {
        title: 'Roots Blower Motors & Drive Packages',
        slug: 'roots-blower-motors',
        shortDescription: 'Industrial-duty electric motors, flameproof drives, and heavy-duty pulley transmission systems matched for Roots blowers.',
        longDescription: 'Roots blowers demand electric motors capable of handling high starting torque and continuous thermal loads under varying back-pressures. Shree Ambika Engineering supplies fully certified IE2, IE3, and premium IE4 energy-efficient electric motors, flameproof Ex-d motors for hazardous environments, and dual-rated 50Hz/60Hz motors configured specifically for Middle East and international power grids.',
        specifications: [
          { key: 'Power Rating Range', value: '1.5 kW to 250 kW (2 HP to 335 HP)' },
          { key: 'Energy Efficiency Class', value: 'IE2, IE3 (Premium Efficiency), IE4 (Super Premium)' },
          { key: 'Grid Frequency', value: '50 Hz (India/Europe) & 60 Hz (GCC/Saudi/Americas)' },
          { key: 'Ingress Protection', value: 'IP55 Standard / IP65 for Heavy Desert Dust' },
          { key: 'Hazardous Certifications', value: 'PESO / ATEX / IECEx Flameproof Ex-d Zone 1 & 2' },
          { key: 'Insulation Class', value: 'Class F with Class B temperature rise limit' },
        ],
        features: [
          'High starting torque design overcoming initial inertia of heavy blower rotors',
          'Cast iron robust frame dampening motor vibrations and ensuring shaft alignment',
          'VFD-compatible copper windings with specialized surge-resistant insulation',
          'Supplied with matched taper-lock pulleys, anti-static V-belts, and belt guards',
        ],
        applications: [
          'Roots Blower Prime Drives',
          'Hazardous Zone Petrochemical Boosters',
          'VFD Aeration Control Systems',
          'High-Ambient Middle East Factory Installations',
        ],
        images: [
          '/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Roots Blower Motor Manufacturer & Supplier in India | SAE Roots Blower',
        seoDescription: 'High starting torque IE3/IE4 electric motors and flameproof drives for Roots blowers. Engineered by Shree Ambika Engineering for Indian and GCC electrical grids.',
        status: 'published',
      },
      {
        title: 'Industrial Air Blowers & Rotary Exhausters',
        slug: 'industrial-air-blowers',
        shortDescription: 'Versatile positive displacement rotary lobe air movers for combustion air, drying knives, agitation, and process vacuum.',
        longDescription: 'Shree Ambika Engineering Industrial Air Blowers provide reliable positive displacement air movement across hundreds of heavy manufacturing processes. Engineered to replace noisy and energy-inefficient centrifugal fans in high-resistance applications, these blowers deliver constant volume displacement up to 10,000 m³/hr, ideal for furnace blast air, drying knives, vacuum packaging, and paper converting lines.',
        specifications: [
          { key: 'Displacement Range', value: '20 m³/hr to 10,000 m³/hr' },
          { key: 'Pressure Head', value: '0.1 to 1.0 kg/cm² Positive Pressure' },
          { key: 'Vacuum Level', value: 'Down to -5,000 mmWG (-50 kPa) Vacuum' },
          { key: 'Casing Construction', value: 'High Grade Cast Iron FG 260 / S.G. Iron' },
          { key: 'Air Characteristics', value: '100% Oil-Free, Dry & Pulsation-Controlled' },
        ],
        features: [
          'Maintains steady air velocity regardless of duct resistance and filter loading',
          'Bi-directional rotational capability for positive pressure or suction duty',
          'Low mechanical wear with no internal friction parts touching the casing',
          'Compact skid base ready for plug-and-play mechanical installation',
        ],
        applications: [
          'Combustion Air for Furnaces and Boilers',
          'Industrial Drying Knives & Part Blow-off',
          'Electroplating Tank Solution Agitation',
          'Central Vacuum Cleaning & Priming Systems',
        ],
        images: [
          '/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
        ],
        seoTitle: 'Industrial Air Blowers & Rotary Exhausters | Manufacturer India | SAE',
        seoDescription: 'Heavy-duty industrial air blowers and vacuum exhausters by Shree Ambika Engineering. Constant volume displacement for combustion, drying, and manufacturing.',
        status: 'published',
      },
      {
        title: 'Tri Lobe Roots Blower',
        slug: 'tri-lobe-roots-blower',
        shortDescription: 'Advanced tri lobe rotor design offering 50% lower pressure pulsations, reduced noise, and extended bearing lifespan.',
        longDescription: 'The Tri Lobe Roots Blower from Shree Ambika Engineering features a three-lobe rotor profile that significantly reduces gas backflow pulsations, resulting in quieter operation and lower mechanical strain on bearings and gears. This premium engineering choice ensures exceptional performance in sensitive municipal water treatment and indoor manufacturing applications.',
        specifications: [
          { key: 'Flow Rate Capacity', value: '20 m³/hr to 8,500 m³/hr' },
          { key: 'Pressure Range', value: '0.1 kg/cm² to 0.8 kg/cm²' },
          { key: 'Pulsation Reduction', value: 'Up to 50% lower pulsation compared to 2-lobe' },
          { key: 'Noise Level', value: 'Below 78 dB(A) with discharge silencer' },
          { key: 'Lubrication', value: 'Dual Splash Oil Lubrication' },
        ],
        features: [
          'Tri-lobe design reduces pulsations by up to 50%, prolonging pipe and diffuser lifespan',
          'Extended bearing life due to reduced shock loading on shafts and timing gears',
          'Highly efficient cooling design maintaining minimal rotor thermal expansion',
          'Precision machined components using 4-axis CNC technology',
        ],
        applications: [
          'Low Noise Municipal Wastewater Aeration',
          'Pneumatic Conveying in Food & Pharma Plants',
          'Aquaculture Aeration Close to Residential Belts',
          'Indoor Industrial Process Air',
        ],
        images: [
          '/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
          'https://saerootsblower.com/images/products/twin-lobe-roots-blower.webp',
        ],
        seoTitle: 'Tri Lobe Roots Blower | Reduced Noise Industrial Blower | SAE',
        seoDescription: 'Get premium Tri Lobe Roots Blowers with low noise design, minimal vibration, and maximum reliability. Manufactured by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Acoustic Hood Roots Blower System',
        slug: 'acoustic-hood-roots-blower-system',
        shortDescription: 'Complete blower package enclosed in a soundproof acoustic enclosure for noise-sensitive municipal and industrial installations.',
        longDescription: 'For installations near residential areas, commercial zones, or where factory safety standards limit sound exposure, Shree Ambika Engineering provides fully integrated Acoustic Enclosures. These custom-engineered hoods reduce blower operating noise levels by up to 15-20 dB(A) while incorporating proper forced ventilation to keep the motor and blower cool.',
        specifications: [
          { key: 'Noise Attenuation', value: '15 dB(A) to 25 dB(A) sound reduction' },
          { key: 'Enclosure Body', value: 'Heavy Gauge CRCA Steel Sheet with Acoustic Foam' },
          { key: 'Forced Cooling', value: 'Integrated Explosion-Proof or Standard Exhaust Fan' },
          { key: 'Service Access', value: 'Removable Lockable Panels for 360-degree Maintenance' },
        ],
        features: [
          'Meets OSHA and Central Pollution Control Board (CPCB) sound emission criteria',
          'Weather-proof construction designed for outdoor uncovered installations',
          'Integrated forced ventilation system prevents motor thermal tripping',
          'Quick-release lockable doors for easy belt tensioning and oil level checks',
        ],
        applications: [
          'Municipal STP Plants in Urban Areas',
          'Hospital & Commercial Complex Sewage Systems',
          'Indoor Cleanroom Blower Rooms',
          'Noise-Controlled Industrial Factory Floors',
        ],
        images: [
          '/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/etp-stp-roots-blower.webp',
          'https://saerootsblower.com/images/products/roots-blower.webp',
        ],
        seoTitle: 'Acoustic Hood Blower Systems | Soundproof Blower Package | SAE',
        seoDescription: 'Acoustic Hood Roots Blower systems by Shree Ambika Engineering. Reduce factory noise and comply with environmental safety regulations.',
        status: 'published',
      },
    ];
    await Product.insertMany(productsData);

    // 4. Clear and Re-seed Blogs (The 10 High-Intent Strategic Articles)
    await Blog.deleteMany({});
    const blogsData = [
      {
        title: 'Roots Blower Price in India – Complete Industrial Buying Guide',
        slug: 'roots-blower-price-in-india-buying-guide',
        excerpt: 'An engineer’s complete guide to Roots blower pricing factors in India: capacity (CFM), discharge pressure, cooling mechanisms, motor ratings, and total cost of ownership.',
        content: `<h2>Understanding Roots Blower Pricing in India</h2><p>When procurement managers and plant engineers evaluate <strong>Roots Blower prices in India</strong>, they frequently find that quotes vary widely—from ₹45,000 for compact bare-shaft units to ₹4,50,000+ for large water-cooled or acoustic hood packages. Understanding the engineering variables behind these prices ensures you select the most cost-effective machine without sacrificing reliability.</p><h2>Key Factors That Determine Roots Blower Cost</h2><ul><li><strong>Flow Capacity (CFM / m³/hr):</strong> Larger rotor displacement requires larger cast-iron casings, heavier shafts, and higher horsepower motors.</li><li><strong>Operating Pressure (kg/cm²):</strong> Blowers operating above 0.6 kg/cm² require water cooling jackets and precision-ground timing gears, increasing manufacturing costs.</li><li><strong>Drive and Motor Efficiency:</strong> Upgrading from an IE2 to an energy-efficient IE3 or IE4 motor adds initial cost but delivers 15-20% electricity savings annually.</li><li><strong>Acoustic Hoods & Silencers:</strong> Enclosing the blower in a noise-attenuating CRCA hood adds ₹25,000 to ₹75,000 depending on size.</li></ul><h2>Total Cost of Ownership (TCO) vs Initial Price</h2><p>In continuous 24/7 operations like wastewater aeration or cement conveying, electricity accounts for over 75% of the total 5-year lifecycle cost. Purchasing a precision-machined blower from Shree Ambika Engineering with dynamically balanced rotors pays for itself within months through lower power consumption and fewer bearing replacements.</p>`,
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'Pricing Guide',
        tags: ['Roots Blower Price', 'Twin Lobe Blower Cost', 'B2B Procurement', 'Industrial Engineering'],
        seoTitle: 'Roots Blower Price in India – Complete Buying Guide | SAE',
        seoDescription: 'Comprehensive industrial guide to Roots Blower prices in India. Compare CFM, pressure ratings, motor power, and lifecycle costs by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'How to Select the Right Roots Blower for Industrial Applications',
        slug: 'how-to-select-roots-blower-for-industrial-applications',
        excerpt: 'Step-by-step technical guide to calculating air volume, operating pressure head, motor sizing, and cooling methods for positive displacement blowers.',
        content: `<h2>Engineering Principles of Roots Blower Sizing</h2><p>Selecting the optimal Roots blower requires precise calculation of the process air volume (CFM or m³/hr) and total back-pressure (kg/cm² or mmWG). Unlike centrifugal fans where airflow fluctuates with pressure variations, Roots blowers are positive displacement machines delivering a constant volume per revolution.</p><h2>Step 1: Calculate Actual Air Mass Flow</h2><p>Account for ambient temperature and site altitude. For example, installations in high-altitude zones like Bangalore (920m) require higher volumetric displacement to deliver the same mass of oxygen as sea-level facilities.</p><h2>Step 2: Determine System Back-Pressure</h2><p>Calculate hydrostatic water head (in aeration tanks) plus friction losses across pipe bends, check valves, and air diffusers.</p><h2>Step 3: Select Cooling Method</h2><p>For discharge pressures below 0.6 kg/cm², an air-cooled blower is typically sufficient. Above 0.6 kg/cm², a water-cooled jacket is mandatory to prevent rotor thermal expansion.</p>`,
        featuredImage: '/images/products/roots-blower.webp',
        category: 'Engineering Guide',
        tags: ['Blower Sizing', 'CFM Calculation', 'Pressure Head', 'Technical Selection'],
        seoTitle: 'How to Select the Right Roots Blower | Engineering Sizing Guide | SAE',
        seoDescription: 'Learn how to accurately size and select a Roots Blower for your plant. Step-by-step engineering formulas for volume, pressure, and motor power.',
        status: 'published',
      },
      {
        title: 'Cement Bulker Unloading System: Working, Applications and Benefits',
        slug: 'cement-bulker-unloading-system-working-benefits',
        excerpt: 'Detailed analysis of pneumatic cement bulker unloading systems: how positive pressure blowers discharge 30 tons of cement in 30 minutes with zero dust loss.',
        content: `<h2>The Need for High-Speed Bulker Unloading</h2><p>In modern infrastructure and ready-mix concrete (RMC) batching plants, road tanker turnaround speed is vital. An efficient <strong>Cement Bulker Unloading System</strong> pressurizes the tanker shell and aerates the pulverized cement, fluidizing it so it flows effortlessly through delivery hoses into elevated silos.</p><h2>Working Principle of the System</h2><p>The system utilizes a high-capacity Roots blower delivering 500 to 750 CFM at 1.8 to 2.0 kg/cm² pressure. Air is split into two streams: one pressurizes the upper tanker headspace, and the other injects air through fluidization canvas pads at the bottom cones. The fluidized cement is entrained into the discharge pipeline and conveyed directly to the top of the silo.</p><h2>Key Benefits for RMC Plants</h2><ul><li><strong>Rapid Turnaround:</strong> Empty a 30-ton bulker tanker in under 35 minutes.</li><li><strong>Zero Contamination:</strong> Fully enclosed pneumatic transfer eliminates airborne dust and cement waste.</li><li><strong>Low Operating Cost:</strong> Direct electric motor or PTO drive options reduce diesel consumption.</li></ul>`,
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'Material Handling',
        tags: ['Cement Bulker', 'Pneumatic Unloading', 'RMC Plant Equipment', 'Fly Ash Handling'],
        seoTitle: 'Cement Bulker Unloading System: Working & Benefits | SAE',
        seoDescription: 'Discover how Cement Bulker Unloading Systems work. Rapid pneumatic discharging for cement, fly ash, and RMC batching plants by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Best Roots Blower for Wastewater Treatment Plants (STP/ETP)',
        slug: 'best-roots-blower-wastewater-treatment-plants',
        excerpt: 'Comparing twin lobe, tri lobe, and turbo blowers for continuous biological sewage aeration. How to optimize oxygen transfer efficiency and lower power bills.',
        content: `<h2>The Role of Continuous Aeration in Biological Sewage Digestion</h2><p>Wastewater aeration typically consumes over 55% of an STP/ETP facility’s total electrical energy. Selecting the most efficient and reliable blower is the single most critical engineering decision for plant managers.</p><h2>Why Positive Displacement Roots Blowers Remain the Industry Standard</h2><ul><li><strong>Constant Flow Against Variable Water Head:</strong> When water levels in aeration tanks rise, Roots blowers maintain their delivered CFM without stalling.</li><li><strong>100% Oil-Free Delivery:</strong> Zero oil vapor ensures aerobic bacterial colonies remain healthy and active.</li><li><strong>Rugged Simplicity:</strong> Simple mechanical timing gears and roller bearings operate reliably in humid, corrosive wastewater environments where high-speed magnetic turbo blowers frequently suffer electronic faults.</li></ul>`,
        featuredImage: '/images/products/etp-stp-roots-blower.webp',
        category: 'Wastewater Treatment',
        tags: ['STP Blower', 'ETP Aeration', 'Sewage Treatment', 'Biological Digestion'],
        seoTitle: 'Best Roots Blower for Wastewater Treatment Plants | STP/ETP | SAE',
        seoDescription: 'Find the best Roots Blower for STP and ETP wastewater treatment plants. Compare aeration efficiency, noise levels, and 24/7 reliability.',
        status: 'published',
      },
      {
        title: 'Twin Lobe vs Three Lobe Roots Blower: Mechanical Comparison',
        slug: 'twin-lobe-vs-three-lobe-roots-blower',
        excerpt: 'Understanding the mechanical differences between 2-lobe and 3-lobe rotary blowers: noise levels, pressure pulsations, mechanical stress, and volumetric efficiency.',
        content: `<h2>Deciding Between Twin Lobe and Tri Lobe Configurations</h2><p>Both twin lobe (two lobes per rotor) and tri lobe (three lobes per rotor) machines operate on the positive displacement rotary principle. However, their internal dynamics differ significantly.</p><h2>1. Pressure Pulsations and Noise Footprint</h2><p>A twin-lobe blower discharges air twice per rotor revolution, whereas a tri-lobe blower discharges three times. This higher frequency discharge reduces pressure pulsations by up to 50%, resulting in dramatically quieter operation (3 to 5 dB(A) lower) and less pipe resonance.</p><h2>2. Bearing and Gear Lifespan</h2><p>Because pressure spikes are smoothed out in tri-lobe designs, timing gears and shaft bearings experience lower shock loads, leading to longer service intervals.</p><h2>3. Volumetric Efficiency</h2><p>For identical casing dimensions, twin-lobe blowers offer slightly higher displacement volume. However, tri-lobe blowers are the preferred modern choice for noise-sensitive municipal and industrial environments.</p>`,
        featuredImage: '/images/products/roots-blower.webp',
        category: 'Product Comparison',
        tags: ['Twin Lobe', 'Tri Lobe', 'Blower Comparison', 'Mechanical Engineering'],
        seoTitle: 'Twin Lobe vs Three Lobe Roots Blower Comparison | SAE Blog',
        seoDescription: 'Compare Twin Lobe and Tri Lobe Roots Blowers. Learn how pressure pulsations, noise levels, and mechanical stress impact equipment selection.',
        status: 'published',
      },
      {
        title: 'How to Select the Right Motor for a Roots Blower',
        slug: 'how-to-select-motor-for-roots-blower',
        excerpt: 'Technical guide to electric motor selection for rotary blowers: starting torque, service factor, IE efficiency classes, and VFD integration.',
        content: `<h2>Why Motor Sizing is Critical for Roots Blowers</h2><p>Roots blowers are constant-torque machines. When the discharge line experiences back-pressure, the motor must supply immediate torque to overcome resistance. Undersized motors overheat and trip on thermal overload during startup or pressure spikes.</p><h2>Key Motor Selection Criteria</h2><ul><li><strong>Starting Torque:</strong> Must be at least 150% to 200% of full load torque to overcome cold gear oil friction and system back-pressure.</li><li><strong>Energy Efficiency Class:</strong> Specifying an IE3 (Premium Efficiency) motor delivers up to 4% higher electrical efficiency than standard IE1 motors, saving thousands in annual electricity costs.</li><li><strong>Service Factor:</strong> Ensure a minimum service factor of 1.15 to handle temporary pressure surges.</li><li><strong>VFD Compatibility:</strong> If speed regulation is needed, ensure the motor has insulated bearings and Class H insulation to resist voltage spikes.</li></ul>`,
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'Drive Systems',
        tags: ['Roots Blower Motor', 'Electric Motor Sizing', 'IE3 Motor', 'VFD Compatibility'],
        seoTitle: 'How to Select the Right Motor for a Roots Blower | SAE Guide',
        seoDescription: 'Expert guide on sizing and selecting the right electric motor for Roots blowers. Learn about starting torque, IE3 efficiency, and VFD compatibility.',
        status: 'published',
      },
      {
        title: 'Roots Blower Maintenance and Troubleshooting Guide',
        slug: 'roots-blower-maintenance-troubleshooting-guide',
        excerpt: 'Comprehensive maintenance checklist: oil change intervals, bearing lubrication, belt tensioning, and troubleshooting overheating, noise, or pressure drops.',
        content: `<h2>Preventative Maintenance Checklist for Rotary Blowers</h2><p>Routine preventative maintenance guarantees over 50,000 hours of trouble-free operation from your Shree Ambika Engineering Roots blower. Follow this checklist to prevent unexpected shutdowns.</p><h2>Daily & Weekly Checks</h2><ul><li><strong>Check Oil Levels:</strong> Inspect sight glasses at both gear and drive end sumps while the blower is stopped.</li><li><strong>Monitor Operating Temperature:</strong> Oil temperature should not exceed 100°C; casing temperatures should remain under 110°C.</li><li><strong>Air Filter Restriction:</strong> Clean or replace the inlet air filter element when pressure drop exceeds 250 mmWG.</li></ul><h2>Troubleshooting Common Issues</h2><ul><li><strong>Blower Overheating:</strong> Typically caused by excessive back-pressure, dirty suction filter, or low/overfilled gear oil.</li><li><strong>Knocking or Rattling Noise:</strong> Check for timing gear wear, loose taper lock pulleys, or bearing failure.</li><li><strong>Loss of Air Flow:</strong> Inspect for slipping V-belts or worn rotor clearances.</li></ul>`,
        featuredImage: '/images/products/roots-blower.webp',
        category: 'Maintenance & Service',
        tags: ['Roots Blower Maintenance', 'Troubleshooting Guide', 'Oil Change Interval', 'Bearing Replacement'],
        seoTitle: 'Roots Blower Maintenance & Troubleshooting Guide | SAE',
        seoDescription: 'Complete preventative maintenance and troubleshooting guide for Roots blowers. Resolve overheating, noise, vibration, and pressure drops.',
        status: 'published',
      },
      {
        title: 'Pneumatic Conveying System for Cement Industries: Complete Process',
        slug: 'pneumatic-conveying-system-cement-industries',
        excerpt: 'How positive displacement blowers power pneumatic fly ash and cement conveying in modern cement manufacturing and ready-mix concrete plants.',
        content: `<h2>The Mechanics of Pneumatic Cement Conveyance</h2><p>Moving abrasive pulverized cement and fly ash using mechanical screw conveyors or bucket elevators incurs high wear and costly downtime. Pneumatic conveying using positive displacement Roots blowers is the modern industry standard for continuous, dust-free bulk material transport.</p><h2>Dilute Phase vs Dense Phase Conveying</h2><p>In dilute phase conveying, high-velocity air (18 to 25 m/s) suspends cement particles like dust in the pipeline. In dense phase systems, low-velocity air (4 to 10 m/s) pushes slugs of cement under higher pressures (up to 1.5 to 2.0 kg/cm²), minimizing pipeline abrasion and product degradation.</p><h2>Why SAE Blowers are Preferred by Cement Plants</h2><p>Our heavy-duty water-cooled blowers operate reliably against continuous 1.0 kg/cm² back-pressure in high-dust plant environments, moving up to 50 tons per hour over distances exceeding 300 meters.</p>`,
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'Cement Industry',
        tags: ['Cement Conveying', 'Fly Ash Pneumatic', 'Dilute Phase Conveying', 'Cement Plant Equipment'],
        seoTitle: 'Pneumatic Conveying System for Cement Industries | Process Guide | SAE',
        seoDescription: 'Learn how pneumatic conveying systems transport dry cement and fly ash efficiently. Technical design criteria for cement manufacturing plants.',
        status: 'published',
      },
      {
        title: 'Roots Blower Suppliers in Dubai and UAE: Sourcing High-Ambient Equipment',
        slug: 'roots-blower-suppliers-in-dubai-and-uae',
        excerpt: 'An industrial buyer’s guide for sourcing Roots blowers in Dubai, Abu Dhabi, and the UAE: 50°C+ ambient adaptations, Jebel Ali shipping, and direct factory pricing from India.',
        content: `<h2>Industrial Demand for Roots Blowers in Dubai and UAE</h2><p>Across the United Arab Emirates, Roots blowers play a vital role in municipal wastewater aeration, ready-mix concrete batching, port dry bulk unloading, and desalination plant air scour systems. However, Middle East operating conditions present severe engineering challenges that standard blowers cannot survive.</p><h2>Critical Engineering Adaptations for the UAE Climate</h2><ul><li><strong>52°C Ambient Heat Dissipation:</strong> High ambient desert temperatures require water-jacketed casings or oversized cast-iron cooling ribs to prevent rotor seizure.</li><li><strong>High-Temperature Lubricants:</strong> Fully synthetic gear oils rated for continuous operation above 120°C.</li><li><strong>Dust & Sand Protection:</strong> Two-stage sand-trap inlet filters preventing fine quartz desert sand from reaching the internal compression chamber.</li></ul><h2>The Advantage of Direct Factory Sourcing from Gujarat, India</h2><p>Located in Ahmedabad near Mundra and Kandla ports, Shree Ambika Engineering delivers containerized blowers directly to Jebel Ali Port, Dubai within 4 to 6 transit days. UAE contractors benefit from direct factory pricing, full manufacturer warranties, and ready availability of spare parts.</p>`,
        featuredImage: '/images/products/roots-blower.webp',
        category: 'International Sourcing',
        tags: ['Roots Blower Dubai', 'Roots Blower UAE', 'Jebel Ali Sourcing', 'High Ambient Blower'],
        seoTitle: 'Roots Blower Suppliers in Dubai and UAE | Sourcing from India | SAE',
        seoDescription: 'How to source industrial Roots blowers in Dubai and the UAE. 50°C+ ambient engineering, fast Jebel Ali shipping, and direct factory pricing by Shree Ambika Engineering.',
        status: 'published',
      },
      {
        title: 'Industrial Roots Blower Applications in Saudi Arabia (KSA Vision 2030)',
        slug: 'industrial-roots-blower-applications-in-saudi-arabia',
        excerpt: 'Exploring the growing demand for positive displacement blowers in Saudi Arabia: water reuse projects, cement logistics, SASO compliance, and petrochemical plants.',
        content: `<h2>Saudi Vision 2030 Industrial Expansion</h2><p>Under the Kingdom of Saudi Arabia’s Vision 2030 initiatives, massive infrastructure development, water recycling megaprojects, and industrial cities in Riyadh, Jeddah, and Jubail are driving unprecedented demand for reliable <strong>positive displacement Roots blowers</strong>.</p><h2>Primary Industrial Sectors in Saudi Arabia</h2><ul><li><strong>Water Recycling & STP Plants:</strong> Municipal effluent treatment facilities across Riyadh and Eastern Province rely on continuous oil-free aeration to purify water for agricultural and industrial reuse.</li><li><strong>Cement & Construction Logistics:</strong> Moving thousands of tons of dry bulk cement daily using high-pressure bulker unloading systems.</li><li><strong>Petrochemical & Auxiliary Gas Boosting:</strong> Flare gas recovery and inert gas displacement in Jubail and Yanbu industrial complexes.</li></ul><h2>SASO and Saber Compliance for Seamless Import</h2><p>Shree Ambika Engineering provides full SASO/Saber conformity documentation, Chamber-attested commercial invoices, and factory inspection certificates, ensuring hassle-free clearance through King Abdulaziz Port (Dammam) and Jeddah Islamic Port.</p>`,
        featuredImage: '/images/products/twin-lobe-roots-blower.webp',
        category: 'International Sourcing',
        tags: ['Roots Blower Saudi Arabia', 'SABER Compliant Blower', 'Cement Bulker Riyadh', 'Jubail Industrial'],
        seoTitle: 'Industrial Roots Blower Applications in Saudi Arabia | Vision 2030 | SAE',
        seoDescription: 'Discover Roots blower applications in Saudi Arabia. Supporting water recycling, cement handling, and petrochemical plants with SASO-compliant blowers.',
        status: 'published',
      },
    ];
    await Blog.insertMany(blogsData);

    // 5. Clear and Re-seed Gallery
    await Gallery.deleteMany({});
    const galleryData = [
      { title: 'CNC Rotor Machining Center', category: 'Infrastructure', type: 'image', image: '/images/gallery/gallery_cnc_machining.png' },
      { title: 'Roots Blower Quality Testing Bench', category: 'Quality Control', type: 'image', image: '/images/gallery/gallery_roots_blower_testing.png' },
      { title: 'Heavy Duty Blower Casing Casting', category: 'Manufacturing', type: 'image', image: '/images/gallery/gallery_heavy_duty_casting.png' },
      { title: 'Tri-Lobe Blower Assembly Line', category: 'Manufacturing', type: 'image', image: '/images/gallery/gallery_blower_assembly.png' },
      { title: 'Wastewater Aeration System', category: 'Installation', type: 'image', image: '/images/gallery/gallery_wastewater_aeration.png' },
      { title: 'Aquaculture Water Aeration Tanks', category: 'Installation', type: 'image', image: '/images/gallery/gallery_aquaculture_blower.png' },
      { title: 'Pneumatic Conveying Layout', category: 'Installation', type: 'image', image: '/images/gallery/gallery_pneumatic_conveying.png' },
      { title: 'Acoustic Soundproof Enclosure Package', category: 'Manufacturing', type: 'image', image: '/images/gallery/gallery_soundproof_enclosure.png' },
      { title: 'Finished Twin-Lobe Blower Unit', category: 'Manufacturing', type: 'image', image: '/images/gallery/gallery_finished_twin_lobe.png' },
      { title: 'Finished Tri-Lobe Blower Unit', category: 'Manufacturing', type: 'image', image: '/images/gallery/gallery_finished_tri_lobe.png' },
      { title: 'Shree Ambika Engineering Factory Exterior', category: 'Infrastructure', type: 'image', image: '/images/gallery/gallery_factory_facade.png' },
    ];
    await Gallery.insertMany(galleryData);

    return NextResponse.json(
      {
        message: 'Database successfully re-seeded with 10 core industrial products, 10 SEO cornerstone blogs, and gallery assets',
        productsSeeded: productsData.length,
        blogsSeeded: blogsData.length,
        gallerySeeded: galleryData.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Server error during seeding', details: error.message }, { status: 500 });
  }
}
