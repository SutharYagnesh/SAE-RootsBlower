'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaCogs, FaBookOpen, FaImages, FaEnvelope, FaSlidersH, FaSignOutAlt, FaChartBar, FaUserCircle } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        // Redirect to login if unauthorized
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    // Overwrite the cookie with expired date
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    localStorage.removeItem('sae_token');
    router.push('/admin');
  };

  const navLinks = [
    { name: 'Stats Overview', path: '/admin/dashboard', icon: <FaChartBar /> },
    { name: 'Manage Products', path: '/admin/dashboard/products', icon: <FaCogs /> },
    { name: 'Manage Blogs', path: '/admin/dashboard/blogs', icon: <FaBookOpen /> },
    { name: 'Manage Gallery', path: '/admin/dashboard/gallery', icon: <FaImages /> },
    { name: 'Contact Messages', path: '/admin/dashboard/messages', icon: <FaEnvelope /> },
    { name: 'General Settings', path: '/admin/dashboard/settings', icon: <FaSlidersH /> },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-custom flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 font-semibold">Verifying Secure Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-custom flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col justify-between p-6 md:fixed md:top-0 md:bottom-0 md:left-0 z-30 shadow-xl">
        <div className="space-y-8">
          {/* Admin Header */}
          <div className="flex items-center space-x-2 pb-6 border-b border-white/10">
            <svg
              className="w-8 h-8 text-accent"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" strokeDasharray="16 8" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
            <div>
              <span className="text-base font-bold font-heading tracking-wider block text-white">SAE PORTAL</span>
              <span className="text-[10px] text-accent font-semibold tracking-widest uppercase">Admin Dashboard</span>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
            <FaUserCircle size={28} className="text-accent" />
            <div className="text-xs">
              <p className="font-bold text-white leading-none mb-1">{user?.name || 'Administrator'}</p>
              <p className="text-white/50 text-[10px]">{user?.email}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-bold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'bg-accent text-primary shadow-md'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout widget */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-bold text-white/80 hover:bg-red-650 hover:text-white transition-all w-full text-left cursor-pointer"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content panel */}
      <main className="flex-grow md:ml-64 p-6 sm:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
