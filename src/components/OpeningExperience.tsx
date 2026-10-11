import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, Calendar } from 'lucide-react';

interface Props {
  onComplete?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const OpeningExperience: React.FC<Props> = ({ onComplete, onNavigate }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw the intro in this browser session
    const hasSeenIntro = sessionStorage.getItem('altaj_intro_seen');
    if (hasSeenIntro) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('altaj_intro_seen', 'true');
      onComplete?.();
    }, 2800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
        sessionStorage.setItem('altaj_intro_seen', 'true');
        onComplete?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleEnter = (sectionId?: string) => {
    setVisible(false);
    sessionStorage.setItem('altaj_intro_seen', 'true');
    onComplete?.();
    if (sectionId && onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.7, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070709] text-[#f5f0e6] px-6 select-none"
        >
          {/* Ambient background glow & radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,183,90,0.15)_0%,rgba(7,7,9,0.95)_70%)] pointer-events-none" />
          
          {/* Subtle decorative glowing corner motifs */}
          <div className="absolute top-6 left-6 text-xs text-[#dfb75a]/40 font-mono tracking-widest hidden sm:block">
            ESTD. HASSAN • 573201
          </div>
          <div className="absolute top-6 right-6 text-xs text-[#dfb75a]/40 font-urdu tracking-widest hidden sm:block">
            حسن، کرناٹک
          </div>

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 max-w-xl mx-auto"
          >
            {/* Sacred Bismillah Inscription */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-urdu text-xl sm:text-2xl text-[#dfb75a] tracking-widest mb-4"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </motion.p>

            {/* Royal Crest Emblem */}
            <motion.div
              initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
              className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-[#dfb75a]/40 animate-ping opacity-25" />
              <div className="w-20 h-20 rounded-full border-2 border-[#dfb75a] flex items-center justify-center bg-[#131318] shadow-[0_0_35px_rgba(223,183,90,0.25)]">
                <span className="font-royal text-2xl font-black text-[#dfb75a] tracking-widest">AT</span>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ letterSpacing: '0.12em', opacity: 0 }}
              animate={{ letterSpacing: '0.24em', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-royal text-3xl sm:text-5xl text-[#f5f0e6] font-extrabold uppercase mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            >
              AL-TAJ HOTEL
            </motion.h1>

            {/* Urdu Title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-bold mb-3"
            >
              ال تاج ہوٹل • حسن
            </motion.p>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="h-[1px] w-36 mx-auto bg-gradient-to-r from-transparent via-[#dfb75a] to-transparent mb-5"
            />

            {/* Revered Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="text-[#dfb75a] text-sm sm:text-lg tracking-[0.22em] uppercase font-serif font-bold italic"
            >
              "Aapki Khidmat, Hamara Fakhr"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="font-urdu text-lg sm:text-xl text-[#c5a869] mt-1"
            >
              آپ کی خدمت، ہمارا فخر
            </motion.p>
          </motion.div>

          {/* Quick Action Entry */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 relative z-10"
          >
            <button
              onClick={() => handleEnter()}
              className="text-xs sm:text-sm text-[#070709] bg-gradient-to-r from-[#c5a869] via-[#dfb75a] to-[#c5a869] hover:opacity-95 uppercase tracking-widest font-bold py-2.5 px-6 rounded-full shadow-[0_4px_20px_rgba(223,183,90,0.3)] cursor-pointer transition-all transform hover:scale-105"
            >
              Enter Dastarkhwan (تشریف لائیں) →
            </button>
          </motion.div>

          <span className="absolute bottom-4 text-[10px] text-[#a8a396]/60 tracking-widest uppercase">
            Press Esc or Click to Enter
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
