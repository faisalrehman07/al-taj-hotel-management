import React from 'react';
import { WebsiteSettings } from '../types';
import { MapPin, Phone, Mail, Lock, Instagram } from 'lucide-react';

interface Props {
  settings?: WebsiteSettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const phone = settings?.phone || '+91 94801 23456';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/altajhotel_hassan';

  return (
    <footer className="bg-[#050507] border-t border-[#c5a869]/20 text-[#a8a396] pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#c5a869]/20">
          
          {/* Brand & Royal Welcome */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#c5a869]/40 flex items-center justify-center bg-[#131318] shadow-xs">
                <span className="font-royal text-sm font-bold text-[#dfb75a]">AT</span>
              </div>
              <h3 className="font-royal text-xl font-bold tracking-[0.14em] text-[#f5f0e6]">
                {settings?.restaurantName || 'AL-TAJ HOTEL'}
              </h3>
            </div>

            <div>
              <p className="font-royal italic text-sm text-[#dfb75a] font-bold tracking-wide">
                "{settings?.tagline || 'Aapki Khidmat, Hamara Fakhr'}"
              </p>
              <p className="font-urdu text-base text-[#dfb75a] font-semibold mt-0.5">
                {settings?.urduTagline || 'آپ کی خدمت، ہمارا فخر'}
              </p>
            </div>

            <p className="text-xs text-[#a8a396] leading-relaxed max-w-sm">
              Celebrating time-honored Nawabi culinary heritage, slow-cooked dum biryanis, authentic charcoal tandoor fires, and devoted khidmat in Hassan, Karnataka.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#131318] border border-[#c5a869]/30 shadow-xs flex items-center justify-center text-[#dfb75a] hover:text-[#f5f0e6] hover:border-[#dfb75a] transition-colors"
                title="Follow Al Taj Hotel on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="w-9 h-9 rounded-xl bg-[#131318] border border-[#c5a869]/30 shadow-xs flex items-center justify-center text-[#dfb75a] hover:text-[#f5f0e6] hover:border-[#dfb75a] transition-colors"
                title="Call AL-TAJ HOTEL"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#dfb75a] uppercase block font-serif">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Home (خوش آمدید)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Dastarkhwan-E-Al Taj
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Mahāfil (محافل)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dining-preference')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Dining Preferences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Reserve A Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#dfb75a] font-medium transition-colors cursor-pointer"
                >
                  Location & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Address & Direct Inquiries */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#dfb75a] uppercase block font-serif">
              Dining Location
            </span>
            <p className="text-xs text-[#a8a396] leading-relaxed flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#dfb75a] shrink-0 mt-0.5" />
              <span>{settings?.fullAddress || '234V+5GH, Ameer Mohalla, Hassan, Karnataka 573201, India'}</span>
            </p>
            <p className="text-xs text-[#a8a396] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#dfb75a]" />
              <a href={`tel:${cleanPhone}`} className="hover:text-[#dfb75a] font-semibold text-[#f5f0e6]">
                {phone}
              </a>
            </p>
            {settings?.email && (
              <p className="text-xs text-[#a8a396] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#dfb75a]" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#dfb75a] font-semibold text-[#f5f0e6]">
                  {settings.email}
                </a>
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar with discrete Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716c]">
          <p>
            © {currentYear} {settings?.restaurantName || 'AL-TAJ HOTEL'}. Aapki Khidmat, Hamara Fakhr. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-stone-700">•</span>
            {/* Discrete Admin Link */}
            <button
              onClick={onOpenAdmin}
              className="text-[#a8a396] hover:text-[#dfb75a] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Staff & Management Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Management Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
