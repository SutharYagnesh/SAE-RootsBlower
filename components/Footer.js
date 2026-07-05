'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState({
    phone: '+91 63545 486037, +91 81550 78276',
    email: 'sales@saerootsblower.com',
    address: 'Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad - 382418, Gujarat, India',
    socialLinks: {
      facebook: 'https://facebook.com/saerootsblower',
      twitter: 'https://twitter.com/saerootsblower',
      linkedin: 'https://linkedin.com/company/shree-ambika-engineering',
      youtube: 'https://youtube.com/saerootsblower',
      instagram: 'https://instagram.com/saerootsblower',
    }
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching settings in Footer:', err));
  }, []);

  // Hide footer on admin panel routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-custom text-white pt-16 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/footer-logo.webp"
                alt="Shree Ambika Engineering Footer Logo"
                className="h-12 w-auto object-contain bg-white px-3 py-1.5 rounded shadow-sm"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Shree Ambika Engineering is a premier manufacturer of high-efficiency Twin Lobe & Tri Lobe Roots Blowers, catering to sewage aeration, pneumatic conveying, aquaculture, and industrial applications since 2011.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-accent hover:text-primary p-2.5 rounded-full transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-accent hover:text-primary p-2.5 rounded-full transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter size={16} />
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-accent hover:text-primary p-2.5 rounded-full transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={16} />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-accent hover:text-primary p-2.5 rounded-full transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <FaYoutube size={16} />
                </a>
              )}
              <a
                href={settings.socialLinks?.instagram || 'https://instagram.com/saerootsblower'}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-accent hover:text-primary p-2.5 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-heading mb-6 pb-2 border-b border-white/10 inline-block text-accent">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-accent hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent hover:underline transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent hover:underline transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-accent hover:underline transition-colors">
                  Applications
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent hover:underline transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-accent hover:underline transition-colors">
                  Insights & Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 className="text-lg font-semibold font-heading mb-6 pb-2 border-b border-white/10 inline-block text-accent">
              Our Products
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/products/twin-lobe-roots-blower" className="hover:text-accent hover:underline transition-colors">
                  Twin Lobe Roots Blower
                </Link>
              </li>
              <li>
                <Link href="/products/tri-lobe-roots-blower" className="hover:text-accent hover:underline transition-colors">
                  Tri Lobe Roots Blower
                </Link>
              </li>
              <li>
                <Link href="/products/water-cooled-roots-blower" className="hover:text-accent hover:underline transition-colors">
                  Water Cooled Blower
                </Link>
              </li>
              <li>
                <Link href="/products/acoustic-hood-roots-blower-system" className="hover:text-accent hover:underline transition-colors">
                  Acoustic Hood Blower System
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold font-heading mb-6 pb-2 border-b border-white/10 inline-block text-accent">
              Contact Details
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" size={16} />
                <span>
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-accent flex-shrink-0" size={15} />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-accent flex-shrink-0" size={15} />
                <a href={`mailto:${settings.email}`} className="hover:text-accent hover:underline">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 space-y-4 md:space-y-0">
          <p>
            &copy; {currentYear} Shree Ambika Engineering. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/admin" className="hover:text-accent font-semibold transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
