import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { submitEnquiry } from '../lib/api';

export const EnquirySection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const subjects = [
    'General Enquiry',
    'Family Gathering / Group Booking',
    'Special Catering Consultation',
    'Feedback & Service Appreciation',
    'Other Queries'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide your name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError('Please provide a valid phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please type your enquiry message');
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Enquiry',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-24 bg-[#0a0a0e] relative overflow-hidden border-t border-[#c5a869]/20 text-[#f5f0e6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.22em] text-[#dfb75a] uppercase font-serif font-bold">
              Guest Assistance
            </span>
          </div>
          <h2 className="font-royal text-3xl sm:text-4xl text-[#f5f0e6] font-bold tracking-wide mb-3">
            Enquire With Us
          </h2>
          <p className="text-[#a8a396] text-sm leading-relaxed">
            Have questions about dining arrangements, special occasions, or regional preparations? We are at your service.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#131318] border border-[#c5a869]/30 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-xl text-[#f5f0e6] font-bold mb-2">
              Enquiry Received
            </h3>
            <p className="text-xs text-[#dfb75a] uppercase tracking-widest font-serif font-bold italic mb-4">
              "Aapki Khidmat, Hamara Fakhr"
            </p>
            <p className="text-xs text-[#a8a396] leading-relaxed mb-6">
              Thank you for reaching out to AL-TAJ HOTEL. Our team will review your message and contact you promptly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-[#1c1c25] hover:bg-[#252532] text-[#f5f0e6] border border-[#c5a869]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Send Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#131318] border border-[#c5a869]/25 rounded-2xl p-6 sm:p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75a] mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75a] mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75a] mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75a] mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none transition-colors"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub} className="bg-[#131318] text-[#f5f0e6]">
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75a] mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can AL-TAJ HOTEL assist you today?"
                className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Enquiry'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
