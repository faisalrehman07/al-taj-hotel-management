import React from 'react';
import { Phone, Utensils, Calendar } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface Props {
  settings?: WebsiteSettings;
  onBookTable: () => void;
}

export const MobileFloatingBar: React.FC<Props> = ({ settings, onBookTable }) => {
  const phone = settings?.phone || '+91 94801 23456';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-t border-[#c5a869]/25 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        {/* CALL */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] text-xs font-bold uppercase tracking-wider active:bg-[#1c1c25] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#dfb75a]" />
          <span>Call</span>
        </a>

        {/* DASTARKHWAN / MENU */}
        <button
          onClick={scrollToMenu}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] text-xs font-bold uppercase tracking-wider active:bg-[#1c1c25] transition-colors cursor-pointer"
        >
          <Utensils className="w-3.5 h-3.5 text-[#dfb75a]" />
          <span>Menu</span>
        </button>

        {/* BOOK TABLE */}
        <button
          onClick={onBookTable}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] text-xs font-bold uppercase tracking-wider shadow-sm active:opacity-90 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#070709]" />
          <span>Reserve</span>
        </button>
      </div>
    </div>
  );
};
