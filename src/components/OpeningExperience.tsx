import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onComplete?: () => void;
}

export const OpeningExperience: React.FC<Props> = ({ onComplete }) => {
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
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem('altaj_intro_seen', 'true');
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#faf8f5] text-[#1c1917] px-6"
        >
          {/* Subtle background ambient radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,138,56,0.1)_0%,transparent_65%)] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center relative z-10 max-w-lg"
          >
            {/* Royal Crest Emblem */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[#b88a38]/40 flex items-center justify-center bg-white shadow-md">
              <span className="font-royal text-2xl font-bold text-[#8a6828] tracking-wider">AT</span>
            </div>

            <motion.h1
              initial={{ letterSpacing: '0.1em', opacity: 0 }}
              animate={{ letterSpacing: '0.22em', opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-royal text-3xl sm:text-4xl text-[#1c1917] font-bold uppercase mb-2"
            >
              AL-TAJ HOTEL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-urdu text-xl text-[#9e7226] font-semibold mb-3"
            >
              ال تاج ہوٹل • حسن
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="h-[1px] w-28 mx-auto bg-gradient-to-r from-transparent via-[#b88a38] to-transparent mb-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[#8a6828] text-sm sm:text-base tracking-[0.2em] uppercase font-serif font-bold italic"
            >
              "Aapki Khidmat, Hamara Fakhr"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-urdu text-base text-[#9e7226]/90 mt-1"
            >
              آپ کی خدمت ہمارا فخر
            </motion.p>
          </motion.div>

          <button
            onClick={handleSkip}
            className="absolute bottom-8 text-xs text-[#78716c] hover:text-[#8a6828] uppercase tracking-widest transition-colors py-2 px-4 cursor-pointer font-bold border border-[#e2dac9] rounded-full bg-white/80 shadow-xs"
          >
            Enter Restaurant →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
