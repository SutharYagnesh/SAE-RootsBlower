import { FaCheckCircle, FaIndustry, FaBullseye, FaSearchPlus } from 'react-icons/fa';

export const metadata = {
  title: 'About Us | Shree Ambika Engineering | Roots Blower Manufacturer',
  description: 'Learn about Shree Ambika Engineering. Since 2011, we have manufactured Twin Lobe and Tri Lobe Roots Blowers with advanced CNC machinery and rigorous quality control.',
};

export default function About() {
  const certifications = [
    'ISO 9001:2015 Quality Management System',
    'CE Compliance Certification for Industrial Machinery',
    'NSIC Registered Unit',
    'Strict conformance to BS 1571 and ISO 1217 standards for positive displacement blowers',
  ];

  const steps = [
    { title: 'Raw Material Selection', desc: 'Spheroidal graphite iron castings and high-tensile alloy shafts are thoroughly tested for structural integrity.' },
    { title: 'CNC Precision Profile Milling', desc: 'Rotor profiles are machined on CNC centers to maintain clearance tolerances down to hundredths of a millimeter.' },
    { title: 'Dynamic Balancing', desc: 'Rotors are dynamically balanced on state-of-the-art machines to eliminate vibrations and bearing stress.' },
    { title: 'Precision Gear Grinding', desc: 'Hardened timing gears are ground for quiet operation and synchronicity between rotors.' },
    { title: 'Rigorous Full-Load Testing', desc: 'Every blower runs at maximum rated speed and pressure for 4 hours to verify temperature and volume outputs.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Page Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">About Our Company</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Established in 2011, Shree Ambika Engineering has grown into a leading manufacturer of high-precision positive displacement rotary air blowers.
          </p>
        </div>
      </section>

      {/* Company Story & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-heading text-primary">The Journey of Shree Ambika Engineering</h2>
              <p className="text-gray-600 leading-relaxed">
                Shree Ambika Engineering (SAE) was founded with a singular focus: to engineer Roots Blowers that deliver superior durability and energy efficiency. Operating from the industrial hub of Vatva GIDC in Ahmedabad, India, we have expanded our capacity to cater to various process engineering fields including municipal sewage, aquaculture, and bulk material conveying.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over the years, we have continuously upgraded our infrastructure, installing CNC tooling machines, dynamic rotor balancers, and a fully loaded quality testing laboratory. This ensures that every blower bearing the Shree Ambika Engineering name operates with optimal clearance tolerances, producing 100% oil-free air.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="space-y-6">
              <div className="bg-bg-custom border border-borders-custom p-8 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center space-x-3 text-secondary">
                  <FaBullseye size={24} />
                  <h3 className="text-xl font-bold font-heading text-primary">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To manufacture heavy-duty, high-performance rotary blowers that meet the critical airflow parameters of our global clients, maintaining eco-friendly operations through clean, oil-free aeration.
                </p>
              </div>

              <div className="bg-bg-custom border border-borders-custom p-8 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center space-x-3 text-accent">
                  <FaIndustry size={24} />
                  <h3 className="text-xl font-bold font-heading text-primary">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To be globally recognized as a premier blower manufacturer by pioneering state-of-the-art rotor profiles, low-noise acoustic technology, and energy-conserving compression systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure & Manufacturing */}
      <section className="py-20 bg-bg-custom border-y border-borders-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-primary">
              State-of-the-Art Infrastructure
            </h2>
            <p className="text-gray-500 mt-4">
              Our Vatva manufacturing unit is equipped with CNC machining technology and specialized inspection tooling to maintain high standards of mechanical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-borders-custom shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-heading text-primary">Rotor Machining Center</h3>
              <p className="text-gray-550 text-sm leading-relaxed">
                Equipped with custom horizontal boring machines and CNC milling systems to cut lobes according to mathematical formulas that maximize compression efficiency.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-borders-custom shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-heading text-primary">Dynamic Balancing Bay</h3>
              <p className="text-gray-550 text-sm leading-relaxed">
                Rotor shafts undergo dynamic balancing to reduce bearing wear and prevent mechanical vibration, which directly extends the blower\'s operating lifetime.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-borders-custom shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-heading text-primary">Testing Lab & Quality Bench</h3>
              <p className="text-gray-550 text-sm leading-relaxed">
                Every blower undergoes a stringent 4-hour performance run on our testing benches under full load, validating temperature rise, sound levels, and volumetric flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Steps Left */}
            <div className="space-y-8">
              <div>
                <span className="text-secondary font-bold text-sm tracking-wider uppercase">How It Is Built</span>
                <h2 className="text-3xl font-bold font-heading text-primary mt-1">Our Manufacturing Workflow</h2>
              </div>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-primary text-base mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Certifications Right */}
            <div className="bg-primary text-white p-10 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10"></div>
              <div className="flex items-center space-x-3 text-accent mb-2">
                <FaSearchPlus size={28} />
                <h3 className="text-2xl font-bold font-heading">Quality Standards</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Shree Ambika Engineering maintains a zero-defect policy. Quality inspection occurs at every phase of assembly: from casting verification to the final testing logs.
              </p>
              <div className="space-y-4 pt-4 border-t border-white/10">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm">
                    <FaCheckCircle className="text-accent mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-white/90">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
