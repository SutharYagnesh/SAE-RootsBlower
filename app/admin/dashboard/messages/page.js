'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEnvelope, FaRegEnvelopeOpen, FaTimes, FaPhoneAlt, FaCalendarAlt, FaEnvelopeOpenText } from 'react-icons/fa';

export default function AdminMessagesCMS() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null); // stores message object when viewing details

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    const newReadState = !msg.isRead;
    try {
      const res = await fetch(`/api/messages/${msg._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: newReadState }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: newReadState } : m))
        );
        if (activeMessage && activeMessage._id === msg._id) {
          setActiveMessage({ ...activeMessage, isRead: newReadState });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (activeMessage && activeMessage._id === id) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMessage = async (msg) => {
    setActiveMessage(msg);
    // Automatically mark as read when opened, if it was unread
    if (!msg.isRead) {
      try {
        const res = await fetch(`/api/messages/${msg._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-borders-custom">
        <h1 className="text-2xl font-bold font-heading text-primary">Contact Inquiries</h1>
        <p className="text-xs text-gray-500">Read and manage inquiries received from roots blower quote forms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading incoming messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No contact messages received yet.</div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 rounded-lg border text-sm transition-all cursor-pointer flex justify-between items-center group ${
                      msg.isRead
                        ? 'bg-bg-custom/40 border-borders-custom hover:bg-bg-custom'
                        : 'bg-accent/5 border-accent/20 font-semibold hover:bg-accent/10'
                    } ${activeMessage?._id === msg._id ? 'ring-2 ring-primary border-transparent' : ''}`}
                  >
                    <div className="space-y-1 truncate pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-primary truncate">{msg.name}</span>
                        {!msg.isRead && (
                          <span className="bg-red-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(msg);
                        }}
                        className="text-gray-500 hover:text-primary p-2 cursor-pointer"
                        title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                      >
                        {msg.isRead ? <FaRegEnvelopeOpen size={14} /> : <FaEnvelope size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="text-red-500 hover:text-red-750 p-2 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Details Column */}
        <div className="lg:col-span-1">
          {activeMessage ? (
            <div className="bg-white rounded-xl border border-borders-custom p-6 shadow-sm space-y-6 sticky top-28">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-heading font-bold text-primary text-sm flex items-center space-x-2">
                  <FaEnvelopeOpenText className="text-accent" />
                  <span>Inquiry Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="text-gray-400 hover:text-primary p-1 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Meta details */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Sender Name</span>
                    <span className="font-bold text-sm text-primary">{activeMessage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Email</span>
                      <a
                        href={`mailto:${activeMessage.email}`}
                        className="text-primary hover:underline hover:text-accent font-semibold block truncate max-w-[150px]"
                      >
                        {activeMessage.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Phone</span>
                      <a
                        href={`tel:${activeMessage.phone}`}
                        className="text-primary hover:underline font-semibold flex items-center space-x-1"
                      >
                        <FaPhoneAlt size={10} /> <span>{activeMessage.phone}</span>
                      </a>
                    </div>
                  </div>

                  {activeMessage.product && (
                    <div className="pt-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Product Reference</span>
                      <span className="bg-primary/5 text-primary border border-primary/10 rounded px-2.5 py-1 font-semibold inline-block mt-0.5">
                        {activeMessage.product.title}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2 text-gray-400">
                    <FaCalendarAlt size={12} />
                    <span>
                      {new Date(activeMessage.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Requirement Details</span>
                  <div className="bg-bg-custom/60 border border-borders-custom p-4 rounded-lg text-gray-700 text-sm leading-relaxed whitespace-pre-line overflow-y-auto max-h-60">
                    {activeMessage.message}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleToggleRead(activeMessage)}
                    className="flex-1 bg-white hover:bg-bg-custom border border-borders-custom text-gray-600 font-bold py-2 rounded text-center transition-colors cursor-pointer text-[11px]"
                  >
                    {activeMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(activeMessage._id)}
                    className="flex-1 bg-red-500 hover:bg-red-650 text-white font-bold py-2 rounded text-center transition-colors cursor-pointer text-[11px]"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:block bg-bg-custom/30 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-450 sticky top-28">
              <FaEnvelope size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold">No Message Selected</p>
              <p className="text-[11px] text-gray-400 mt-1">Select an inquiry from the listing on the left to read requirement details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
