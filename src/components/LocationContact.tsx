import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { MapPin, Phone, Mail, Clock, Navigation, Calendar, Copy, Check, Instagram } from 'lucide-react';

interface Props {
  settings?: WebsiteSettings;
  onBookTable: () => void;
}

export const LocationContact: React.FC<Props> = ({ settings, onBookTable }) => {
  const [copied, setCopied] = useState(false);

  // Business Constraints
  const phone = settings?.phone || '+91 94801 23456';
  const email = settings?.email || 'altajhotelhassan@gmail.com';
  const hours = settings?.openingHours || '11:30 AM – 11:30 PM (Daily)';
  const fullAddress =
    settings?.fullAddress ||
    '234V+5GH, Ameer Mohalla, Hassan, Karnataka 573201, India';
  const mapsUrl =
    settings?.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=234V%2B5GH+Ameer+Mohalla+Hassan+Karnataka+573201';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/altajhotel_hassan';

  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 bg-[#070709] relative border-t border-[#c5a869]/20 text-[#f5f0e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Location & Khidmat
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="font-royal text-3xl sm:text-5xl text-[#f5f0e6] font-bold tracking-wide">
              Visit Al Taj Hotel
            </h2>
          </div>

          <p className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            مقام اور رابطے کی تفصیلات
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Conveniently situated at Ameer Mohalla in Hassan, Karnataka. Ample parking, dedicated family rooms, and warm Nawabi hospitality await you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Column */}
          <div className="lg:col-span-6 bg-[#131318] border border-[#c5a869]/25 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#dfb75a] uppercase font-bold block mb-1">
                Restaurant & Dastarkhwan Address
              </span>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-royal text-2xl text-[#f5f0e6] font-bold">
                  {settings?.restaurantName || 'AL-TAJ HOTEL'}
                </h3>
                <span className="font-urdu text-2xl text-[#dfb75a] font-semibold">ال تاج ہوٹل</span>
              </div>

              {/* Exact Address Box */}
              <div className="bg-[#0d0d12] border border-[#c5a869]/20 rounded-xl p-4 flex items-start justify-between gap-3 mt-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#dfb75a] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#f5f0e6] font-semibold leading-relaxed">
                      {fullAddress}
                    </p>
                    <p className="text-xs text-[#a8a396] mt-1">
                      Landmark: Ameer Mohalla • Hassan • Karnataka 573201
                    </p>
                  </div>
                </div>

                <button
                  onClick={copyAddress}
                  className="px-3 py-1.5 rounded-lg bg-[#1c1c25] hover:bg-[#252532] text-[#dfb75a] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border border-[#c5a869]/30 shadow-xs"
                  title="Copy full address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#c5a869]/20">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-bold block">
                  Official Telephone
                </span>
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-sm font-bold text-[#f5f0e6] hover:text-[#dfb75a] flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dfb75a]" />
                  <span>{phone}</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-bold block">
                  Email Desk
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-xs font-semibold text-[#f5f0e6] hover:text-[#dfb75a] flex items-center gap-2 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#dfb75a]" />
                  <span>{email}</span>
                </a>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-bold block">
                  Dining Timings
                </span>
                <p className="text-xs font-semibold text-[#f5f0e6] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#dfb75a]" />
                  <span>{hours}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#c5a869]/20">
              <a
                href={`tel:${cleanPhone}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0d0d12] hover:bg-[#1c1c25] border border-[#c5a869]/25 text-[#f5f0e6] text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <Phone className="w-4 h-4 text-[#dfb75a] mb-1" />
                <span>Call Us</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0d0d12] hover:bg-[#1c1c25] border border-[#c5a869]/25 text-[#f5f0e6] text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#dfb75a] mb-1" />
                <span>Directions</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0d0d12] hover:bg-[#1c1c25] border border-[#c5a869]/25 text-[#f5f0e6] text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#dfb75a] mb-1" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Column */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#c5a869]/25 h-[400px] sm:h-[450px] shadow-2xl relative bg-[#0d0d12]">
            <iframe
              title="AL-TAJ HOTEL Hassan Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8926019793165!2d76.0967!3d13.0072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba5481755555555%3A0x123456789abcdef!2sAmeer%20Mohalla%2C%20Hassan%2C%20Karnataka%20573201!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#131318]/95 backdrop-blur-md p-4 rounded-xl border border-[#c5a869]/30 shadow-xl flex items-center justify-between gap-3">
              <div>
                <span className="font-royal text-xs text-[#f5f0e6] font-bold block">AL-TAJ HOTEL</span>
                <span className="text-[11px] text-[#a8a396]">234V+5GH, Ameer Mohalla, Hassan</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] rounded-lg text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-md transition-opacity"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Maps</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
