import React from 'react';
import { MenuItem, MenuCategory, CartItem } from '../types';
import { Sparkles, Utensils, Flame, Leaf, Plus, Minus, Info } from 'lucide-react';

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  cart?: CartItem[];
  onAddToCart?: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
  onSelectDish?: (item: MenuItem) => void;
  onViewFullMenu: () => void;
}

export const FeaturedDishes: React.FC<Props> = ({
  items,
  categories,
  cart = [],
  onAddToCart,
  onUpdateQuantity,
  onSelectDish,
  onViewFullMenu,
}) => {
  const featuredItems = items.filter((item) => item.featured);

  if (featuredItems.length === 0) return null;

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c._id === catId || (c as any).id === catId);
    return cat ? cat.name : '';
  };

  const getItemQuantity = (itemId: string) => {
    const match = cart.find((c) => (c.item._id || (c.item as any).id) === itemId);
    return match ? match.quantity : 0;
  };

  return (
    <section className="py-24 bg-[#070709] border-t border-[#c5a869]/20 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Royal Chef's Signatures
            </span>
          </div>
          <h2 className="font-royal text-3xl sm:text-4xl md:text-5xl text-[#f5f0e6] font-bold tracking-wide mb-2">
            Featured Delicacies
          </h2>
          <p className="font-urdu text-2xl text-[#dfb75a] font-semibold mb-3">
            شاہی دسترخوان کے منتخب پکوان
          </p>
          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed">
            Slow-cooked Dum Biryanis, charcoal fired Tandoor specialties, and velvety gravies crafted with authentic Nawabi heritage in Hassan.
          </p>
        </div>

        {/* Grid of Featured Dishes with mouth-watering photography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 8).map((item) => {
            const itemId = item._id || (item as any).id;
            const catName = getCategoryName(item.categoryId);
            const photoUrl =
              item.image ||
              'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop';
            const isVeg = item.dietaryType === 'veg';
            const isEgg = item.dietaryType === 'egg';
            const qty = getItemQuantity(itemId);

            return (
              <div
                key={itemId}
                className="bg-[#121217] rounded-2xl border border-[#c5a869]/25 hover:border-[#dfb75a]/70 transition-all duration-300 flex flex-col justify-between group overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Food Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={photoUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 filter brightness-[0.92] contrast-[1.05]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {/* Dietary Marker */}
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center bg-[#131318]/95 backdrop-blur-sm ${
                        isVeg ? 'border-emerald-500' : isEgg ? 'border-amber-400' : 'border-rose-500'
                      }`}
                      title={isVeg ? 'Vegetarian' : isEgg ? 'Egg' : '100% Halal Non-Veg'}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isVeg ? 'bg-emerald-500' : isEgg ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                      />
                    </div>

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#131318]/90 border border-[#c5a869]/30 text-[#dfb75a] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {catName || 'Signature'}
                    </span>
                  </div>

                  {/* Spice or Bestseller badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    {item.bestseller && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold uppercase tracking-wider shadow-sm">
                        Bestseller
                      </span>
                    )}
                    {item.spiceLevel && (
                      <div className="px-2 py-0.5 rounded-md bg-[#131318]/90 border border-[#c5a869]/30 text-[10px] text-stone-200 flex items-center gap-1 backdrop-blur-sm">
                        <Flame className={`w-3 h-3 ${item.spiceLevel === 'spicy' ? 'text-rose-500' : 'text-amber-400'}`} />
                        <span className="capitalize">{item.spiceLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Price Tag Floating at bottom of image */}
                  {item.price !== null && item.price !== undefined && (
                    <div className="absolute bottom-2.5 right-3 px-3 py-1 rounded-full bg-[#131318]/95 border border-[#dfb75a]/70 shadow-md">
                      <span className="text-sm font-bold text-[#dfb75a] tracking-wider">
                        ₹{item.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Text Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-royal text-lg text-[#f5f0e6] group-hover:text-[#dfb75a] transition-colors font-bold tracking-wide mb-1 leading-snug">
                      {item.name}
                    </h3>

                    {item.urduName && (
                      <p className="font-urdu text-base text-[#dfb75a] font-semibold mb-2">
                        {item.urduName}
                      </p>
                    )}

                    {item.description ? (
                      <p className="text-xs text-[#a8a396] leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-xs text-[#78716c] italic mb-3">
                        Authentic culinary preparation from AL-TAJ HOTEL
                      </p>
                    )}
                  </div>

                  {/* Actions: Add to Cart / Stepper + Info */}
                  <div className="pt-3 border-t border-[#c5a869]/20 flex items-center justify-between gap-2">
                    {onSelectDish && (
                      <button
                        onClick={() => onSelectDish(item)}
                        className="p-2 rounded-lg bg-[#181822] hover:bg-[#222230] text-[#a8a396] hover:text-[#dfb75a] border border-[#c5a869]/20 transition-colors cursor-pointer"
                        title="View ingredients and details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}

                    {/* Cart Controller */}
                    {qty === 0 ? (
                      <button
                        onClick={() => onAddToCart?.(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Parcel</span>
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between rounded-lg bg-[#1c1c25] border border-[#dfb75a]/60 px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity?.(itemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#dfb75a] px-2">
                          {qty} in Cart
                        </span>
                        <button
                          onClick={() => onUpdateQuantity?.(itemId, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center mt-14">
          <button
            onClick={onViewFullMenu}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#131318] hover:bg-[#1c1c25] text-[#f5f0e6] hover:text-[#dfb75a] border border-[#c5a869]/40 hover:border-[#dfb75a] rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer shadow-lg transform hover:-translate-y-0.5"
          >
            <Utensils className="w-4 h-4 text-[#dfb75a]" />
            <span>Explore Complete Dastarkhwan (مکمل مینو)</span>
          </button>
        </div>

      </div>
    </section>
  );
};
