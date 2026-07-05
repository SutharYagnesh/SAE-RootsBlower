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
    phone: '+91 63545 86037',
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
    { name: 'Products', path: '/products' },
    {
      name: 'Company',
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    { name: 'Applications', path: '/applications' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isParentActive = (link) => {
    if (link.dropdown) {
      return link.dropdown.some((subLink) => pathname === subLink.path || (subLink.path !== '/' && pathname.startsWith(subLink.path)));
    }
    return isActive(link.path);
  };

  // Hide default navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const displayPhone = settings.phone ? settings.phone.split(',')[0].trim() : '';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-3.5' : 'py-5'
          }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo with Brand Text */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sae-logo.webp"
              alt="Shree Ambika Engineering Logo"
              className="h-11 w-auto object-contain bg-white px-2 py-1 rounded shadow-sm group-hover:scale-102 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-white font-extrabold tracking-wide leading-none text-xs sm:text-sm md:text-base font-heading uppercase">
                SHREE AMBIKE ENGINEERING
              </span>
              <span className="text-accent text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mt-0.5">
                Industrial Air Experts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-3 items-center">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div key={link.name} className="relative group py-2">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center space-x-1 cursor-pointer ${isParentActive(link)
                          ? 'text-accent'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 fill-current transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    {/* Hover Dropdown Menu */}
                    <div className="absolute left-0 mt-0 w-48 rounded-lg shadow-lg bg-primary border border-white/10 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {link.dropdown.map((subLink) => (
                        <Link
                          key={subLink.path}
                          href={subLink.path}
                          className={`block px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors ${isActive(subLink.path) ? 'text-accent' : 'text-white/85 hover:text-white'
                            }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive(link.path)
                      ? 'text-accent'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              href="/contact"
              className="ml-2 bg-accent hover:bg-accent/90 text-primary font-bold px-4 py-2 rounded-md text-xs transition-all duration-300 hover:scale-105 shadow-md shadow-accent/20"
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
        className={`md:hidden absolute top-full inset-x-0 bg-primary border-t border-white/10 shadow-lg transition-all duration-300 ease-in-out transform ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
          }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            if (link.dropdown) {
              return (
                <div key={link.name} className="space-y-1 py-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-white/40 uppercase tracking-widest">
                    {link.name}
                  </div>
                  <div className="pl-4 border-l border-white/10 ml-3 space-y-1">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.path}
                        href={subLink.path}
                        className={`block px-3 py-2 rounded-md text-sm font-semibold ${isActive(subLink.path)
                            ? 'bg-accent/15 text-accent'
                            : 'text-white/85 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-3 py-2.5 rounded-md text-base font-semibold ${isActive(link.path)
                    ? 'bg-accent/15 text-accent'
                    : 'text-white/85 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
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
