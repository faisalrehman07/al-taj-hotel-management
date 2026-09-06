import React from 'react';
import { WebsiteSettings } from '../types';
import { ShieldCheck, Flame, HeartHandshake, Sparkles } from 'lucide-react';

interface Props {
  settings?: WebsiteSettings;
}

export const AboutSection: React.FC<Props> = ({ settings }) => {
  return (
    <section id="about" className="py-24 bg-[#0a0a0e] relative overflow-hidden border-t border-[#c5a869]/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[#c5a869]/40 shadow-2xl relative">
                <img
                  src="https://res.cloudinary.com/dhgs8g5yv/image/upload/v1788678336/bg_smknxx.jpg"
                  alt="AL-TAJ HOTEL Dining Hospitality"
                  className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                {/* Floating KHIDMAT Emblem Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-[#131318]/95 backdrop-blur-md border border-[#c5a869]/40 text-center shadow-xl">
                  <span className="text-[10px] tracking-[0.25em] text-[#dfb75a] uppercase font-sans font-bold block mb-1">
                    Our Core Philosophy
                  </span>
                  <p className="font-royal text-base text-[#f5f0e6] italic font-semibold">
                    "Al Taj is ready for your KHIDMAT"
                  </p>
                </div>
              </div>

              {/* Decorative Corner accents */}
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#dfb75a]/70 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#dfb75a]/70 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Authentic Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
              <span className="text-xs tracking-[0.22em] text-[#dfb75a] uppercase font-serif font-bold">
                About AL-TAJ HOTEL
              </span>
            </div>

            <h2 className="font-royal text-3xl sm:text-4xl text-[#f5f0e6] font-bold tracking-wide mb-6 leading-tight">
              {settings?.aboutTitle || 'Royal Hospitality & Authentic Taste in Hassan'}
            </h2>

            <p className="text-[#d0cbc0] text-base leading-relaxed mb-6 font-normal">
              {settings?.aboutSummary ||
                'At AL-TAJ HOTEL, dining is an art of genuine care. Situated at Ameer Mohalla on Vallabhbhai Road in Hassan, our kitchen honors time-tested cooking traditions—bringing you freshly roasted tandoori specialties, savory gravies, and aromatic biryanis prepared with pure dedication to flavor and quality.'}
            </p>

            <p className="text-[#a8a396] text-sm leading-relaxed mb-8">
              We welcome families, friends, and travelers seeking hearty meals in a comfortable, respectful atmosphere. In true spirit of our motto, every member of our staff is dedicated to ensuring your meal is served with utmost hospitality and attention.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#c5a869]/20">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#131318] border border-[#c5a869]/25 shadow-md">
                <Flame className="w-5 h-5 text-[#dfb75a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] mb-1">
                    Authentic Tandoor & Grill
                  </h4>
                  <p className="text-xs text-[#a8a396] leading-normal">
                    Freshly marinated skewers cooked to perfection in traditional clay ovens.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#131318] border border-[#c5a869]/25 shadow-md">
                <HeartHandshake className="w-5 h-5 text-[#dfb75a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] mb-1">
                    Khidmat Hospitality
                  </h4>
                  <p className="text-xs text-[#a8a396] leading-normal">
                    Attentive, welcoming service focused on your utmost comfort and satisfaction.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#131318] border border-[#c5a869]/25 shadow-md">
                <ShieldCheck className="w-5 h-5 text-[#dfb75a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] mb-1">
                    Quality Ingredients
                  </h4>
                  <p className="text-xs text-[#a8a396] leading-normal">
                    Choice meats, fragrant long-grain rice, and traditional whole spices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#131318] border border-[#c5a869]/25 shadow-md">
                <Sparkles className="w-5 h-5 text-[#dfb75a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] mb-1">
                    Heart of Hassan
                  </h4>
                  <p className="text-xs text-[#a8a396] leading-normal">
                    Conveniently located on Vallabhbhai Road in Ameer Mohalla for dinner & lunch.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
