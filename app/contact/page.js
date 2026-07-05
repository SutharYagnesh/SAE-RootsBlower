import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import Product from '@/models/Product';
import HomeContactForm from '@/components/HomeContactForm';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';

export const metadata = {
  title: 'Contact Us | Shree Ambika Engineering | Vatva, Ahmedabad',
  description: 'Contact Shree Ambika Engineering for Twin Lobe & Tri Lobe roots blower quotes. Factory at Vatva GIDC, Ahmedabad, Gujarat, India.',
};

export default async function ContactPage() {
  await connectDB();
  const settings = await Settings.findOne({}) || {
    phone: '+91 63545 486037, +91 79 2583 1234',
    email: 'sales@saerootsblower.com',
    address: 'Plot No. 4710, G.I.D.C. Vatva, Phase IV, Ahmedabad - 382445, Gujarat, India',
    whatsappNumber: '+9163545486037',
    googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.2081684724017!2d72.617478!3d22.9803123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87b7a13c9e6d%3A0xe54d3ccbe1d1ba0a!2sVatva%20GIDC%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
  };

  const products = await Product.find({ status: 'published' }).select('title _id');

  return (
    <div className="flex flex-col min-h-screen bg-bg-custom">
      {/* Header */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold font-heading mb-4">Contact Our Factory</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Get in touch with our sales department and engineering experts for technical consultations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Details Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-xl border border-borders-custom shadow-sm space-y-6">
                <h3 className="text-xl font-bold font-heading text-primary border-b border-gray-100 pb-3">
                  Direct Contacts
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" size={18} />
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-0.5">Factory Address</h4>
                      <p>{settings.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <FaPhoneAlt className="text-secondary mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-0.5">Sales Hotlines</h4>
                      <p>{settings.phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <FaEnvelope className="text-primary mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-0.5">Email Queries</h4>
                      <a href={`mailto:${settings.email}`} className="hover:text-accent hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <FaWhatsapp className="text-[#25D366] mt-1 flex-shrink-0" size={18} />
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-0.5">WhatsApp Sales</h4>
                      <a
                        href={`https://wa.me/${settings.whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-accent hover:underline"
                      >
                        {settings.whatsappNumber}
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <FaClock className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-0.5">Business Hours</h4>
                      <p>Monday - Saturday: 9:00 AM - 6:30 PM IST</p>
                      <p className="text-xs text-gray-400 mt-0.5">Factory closed on Sundays & National Holidays</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Out Info */}
              <div className="bg-primary text-white p-8 rounded-xl shadow-md text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8"></div>
                <h4 className="font-heading font-bold text-accent text-lg">Inquiry Turnaround</h4>
                <p className="text-white/80 text-xs leading-relaxed">
                  We review incoming parameter sheets daily. Standard quotations are dispatched within 24 business hours.
                </p>
              </div>
            </div>

            {/* Interactive Form Column */}
            <div className="lg:col-span-2">
              <HomeContactForm products={JSON.parse(JSON.stringify(products))} />
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Map */}
      <section className="h-96 w-full border-t border-borders-custom relative">
        <iframe
          src={settings.googleMapEmbed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Shree Ambika Engineering Factory GIDC Vatva Location Map"
        ></iframe>
      </section>
    </div>
  );
}
