import React from 'react';
import { Armchair, Home, PartyPopper, UtensilsCrossed, ArrowRight, Sparkles, Check } from 'lucide-react';

interface Props {
  onReserveSpace: (space: string) => void;
}

export const DiningPreferencesSection: React.FC<Props> = ({ onReserveSpace }) => {
  const diningSpaces = [
    {
      id: 'Family Room',
      title: 'Family Room',
      urduTitle: 'خاندانی کمرہ',
      subtitle: 'Secluded, private dining chambers for intimate family moments',
      description:
        'Designed specifically for families desiring absolute seclusion, peaceful ambiance, and personalized service. Features dedicated curtains, comfortable seating, and attentive khidmat.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      features: ['Private enclosed chambers', 'Dedicated steward service', 'Purdah-friendly arrangement', 'Ideal for 4-16 guests'],
      icon: Home,
      badge: 'Popular for Families'
    },
    {
      id: 'Mandi',
      title: 'Mandi Dastarkhwan',
      urduTitle: 'شاہی مندی دسترخوان',
      subtitle: 'Authentic Arabian carpeted floor seating for communal feasting',
      description:
        'Experience the regal Middle Eastern and Nawabi tradition of dining together on plush Persian-style carpets with low-rise brass dastarkhwan tables, centered around giant platters of aromatic Mandi.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
      features: ['Traditional floor seating', 'Handmade velvet cushions', 'Communal Mandi platters', 'Comfortable for 4-10 per bay'],
      icon: UtensilsCrossed,
      badge: 'Signature Experience'
    },
    {
      id: 'Events & Celebrations',
      title: 'Events & Celebrations',
      urduTitle: 'تقاریب و جشن',
      subtitle: 'Banqueting setups for birthdays, anniversaries, and milestones',
      description:
        'Celebrate your memorable life moments at Al Taj Hotel. We curate specialized long table seating, celebratory dessert platters, decorative touches, and custom multi-course menus for your gatherings.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
      features: ['Custom banquet seating', 'Special celebration decor', 'Pre-fixed customized menu', 'Up to 50 guests capacity'],
      icon: PartyPopper,
      badge: 'Special Occasions'
    },
    {
      id: 'General Seating',
      title: 'General Dining Hall',
      urduTitle: 'عوامی نشست',
      subtitle: 'Lively, airy dining hall with prompt service and welcoming atmosphere',
      description:
        'Our vibrant central dining hall accommodates friends, executives, travelers, and dining enthusiasts. High-ceilinged, spotlessly clean, and filled with the mouthwatering aromas of hot charcoal tandoor and dum pots.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      features: ['Spacious ergonomic tables', 'Fast table service', 'AC & ventilation', 'Walk-in & reservation friendly'],
      icon: Armchair,
      badge: 'Daily Dining'
    }
  ];

  return (
    <section id="dining-preference" className="py-24 bg-[#070709] relative border-t border-[#c5a869]/20">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Tailored Hospitality
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="font-royal text-3xl sm:text-5xl lg:text-6xl text-[#f5f0e6] font-bold tracking-wide">
              Dining Preferences
            </h2>
          </div>

          <p className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            نشست و دسترخوان کے منتخب انداز
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Every guest has distinct preferences. Whether you seek seclusion with family, traditional Arabian Mandi floor seating, banquet celebrations, or open dining hall vibrancy, we have a space prepared for your khidmat.
          </p>
        </div>

        {/* 4 Dining Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diningSpaces.map((space) => {
            const IconComponent = space.icon;
            return (
              <div
                key={space.id}
                className="group bg-[#131318] border border-[#c5a869]/20 hover:border-[#dfb75a]/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
              >
                {/* Visual Image Header */}
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.88] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131318] via-black/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#131318]/90 backdrop-blur-sm border border-[#c5a869]/30 text-[11px] font-bold text-[#dfb75a] shadow-xs">
                    {space.badge}
                  </div>

                  {/* Icon floating */}
                  <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-[#131318]/95 text-[#dfb75a] border border-[#c5a869]/30 backdrop-blur-sm shadow-xs">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-baseline justify-between gap-2">
                    <h3 className="font-royal text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                      {space.title}
                    </h3>
                    <span className="font-urdu text-xl text-[#dfb75a] drop-shadow-sm font-semibold">
                      {space.urduTitle}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-[#131318]">
                  <div>
                    <p className="text-xs font-bold text-[#dfb75a] tracking-wider uppercase mb-2">
                      {space.subtitle}
                    </p>
                    <p className="text-sm text-[#a8a396] leading-relaxed mb-6">
                      {space.description}
                    </p>

                    {/* Feature Bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {space.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#d0cbc0] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#dfb75a] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reserve Action Button */}
                  <div className="pt-4 border-t border-[#c5a869]/20 flex items-center justify-between gap-4">
                    <button
                      onClick={() => onReserveSpace(space.id)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#1c1c25] hover:bg-[#dfb75a] text-[#dfb75a] hover:text-[#070709] border border-[#c5a869]/30 hover:border-[#dfb75a] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                    >
                      <span>Reserve for {space.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
