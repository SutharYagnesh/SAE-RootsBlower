'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCogs, FaBookOpen, FaImages, FaEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    productsCount: 0,
    blogsCount: 0,
    galleryCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products, blogs, gallery, and messages
        const [prodRes, blogRes, galRes, msgRes] = await Promise.all([
          fetch('/api/products?admin=true'),
          fetch('/api/blogs?admin=true'),
          fetch('/api/gallery'),
          fetch('/api/messages'),
        ]);

        const [prodData, blogData, galData, msgData] = await Promise.all([
          prodRes.json(),
          blogRes.json(),
          galRes.json(),
          msgRes.json(),
        ]);

        const productsList = prodData.products || [];
        const blogsList = blogData.blogs || [];
        const galleryList = galData.items || [];
        const messagesList = msgData.messages || [];

        const unreadCount = messagesList.filter((m) => !m.isRead).length;

        setStats({
          productsCount: productsList.length,
          blogsCount: blogsList.length,
          galleryCount: galleryList.length,
          messagesCount: messagesList.length,
          unreadMessages: unreadCount,
        });

        setRecentMessages(messagesList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      });

      if (res.ok) {
        // Refresh local messages state
        setRecentMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, isRead } : msg))
        );
        // Recalculate unread count
        setStats((prev) => ({
          ...prev,
          unreadMessages: isRead ? prev.unreadMessages - 1 : prev.unreadMessages + 1,
        }));
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Products catalog',
      value: stats.productsCount,
      icon: <FaCogs />,
      color: 'bg-blue-500',
      link: '/admin/dashboard/products',
    },
    {
      title: 'Insights & Blogs',
      value: stats.blogsCount,
      icon: <FaBookOpen />,
      color: 'bg-green-600',
      link: '/admin/dashboard/blogs',
    },
    {
      title: 'Gallery Items',
      value: stats.galleryCount,
      icon: <FaImages />,
      color: 'bg-yellow-500',
      link: '/admin/dashboard/gallery',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: <FaEnvelope />,
      color: stats.unreadMessages > 0 ? 'bg-red-500' : 'bg-gray-400',
      link: '/admin/dashboard/messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Overview Stats</h1>
        <p className="text-xs text-gray-500">Quick status check on your CMS collections and visitor messages.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.link}
            className="bg-white border border-borders-custom rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                {card.title}
              </span>
              <span className="text-3xl font-extrabold font-heading text-primary block">
                {card.value}
              </span>
            </div>
            <div className={`w-12 h-12 ${card.color} text-white rounded-lg flex items-center justify-center text-xl shadow-sm`}>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-heading font-bold text-primary text-base">Recent Inquiries</h3>
            <p className="text-xs text-gray-450">Latest customer queries and quote requests.</p>
          </div>
          <Link
            href="/admin/dashboard/messages"
            className="text-xs text-primary hover:text-accent font-bold hover:underline"
          >
            View All Messages
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No messages received yet.</p>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div
                key={msg._id}
                className={`p-4 rounded-lg border text-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  msg.isRead ? 'bg-bg-custom/50 border-borders-custom' : 'bg-accent/5 border-accent/20 font-medium'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary">{msg.name}</span>
                    <span className="text-xs text-gray-400">({msg.email})</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Subject: <span className="font-medium text-gray-700">{msg.subject}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Received: {new Date(msg.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMarkAsRead(msg._id, !msg.isRead)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                      msg.isRead
                        ? 'bg-white hover:bg-bg-custom text-gray-500 border-borders-custom'
                        : 'bg-primary hover:bg-primary/95 text-white border-primary'
                    }`}
                  >
                    {msg.isRead ? <FaRegEnvelopeOpen /> : <FaEnvelope />}
                    <span>{msg.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <Link
                    href="/admin/dashboard/messages"
                    className="bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
