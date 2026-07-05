import Link from 'next/link';

export const metadata = {
  title: 'Roots Blower Applications | Shree Ambika Engineering',
  description: 'Learn about the primary applications of Twin Lobe and Tri Lobe roots blowers, including sewage aeration, pond aeration, pneumatic material conveying, and gas compression.',
};

export const applicationsList = [
  {
    title: 'Wastewater Treatment (Aeration)',
    slug: 'wastewater-treatment',
    shortDesc: 'Continuous air supply to sustain biological sewage digestions in municipal STPs and industrial ETPs.',
    icon: '01',
  },
  {
    title: 'Aquaculture Pond Aeration',
    slug: 'aquaculture-aeration',
    shortDesc: 'Increasing dissolved oxygen levels in commercial fish and shrimp ponds to maximize aquatic survival rates.',
    icon: '02',
  },
  {
    title: 'Pneumatic Material Conveying',
    slug: 'pneumatic-conveying',
    shortDesc: 'Pressure and vacuum displacement systems for conveying dry materials like cement, fly ash, grains, and flour.',
    icon: '03',
  },
  {
    title: 'Chemical & Process Industries',
    slug: 'chemical-processing',
    shortDesc: 'Corrosive or inert gas handling, biogas booster systems, and reactor aeration under controlled environments.',
    icon: '04',
  },
];

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Industrial Applications</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            How Shree Ambika Engineering positive displacement blowers power essential processes.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applicationsList.map((app) => (
              <div
                key={app.slug}
                className="bg-white border border-borders-custom p-8 rounded-xl shadow-sm hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-extrabold font-heading text-accent/30 mb-4">{app.icon}</div>
                  <h3 className="text-2xl font-bold font-heading text-primary mb-3">{app.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{app.shortDesc}</p>
                </div>
                <div>
                  <Link
                    href={`/applications/${app.slug}`}
                    className="inline-block text-primary font-bold hover:text-accent border-b-2 border-primary hover:border-accent pb-0.5 text-sm transition-all"
                  >
                    View Engineering Details & Suitable Blowers
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
