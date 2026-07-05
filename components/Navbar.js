'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState({
    phone: '+91 63545 486037',
    email: 'sales@saerootsblower.com',
    socialLinks: {
      facebook: 'https://facebook.com/saerootsblower',
      twitter: 'https://twitter.com/saerootsblower',
      linkedin: 'https://linkedin.com/company/shree-ambika-engineering',
      youtube: 'https://youtube.com/saerootsblower',
      instagram: 'https://instagram.com/saerootsblower',
    },
  });
  const pathname = usePathname();

  // Fetch settings dynamically
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching settings in Navbar:', err));
  }, []);

  // Watch for scroll to apply glassmorphism style and hide topbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Applications', path: '/applications' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Hide default navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const displayPhone = settings.phone ? settings.phone.split(',')[0].trim() : '';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-md'
          : 'bg-primary'
      }`}
    >
      {/* 1. Slim Topbar Section */}
      <div className="bg-[#0a2948] border-b border-white/5 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[11px] text-white/85">
          {/* Contact details */}
          <div className="flex items-center space-x-6">
            {displayPhone && (
              <a
                href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-2 hover:text-accent transition-colors font-medium"
              >
                <FaPhoneAlt size={10} className="text-accent" />
                <span>{displayPhone}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center space-x-2 hover:text-accent transition-colors font-medium"
              >
                <FaEnvelope size={10} className="text-accent" />
                <span>{settings.email}</span>
              </a>
            )}
          </div>

          {/* Social Icons (Right Side - Desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            {settings.socialLinks?.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent text-white/80 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={12} />
              </a>
            )}
            {settings.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent text-white/80 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={12} />
              </a>
            )}
            <a
              href={settings.socialLinks?.instagram || 'https://instagram.com/saerootsblower'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent text-white/80 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={12} />
            </a>
            {settings.socialLinks?.youtube && (
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent text-white/80 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navbar Row */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'py-3.5' : 'py-5'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sae-logo.webp"
              alt="Shree Ambika Engineering Logo"
              className="h-11 w-auto object-contain bg-white px-2.5 py-1 rounded shadow-sm group-hover:scale-102 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-4 bg-accent hover:bg-accent/90 text-primary font-bold px-5 py-2.5 rounded-md text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-accent/20"
            >
              Get A Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-white hover:text-accent focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden absolute top-full inset-x-0 bg-primary border-t border-white/10 shadow-lg transition-all duration-300 ease-in-out transform ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-3 py-3 rounded-md text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-accent/15 text-accent'
                  : 'text-white/85 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 px-3">
            <Link
              href="/contact"
              className="block w-full text-center bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-4 rounded-md transition-colors"
            >
              Get A Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
