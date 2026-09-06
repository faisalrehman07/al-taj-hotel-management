import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface Props {
  settings?: WebsiteSettings;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<Props> = ({ settings, activeSection, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', urdu: 'خوش آمدید', id: 'home' },
    { label: 'DASTARKHWAN', urdu: 'دسترخوان', id: 'menu' },
    { label: 'MAHĀFIL', urdu: 'محافل', id: 'gallery' },
    { label: 'DINING SPACES', urdu: 'نشستیں', id: 'dining-preference' },
    { label: 'REVIEWS', urdu: 'رائے', id: 'reviews' },
    { label: 'CONTACT', urdu: 'رابطہ', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const phone = settings?.phone || '+91 94801 23456';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0d]/95 backdrop-blur-md border-b border-[#c5a869]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#070709]/95 via-[#070709]/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#c5a869]/40 flex items-center justify-center bg-[#131318] group-hover:border-[#dfb75a] transition-colors shadow-sm">
            <span className="font-royal text-sm font-bold text-[#dfb75a]">AT</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-royal text-lg sm:text-xl font-bold tracking-[0.14em] text-[#f5f0e6] leading-none">
                {settings?.restaurantName || 'AL-TAJ HOTEL'}
              </span>
              <span className="font-urdu text-sm text-[#dfb75a] hidden sm:inline font-semibold">
                ال تاج ہوٹل
              </span>
            </div>
            <span className="text-[10px] tracking-[0.2em] text-[#dfb75a] uppercase font-sans font-semibold block mt-1">
              Aapki Khidmat, Hamara Fakhr
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`text-xs font-semibold tracking-[0.15em] uppercase transition-colors relative py-1 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
                activeSection === item.id
                  ? 'text-[#dfb75a] font-bold'
                  : 'text-[#d0cbc0] hover:text-[#dfb75a]'
              }`}
            >
              <span>{item.label}</span>
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#dfb75a] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#131318] hover:bg-[#1b1b24] text-[#f5f0e6] border border-[#c5a869]/30 hover:border-[#dfb75a]/60 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span>Call Us</span>
          </a>

          <button
            onClick={() => handleLinkClick('booking')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#c5a869] via-[#dfb75a] to-[#c5a869] hover:opacity-95 text-[#070709] text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Table</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#f5f0e6] hover:text-[#dfb75a] rounded-lg border border-[#c5a869]/30 hover:border-[#dfb75a]/50 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e13] border-b border-[#c5a869]/25 px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-4">
            <div className="text-center pb-3 border-b border-[#c5a869]/20">
              <p className="text-xs tracking-[0.2em] uppercase text-[#dfb75a] font-serif font-bold italic">
                "Aapki Khidmat, Hamara Fakhr"
              </p>
              <p className="font-urdu text-sm text-[#c5a869] mt-0.5">
                آپ کی خدمت، ہمارا فخر
              </p>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left text-sm font-medium tracking-[0.16em] py-2.5 border-b border-[#1c1c25] transition-colors flex items-center justify-between ${
                  activeSection === item.id ? 'text-[#dfb75a] pl-2 font-bold' : 'text-[#d0cbc0] hover:text-[#dfb75a]'
                }`}
              >
                <span>{item.label}</span>
                <span className="font-urdu text-xs text-[#dfb75a]">{item.urdu}</span>
              </button>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => handleLinkClick('booking')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#c5a869] via-[#dfb75a] to-[#c5a869] text-[#070709] font-bold text-xs uppercase tracking-widest rounded-lg shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Reserve A Table
              </button>

              <a
                href={`tel:${cleanPhone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] font-semibold text-xs uppercase tracking-widest rounded-lg"
              >
                <Phone className="w-3.5 h-3.5 text-[#dfb75a]" />
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
