import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaIndustry, FaInfoCircle, FaFileContract, FaRegLightbulb } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const applicationsData = {
  'wastewater-treatment': {
    title: 'Wastewater Treatment (Aeration)',
    metaTitle: 'Roots Blowers for Wastewater Treatment Aeration | SAE',
    metaDesc: 'Explore positive displacement air blowers for municipal sewage treatment (STP) and industrial effluent treatment (ETP) aeration tanks by Shree Ambika Engineering.',
    overview: 'Biological wastewater treatment relies heavily on aerobic bacteria that digest organic waste. To support these bacteria, aeration tanks require a constant, high-volume flow of air. Positive displacement roots blowers are the standard choice because they provide reliable flow even against hydrostatic pressure.',
    requirements: [
      '100% Oil-Free air: Essential because any oil in the airflow kills the aerobic bacteria and disrupts digestion.',
      'Continuous 24/7 operation: STPs run constantly; therefore, timing gears, casings, and bearings must withstand continuous friction and heat.',
      'Volumetric efficiency: Minimizing power consumption, which is critical since aeration typically accounts for 60% of a plant\'s energy budget.',
    ],
    technicalTips: 'For smaller aeration tanks (under 4m depth), air-cooled twin lobe blowers are efficient. For deeper aeration tanks or higher resistance, water-jacketed casings or tri-lobe options with low sound footprints are recommended.',
  },
  'aquaculture-aeration': {
    title: 'Aquaculture Pond Aeration',
    metaTitle: 'Pond Aeration Roots Blowers for Shrimp & Fish Farming | SAE',
    metaDesc: 'Discover pond aeration solutions by Shree Ambika Engineering. Heavy-duty roots blowers for dissolved oxygen management in aquaculture.',
    overview: 'High-density commercial aquaculture requires active aeration to maintain dissolved oxygen levels. Insufficient oxygen leads to high mortality rates and slow growth cycles in shrimp and fish. Roots blowers supply air to diffuse tubes or grids placed at the bottom of ponds, supplying micro-bubbles to the water column.',
    requirements: [
      'Constant oxygen distribution: Aeration must reach the bottom layers of the pond to prevent anaerobic zones.',
      'Corrosion resistant installations: Aquaculture farms are humid and often use saline water, so blowers must have high-grade protective paint.',
      'Dependable safety: A blower breakdown can decimate pond populations in hours, requiring highly reliable bearing structures.',
    ],
    technicalTips: 'Tri-lobe blowers are ideal for pond aeration as they offer lower noise and vibrations, preventing stress on aquatic life located close to the blower house.',
  },
  'pneumatic-conveying': {
    title: 'Pneumatic Material Conveying',
    metaTitle: 'Pneumatic Conveying Roots Blowers | Cement, Fly Ash, Flour | SAE',
    metaDesc: 'Learn how positive displacement rotary blowers are used in pressure and vacuum pneumatic conveying of bulk solids by Shree Ambika Engineering.',
    overview: 'Pneumatic conveying is the process of moving dry bulk solids (like cement, fly ash, plastics, sand, flour, sugar) through pipelines using pressurized air or vacuum. Roots blowers serve as the prime movers by creating high-velocity air streams that entrain and transport the solids.',
    requirements: [
      'High pressure rating: Overcoming pipeline friction requires blowers that maintain flow rate under varying pressures.',
      'Robust casing seals: Ensuring no product enters the blower casing and no timing oil leaks into the conveying line.',
      'Vacuum options: Suitable for suction-based unloading from trucks, silos, or ships.',
    ],
    technicalTips: 'Water-cooled roots blowers are recommended for conveying heavy materials like cement over long distances, where continuous high back-pressures generate extreme compression heat.',
  },
  'chemical-processing': {
    title: 'Chemical & Process Industries',
    metaTitle: 'Chemical Plant Roots Blowers | Biogas Booster & Gas Handling',
    metaDesc: 'Industrial rotary blowers for corrosive chemical processes, biogas boost, and industrial gas handling by Shree Ambika Engineering.',
    overview: 'Chemical reactors, gas boosters, and petrochemical processes require controlled air and gas displacement. In these settings, roots blowers are used for gas recovery, blending materials, or boosting pressures of inert gases like nitrogen.',
    requirements: [
      'Specialized shaft sealing: Mechanical seals or double labyrinth seals to prevent toxic gas leakage.',
      'Material customizations: Casing and rotor construction options in spheroidal graphite iron, stainless steel, or specialty anti-corrosion coatings.',
      'Explosion proof motors: Safety conformance for hazardous zones.',
    ],
    technicalTips: 'Specify all process gas parameters, temperatures, and chemical compositions so our engineers can configure the correct gasket materials and alloy shafts.',
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = applicationsData[slug];

  if (!data) {
    return { title: 'Application Not Found' };
  }

  return {
    title: data.metaTitle,
    description: data.metaDesc,
  };
}

export default async function ApplicationDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;
  const data = applicationsData[slug];

  if (!data) {
    notFound();
  }

  // Find products that match this application title dynamically
  const matchRegex = new RegExp(data.title.split(' ')[0], 'i'); // e.g. Wastewater, Aquaculture, Pneumatic, Chemical
  const suitableProducts = await Product.find({
    status: 'published',
    $or: [
      { applications: { $regex: matchRegex } },
      { title: { $regex: matchRegex } },
    ],
  });

  return (
    <div className="bg-bg-custom min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-borders-custom py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/applications" className="hover:text-primary">Applications</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{data.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-8 rounded-xl border border-borders-custom shadow-sm space-y-8">
          {/* Main Info */}
          <div>
            <div className="flex items-center space-x-3 text-secondary mb-3">
              <FaIndustry size={28} />
              <span className="text-xs font-bold uppercase tracking-wider">Engineering Guide</span>
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-primary">{data.title}</h1>
            <p className="text-gray-600 text-sm leading-relaxed mt-4 whitespace-pre-line">
              {data.overview}
            </p>
          </div>

          {/* Key Requirements */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-lg font-bold font-heading text-primary flex items-center space-x-2">
              <FaFileContract className="text-accent" />
              <span>Critical Engineering Requirements</span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {data.requirements.map((req, idx) => {
                const [boldText, normalText] = req.split(':');
                return (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                    <span>
                      <strong>{boldText}:</strong> {normalText}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Technical Tips */}
          <div className="bg-bg-custom border border-borders-custom p-6 rounded-lg space-y-2 flex items-start space-x-3">
            <FaRegLightbulb className="text-accent mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-heading font-bold text-primary text-sm">Engineering Selection Tip:</h4>
              <p className="text-gray-550 text-xs leading-relaxed mt-1">{data.technicalTips}</p>
            </div>
          </div>

          {/* Suitable Products Grid */}
          <div className="border-t border-gray-100 pt-8 space-y-6">
            <h3 className="text-lg font-bold font-heading text-primary flex items-center space-x-2">
              <FaInfoCircle className="text-primary" />
              <span>Recommended Blower Configurations</span>
            </h3>

            {suitableProducts.length === 0 ? (
              <p className="text-gray-500 text-xs">No specific models matching this application found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suitableProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="border border-borders-custom hover:border-accent p-4 rounded-lg flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    <div>
                      <h4 className="font-heading font-bold text-primary text-base">{prod.title}</h4>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{prod.shortDescription}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">100% Oil-Free</span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="text-xs font-bold text-primary hover:text-accent underline"
                      >
                        Technical Data
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
