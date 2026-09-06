import React from 'react';
import { MenuItem, MenuCategory } from '../types';
import { Sparkles, Utensils } from 'lucide-react';

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  onViewFullMenu: () => void;
}

export const FeaturedDishes: React.FC<Props> = ({ items, categories, onViewFullMenu }) => {
  const featuredItems = items.filter((item) => item.featured);

  if (featuredItems.length === 0) return null;

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c._id === catId || (c as any).id === catId);
    return cat ? cat.name : '';
  };

  return (
    <section className="py-20 bg-[#070709] border-t border-[#c5a869]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.22em] text-[#dfb75a] uppercase font-serif font-bold">
              Chef's Signatures
            </span>
          </div>
          <h2 className="font-royal text-3xl sm:text-4xl text-[#f5f0e6] font-bold tracking-wide mb-3">
            Featured Delicacies
          </h2>
          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed">
            Handpicked specialties representing the rich flavors and mastery of our kitchen.
          </p>
        </div>

        {/* Grid of Featured Dishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 8).map((item) => {
            const catName = getCategoryName(item.categoryId);
            return (
              <div
                key={item._id || (item as any).id}
                className="bg-[#131318] rounded-xl border border-[#c5a869]/20 hover:border-[#dfb75a]/60 transition-all duration-300 p-5 flex flex-col justify-between group relative overflow-hidden shadow-md hover:shadow-xl"
              >
                {/* Top subtle category pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#dfb75a] font-bold">
                    {catName || 'Specialty'}
                  </span>
                  {!item.available && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/80 border border-red-800/60 text-red-300 font-medium">
                      Currently Unavailable
                    </span>
                  )}
                </div>

                {/* Dish Name */}
                <h3 className="font-royal text-lg text-[#f5f0e6] group-hover:text-[#dfb75a] transition-colors font-bold tracking-wide mb-2">
                  {item.name}
                </h3>

                {/* Optional description if present */}
                {item.description ? (
                  <p className="text-xs text-[#a8a396] leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>
                ) : (
                  <p className="text-xs text-[#78716c] italic mb-4">
                    Signature preparation from AL-TAJ
                  </p>
                )}

                {/* Price if set by admin */}
                <div className="pt-3 border-t border-[#c5a869]/20 flex items-center justify-between">
                  {item.price !== null && item.price !== undefined ? (
                    <span className="text-[#dfb75a] font-bold text-sm tracking-wide">
                      ₹{item.price}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#a8a396] uppercase tracking-wider font-semibold">
                      Specialty
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb75a]/50 group-hover:bg-[#dfb75a] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Menu Button */}
        <div className="text-center mt-12">
          <button
            onClick={onViewFullMenu}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#131318] hover:bg-[#1c1c25] text-[#f5f0e6] hover:text-[#dfb75a] border border-[#c5a869]/30 hover:border-[#dfb75a] rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-all cursor-pointer shadow-md"
          >
            <Utensils className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span>Explore Complete Dastarkhwan</span>
          </button>
        </div>

      </div>
    </section>
  );
};
