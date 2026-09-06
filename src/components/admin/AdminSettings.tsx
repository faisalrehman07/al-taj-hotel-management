import React, { useState } from 'react';
import { WebsiteSettings } from '../../types';
import { adminUpdateSettings } from '../../lib/api';
import { Save, CheckCircle, Sparkles, Lock, Shield } from 'lucide-react';

interface Props {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<Props> = ({ settings, onRefresh }) => {
  const [form, setForm] = useState<WebsiteSettings>({
    ...settings,
    phone: '+91 94801 23456', // Fixed system constraint
    tagline: settings.tagline || 'Aapki Khidmat, Hamara Fakhr',
    urduTagline: settings.urduTagline || 'آپ کی خدمت، ہمارا فخر',
    whatsapp: settings.whatsapp || '9620532473',
    fullAddress: settings.fullAddress || '234V+5GH, Ameer Mohalla, Hassan, Karnataka 573201, India',
    instagramUrl: settings.instagramUrl || 'https://instagram.com/altajhotel_hassan',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      // Force constant phone
      const payload: WebsiteSettings = {
        ...form,
        phone: '+91 94801 23456',
      };
      await adminUpdateSettings(payload);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update website settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
          Website & Brand Settings
        </h2>
        <p className="text-xs text-[#a8a396] mt-1">
          Update restaurant profile, Nawabi taglines, dining hours, contact details, and location.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website settings updated successfully! Changes are immediately live.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/60 text-red-200 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#121216] border border-[#c5a869]/25 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        
        {/* Brand Section */}
        <div>
          <h3 className="font-royal text-base text-[#f5f0e6] font-bold pb-2 border-b border-[#22222a] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a869]" />
            Brand Identity & Cultural Taglines
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Signature English Tagline
              </label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Urdu Calligraphic Tagline (اردو سلوگن)
              </label>
              <input
                type="text"
                value={form.urduTagline || ''}
                onChange={(e) => setForm({ ...form, urduTagline: e.target.value })}
                placeholder="آپ کی خدمت، ہمارا فخر"
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none font-urdu"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={form.instagramUrl || ''}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/altajhotel_hassan"
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
              Hero Section Subtitle
            </label>
            <textarea
              rows={2}
              value={form.heroSubtitle || ''}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* About Section Content */}
        <div className="pt-4">
          <h3 className="font-royal text-base text-[#f5f0e6] font-bold pb-2 border-b border-[#22222a] mb-4">
            About Section Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                About Headline Title
              </label>
              <input
                type="text"
                value={form.aboutTitle || ''}
                onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                About Story & Hospitality Philosophy
              </label>
              <textarea
                rows={4}
                value={form.aboutSummary || ''}
                onChange={(e) => setForm({ ...form, aboutSummary: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours Section */}
        <div className="pt-4">
          <h3 className="font-royal text-base text-[#f5f0e6] font-bold pb-2 border-b border-[#22222a] mb-4">
            Contact & Operating Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Official Phone (Fixed Constraint)</span>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> System Locked
                </span>
              </label>
              <input
                type="text"
                disabled
                value="+91 94801 23456"
                className="w-full px-3.5 py-2.5 bg-[#1c1c24] border border-zinc-700 text-[#a8a396] rounded-lg text-sm cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                WhatsApp Khidmat Number
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="9620532473"
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Opening Hours
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="pt-4">
          <h3 className="font-royal text-base text-[#f5f0e6] font-bold pb-2 border-b border-[#22222a] mb-4">
            Physical Location & Address
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                Full Formatted Address
              </label>
              <input
                type="text"
                value={form.fullAddress || ''}
                onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                placeholder="234V+5GH, Ameer Mohalla, Hassan, Karnataka 573201, India"
                className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={form.mapsUrl || ''}
                  onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#18181f] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  City & State
                </label>
                <input
                  type="text"
                  value={`${form.city || 'Hassan'}, ${form.state || 'Karnataka'}`}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-[#1c1c24] border border-zinc-700 text-[#a8a396] rounded-lg text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:from-[#dfb75a] hover:to-[#ebd080] text-[#0b0b0c] font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Settings...' : 'Save Website Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
