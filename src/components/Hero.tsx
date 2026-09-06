import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface Props {
  settings?: WebsiteSettings;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<Props> = ({ settings, onNavigate }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070709] pt-28 pb-20">
      {/* Background Visual with Cinematic Dark Veil */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!reduceMotion ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover object-center scale-105 opacity-25 filter contrast-[1.1] brightness-[0.7]"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-flames-of-a-fire-in-slow-motion-42544-large.mp4"
              type="video/mp4"
            />
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop"
              alt="AL-TAJ HOTEL Royal Ambiance"
              className="w-full h-full object-cover object-center"
            />
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop"
            alt="AL-TAJ HOTEL Royal Ambiance"
            className="w-full h-full object-cover object-center opacity-25 filter contrast-[1.1] brightness-[0.7]"
          />
        )}

        {/* Rich dark ambiance overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,105,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070709]/90 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Cultural Welcome Crest & Urdu Welcome Motif */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#c5a869]/30 bg-[#131318]/90 backdrop-blur-md mb-6 shadow-lg shadow-black/40"
        >
          <span className="font-urdu text-base sm:text-lg text-[#dfb75a] font-semibold tracking-wide">
            خوش آمدید
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfb75a] animate-pulse" />
          <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#d0cbc0] uppercase font-sans font-semibold">
            Ameer Mohalla • Hassan • Karnataka
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-royal text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.16em] text-[#f5f0e6] mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          {settings?.restaurantName || 'AL-TAJ HOTEL'}
        </motion.h1>

        {/* Central Welcome Statement: Aapki Khidmat, Hamara Fakhr */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative inline-block mb-6 max-w-3xl"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2">
            <div className="h-[1px] w-8 sm:w-20 bg-gradient-to-r from-transparent to-[#dfb75a]" />
            <h2 className="font-royal italic text-xl sm:text-3xl md:text-4xl text-[#dfb75a] tracking-wider font-semibold">
              "{settings?.tagline || 'Aapki Khidmat, Hamara Fakhr'}"
            </h2>
            <div className="h-[1px] w-8 sm:w-20 bg-gradient-to-l from-transparent to-[#dfb75a]" />
          </div>

          {/* Urdu Calligraphy Inscription */}
          <p className="font-urdu text-lg sm:text-2xl text-[#c5a869] font-semibold tracking-widest mt-1">
            {settings?.urduTagline || 'آپ کی خدمت، ہمارا فخر'}
          </p>
        </motion.div>

        {/* Subtitle / Philosophy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#a8a396] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed mb-10 font-normal tracking-wide"
        >
          {settings?.heroSubtitle ||
            'Experience authentic charcoal tandoor craftsmanship, saffron-kissed dum biryani, Mandi feasts, and royal Nawabi hospitality in the heart of Hassan.'}
        </motion.p>

        {/* CTAs - Clean, Focused (No WhatsApp Order) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          {/* Primary CTA: Dastarkhwan-E-Al Taj */}
          <button
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#c5a869] via-[#dfb75a] to-[#c5a869] hover:opacity-95 text-[#070709] font-bold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Dastarkhwan-E-Al Taj</span>
          </button>

          {/* Secondary CTA: Book A Table */}
          <button
            onClick={() => onNavigate('booking')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#131318] hover:bg-[#1b1b24] text-[#f5f0e6] border border-[#c5a869]/30 hover:border-[#dfb75a]/60 font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-lg transition-all cursor-pointer shadow-md"
          >
            <Calendar className="w-4 h-4 text-[#dfb75a]" />
            <span>Reserve A Table</span>
          </button>
        </motion.div>

        {/* Highlight Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#a8a396]"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span>100% Authentic Halal Cuisine</span>
          </div>
          <span className="text-[#c5a869]/40">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Family Room & Mandi Seating</span>
          </div>
          <span className="text-[#c5a869]/40">•</span>
          <div className="flex items-center gap-2">
            <span>Slow-Cooked Dum Biryani</span>
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#dfb75a] font-serif font-semibold">Explore</span>
        <button
          onClick={() => onNavigate('menu')}
          className="text-[#dfb75a] animate-bounce cursor-pointer p-1"
          aria-label="Scroll to Dastarkhwan section"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
