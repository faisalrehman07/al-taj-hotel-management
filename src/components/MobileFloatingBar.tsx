import React from 'react';
import { Phone, Utensils, Calendar, MessageCircle, ShoppingBag } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface Props {
  settings?: WebsiteSettings;
  onBookTable: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const MobileFloatingBar: React.FC<Props> = ({
  settings,
  onBookTable,
  cartCount = 0,
  onOpenCart,
}) => {
  const phone = settings?.phone || '+91 94801 23456';
  const whatsapp = settings?.whatsapp || '9620532473';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-t border-[#c5a869]/25 px-3 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.7)]">
      {/* Floating Cart Indicator Pill if items are added */}
      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          className="w-full mb-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#dfb75a] to-[#c5a869] text-[#070709] font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-md active:opacity-90 animate-in slide-in-from-bottom-2 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Parcel Cart: {cartCount} {cartCount === 1 ? 'Delicacy' : 'Delicacies'}</span>
          </div>
          <span>Review & Order ➔</span>
        </button>
      )}

      <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
        {/* CALL */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] text-[10px] font-bold uppercase tracking-wider active:bg-[#1c1c25] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#dfb75a] mb-0.5" />
          <span>Call</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/91${cleanWhatsApp}?text=${encodeURIComponent('Hello Al-Taj Hotel Hassan, I would like to inquire about today\'s specials & dining availability.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-[#131318] border border-[#25D366]/40 text-[#25D366] text-[10px] font-bold uppercase tracking-wider active:bg-[#1c1c25] transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] mb-0.5" />
          <span>Chat</span>
        </a>

        {/* DASTARKHWAN / MENU */}
        <button
          onClick={scrollToMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] text-[10px] font-bold uppercase tracking-wider active:bg-[#1c1c25] transition-colors cursor-pointer"
        >
          <Utensils className="w-3.5 h-3.5 text-[#dfb75a] mb-0.5" />
          <span>Menu</span>
        </button>

        {/* BOOK TABLE */}
        <button
          onClick={onBookTable}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] text-[10px] font-bold uppercase tracking-wider shadow-sm active:opacity-90 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#070709] mb-0.5" />
          <span>Reserve</span>
        </button>
      </div>
    </div>
  );
};
