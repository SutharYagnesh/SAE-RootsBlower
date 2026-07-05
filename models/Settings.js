import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Shree Ambika Engineering',
    },
    address: {
      type: String,
      default: '12, G.I.D.C., Phase-1, Vatva, Ahmedabad, Gujarat, India',
    },
    phone: {
      type: String,
      default: '+91 98250 12345',
    },
    email: {
      type: String,
      default: 'info@saerootsblower.com',
    },
    whatsappNumber: {
      type: String,
      default: '+919825012345',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    logo: {
      type: String, // Base64 string
      default: '',
    },
    favicon: {
      type: String, // Base64 string
      default: '',
    },
    metaTitle: {
      type: String,
      default: 'Shree Ambika Engineering | Leading Roots Blower Manufacturer',
    },
    metaDescription: {
      type: String,
      default: 'Shree Ambika Engineering manufactures high-quality Roots Blowers, Twin Lobe Roots Blowers, and industrial blower systems for wastewater treatment, aquaculture, pneumatic conveying, and industrial gas applications.',
    },
    googleAnalyticsId: {
      type: String,
      default: '',
    },
    googleMapEmbed: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.2081684724017!2d72.617478!3d22.9803123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87b7a13c9e6d%3A0xe54d3ccbe1d1ba0a!2sVatva%20GIDC%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
