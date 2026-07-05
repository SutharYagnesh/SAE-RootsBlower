'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          router.push('/admin/dashboard');
        }
      } catch (err) {
        // Not logged in
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token in localStorage (for authorization header fallbacks)
      localStorage.setItem('sae_token', data.token);

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-custom flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-borders-custom p-8 space-y-6">
        <div className="text-center space-y-2">
          {/* Logo element */}
          <div className="flex justify-center items-center space-x-2">
            <svg
              className="w-10 h-10 text-primary"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" strokeDasharray="16 8" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
            <div className="text-left">
              <span className="text-lg font-bold font-heading text-primary block leading-none">SHREE AMBIKA</span>
              <span className="text-[10px] text-accent font-semibold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>
          <h2 className="text-xl font-bold font-heading text-primary">Login to Dashboard</h2>
          <p className="text-xs text-gray-400">Configure products, blog posts, settings and view inquiries.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saerootsblower.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-white hover:text-primary py-2.5 rounded font-bold text-sm tracking-wide transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-gray-400 hover:text-primary hover:underline">
            &larr; Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
