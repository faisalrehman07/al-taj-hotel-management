import React, { useState, useMemo } from 'react';
import { MenuItem, MenuCategory, CartItem } from '../types';
import { Search, Utensils, Sparkles, X, Flame, Leaf, Info, Calendar, Plus, Minus, ShoppingBag, MessageCircle, SlidersHorizontal } from 'lucide-react';

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  loading?: boolean;
  onBookTable?: () => void;
  cart?: CartItem[];
  onAddToCart?: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
  onOpenCart?: () => void;
  whatsappNumber?: string;
}

export const MenuSection: React.FC<Props> = ({
  items,
  categories,
  loading,
  onBookTable,
  cart = [],
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
  whatsappNumber = '9620532473',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'non-veg' | 'veg' | 'egg'>('all');
  const [spiceFilter, setSpiceFilter] = useState<'all' | 'mild' | 'medium' | 'spicy'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'bestsellers'>('default');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const getItemQuantity = (itemId: string) => {
    const match = cart.find((c) => (c.item._id || (c.item as any).id) === itemId);
    return match ? match.quantity : 0;
  };

  const totalCartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalCartValue = cart.reduce((sum, c) => sum + (c.item.price || 0) * c.quantity, 0);

  // Filter items based on active category, search query, dietary filter, and spice level
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const catId = item.categoryId;
      const matchesCategory =
        selectedCategory === 'all' || catId === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.urduName && item.urduName.includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesDiet =
        dietaryFilter === 'all' ||
        (item.dietaryType || 'non-veg') === dietaryFilter;

      const matchesSpice =
        spiceFilter === 'all' ||
        (item.spiceLevel || 'medium') === spiceFilter;

      return matchesCategory && matchesSearch && matchesDiet && matchesSpice;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'bestsellers') {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return result;
  }, [items, selectedCategory, searchQuery, dietaryFilter, spiceFilter, sortBy]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: { category: MenuCategory; items: MenuItem[] }[] = [];

    const activeCategories = selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c._id === selectedCategory || (c as any).id === selectedCategory);

    activeCategories.forEach((cat) => {
      const catId = cat._id || (cat as any).id;
      const catItems = filteredItems.filter((i) => i.categoryId === catId);
      if (catItems.length > 0) {
        groups.push({ category: cat, items: catItems });
      }
    });

    return groups;
  }, [categories, filteredItems, selectedCategory]);

  return (
    <section id="menu" className="py-24 bg-[#070709] text-[#f5f0e6] relative border-t border-[#c5a869]/20">
      {/* Soft warm dark ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-sm">
            <Utensils className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Royal Dining Selection
            </span>
          </div>

          <h2 className="font-royal text-3xl sm:text-5xl lg:text-6xl text-[#f5f0e6] font-bold tracking-wide mb-2">
            Dastarkhwan-E-Al Taj
          </h2>

          <p className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            دسترخوانِ ال تاج
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A celebration of Nawabi dining, charcoal tandoor fires, rich aromatic dum biryanis, and tender slow-cooked delicacies crafted with reverence and authentic khidmat.
          </p>
        </div>

        {/* Search & Dietary Filters */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfb75a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Dastarkhwan (e.g., Tandoori, Biryani, Mutton, Shawarma, Roti)..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#131318] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-[#8c857b] focus:outline-none transition-colors shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a396] hover:text-[#f5f0e6] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Dietary Preference Toggles */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                dietaryFilter === 'all'
                  ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold border-[#dfb75a] shadow-md'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setDietaryFilter('non-veg')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                dietaryFilter === 'non-veg'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600 font-bold'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-rose-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Non-Veg (Halal)
            </button>
            <button
              onClick={() => setDietaryFilter('veg')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600 font-bold'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-emerald-500'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-400" />
              Vegetarian & Breads
            </button>
            <button
              onClick={() => setDietaryFilter('egg')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                dietaryFilter === 'egg'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 font-bold'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-amber-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Egg Dishes
            </button>
          </div>

          {/* Secondary Filter: Spice Level & Sort Options */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#c5a869]/15 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#a8a396] text-[11px] uppercase tracking-wider mr-1">Spice:</span>
              {(['all', 'mild', 'medium', 'spicy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpiceFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize cursor-pointer transition-colors border ${
                    spiceFilter === lvl
                      ? 'bg-[#252532] text-[#dfb75a] border-[#dfb75a]'
                      : 'bg-[#131318] text-[#8c857b] border-[#c5a869]/20 hover:text-[#d0cbc0]'
                  }`}
                >
                  {lvl === 'all' ? 'All' : lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="w-3 h-3 text-[#dfb75a]" />
              <span className="text-[#a8a396] text-[11px] uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#131318] border border-[#c5a869]/30 text-[#f5f0e6] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#dfb75a] cursor-pointer"
              >
                <option value="default">Chef's Order</option>
                <option value="bestsellers">Bestsellers First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs (Scrollable on mobile) */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-14 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold border-[#dfb75a] shadow-md'
                : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a] hover:text-[#f5f0e6]'
            }`}
          >
            All Dastarkhwan
          </button>
          {categories.map((cat) => {
            const catId = cat._id || (cat as any).id;
            const isSelected = selectedCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold border-[#dfb75a] shadow-md'
                    : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a] hover:text-[#f5f0e6]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.urduName && (
                  <span className={`font-urdu text-sm ${isSelected ? 'text-[#070709] font-bold' : 'text-[#dfb75a]'}`}>
                    {cat.urduName}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#dfb75a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#dfb75a] font-semibold">Preparing Dastarkhwan-E-Al Taj...</p>
          </div>
        )}

        {/* Menu Items Content */}
        {!loading && (
          <div className="space-y-16">
            {groupedItems.length > 0 ? (
              groupedItems.map(({ category, items: catItems }) => (
                <div key={category._id || (category as any).id} className="relative">
                  {/* Category Header with Royal Divider */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c5a869]/40 to-transparent" />
                    <div className="text-center px-4">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="font-royal text-2xl sm:text-3xl text-[#f5f0e6] font-bold tracking-wider uppercase">
                          {category.name}
                        </h3>
                        {category.urduName && (
                          <span className="font-urdu text-2xl text-[#dfb75a]">
                            {category.urduName}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] tracking-[0.2em] text-[#dfb75a] uppercase font-mono font-semibold">
                        {catItems.length} {catItems.length === 1 ? 'Delicacy' : 'Delicacies'}
                      </span>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c5a869]/40 to-transparent" />
                  </div>

                  {/* 3-Column Visual Grid with Individual Food Photography */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catItems.map((item) => {
                      const photoUrl =
                        item.image ||
                        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop';
                      const isVeg = item.dietaryType === 'veg';
                      const isEgg = item.dietaryType === 'egg';

                      const itemId = item._id || (item as any).id;
                      const qty = getItemQuantity(itemId);

                      return (
                        <div
                          key={itemId}
                          className={`group rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                            item.available
                              ? 'bg-[#131318] hover:bg-[#181820] border-[#c5a869]/20 hover:border-[#dfb75a]/60 shadow-lg hover:shadow-2xl'
                              : 'bg-[#0f0f14] border-[#c5a869]/10 opacity-60'
                          }`}
                        >
                          {/* Food Photograph Container */}
                          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900">
                            <img
                              src={photoUrl}
                              alt={item.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9] contrast-[1.05]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop';
                              }}
                            />
                            {/* Gradient Overlay for Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                            {/* Badges on Top of Photo */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                              {/* Dietary Indicator */}
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center bg-[#131318]/95 backdrop-blur-sm shadow-xs ${
                                  isVeg
                                    ? 'border-emerald-500'
                                    : isEgg
                                    ? 'border-amber-400'
                                    : 'border-rose-500'
                                }`}
                                title={isVeg ? 'Vegetarian' : isEgg ? 'Egg' : 'Non-Vegetarian (Halal)'}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isVeg
                                      ? 'bg-emerald-500'
                                      : isEgg
                                      ? 'bg-amber-400'
                                      : 'bg-rose-500'
                                  }`}
                                />
                              </div>

                              {/* Bestseller / Special */}
                              {item.featured && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold uppercase tracking-wider shadow-sm">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Special
                                </span>
                              )}
                              {item.bestseller && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold uppercase tracking-wider shadow-sm">
                                  Bestseller
                                </span>
                              )}
                            </div>

                            {/* Spice Level Badge */}
                            {item.spiceLevel && (
                              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#131318]/90 backdrop-blur-sm border border-[#c5a869]/30 text-[10px] text-stone-300 font-medium flex items-center gap-1 shadow-xs">
                                <Flame className={`w-3 h-3 ${item.spiceLevel === 'spicy' ? 'text-rose-500' : 'text-amber-400'}`} />
                                <span className="capitalize">{item.spiceLevel}</span>
                              </div>
                            )}

                            {/* Price Floating Pill */}
                            {item.price !== null && item.price !== undefined && (
                              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#131318]/95 border border-[#c5a869]/50 shadow-md">
                                <span className="font-bold text-sm sm:text-base text-[#dfb75a] tracking-wider">
                                  ₹{item.price}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content & Descriptions */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h4 className="font-royal text-lg sm:text-xl font-bold text-[#f5f0e6] tracking-wide group-hover:text-[#dfb75a] transition-colors">
                                  {item.name}
                                </h4>
                              </div>

                              {/* Urdu Subtitle */}
                              {item.urduName && (
                                <p className="font-urdu text-base text-[#dfb75a] font-semibold mb-2">
                                  {item.urduName}
                                </p>
                              )}

                              {item.description && (
                                <p className="text-xs text-[#a8a396] leading-relaxed line-clamp-2 mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Bottom Actions - Add to Parcel / Stepper + Details */}
                            <div className="mt-5 pt-3.5 border-t border-[#c5a869]/15 flex items-center justify-between gap-2">
                              <button
                                onClick={() => setSelectedDish(item)}
                                className="p-2.5 rounded-lg bg-[#1c1c25] hover:bg-[#252532] text-[#dfb75a] border border-[#c5a869]/30 hover:border-[#dfb75a] text-xs font-bold transition-colors cursor-pointer shadow-sm"
                                title="View details and recipe"
                              >
                                <Info className="w-4 h-4" />
                              </button>

                              {qty === 0 ? (
                                <button
                                  onClick={() => onAddToCart?.(item)}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Parcel</span>
                                </button>
                              ) : (
                                <div className="flex-1 flex items-center justify-between rounded-lg bg-[#1c1c25] border border-[#dfb75a]/70 px-2.5 py-1">
                                  <button
                                    onClick={() => onUpdateQuantity?.(itemId, -1)}
                                    className="w-7 h-7 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer transition-colors"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-bold text-[#dfb75a] px-2">
                                    {qty} in Parcel
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity?.(itemId, 1)}
                                    className="w-7 h-7 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#131318] rounded-2xl border border-[#c5a869]/30 max-w-md mx-auto shadow-xl">
                <Utensils className="w-8 h-8 text-[#dfb75a]/40 mx-auto mb-3" />
                <h4 className="font-royal text-lg text-[#f5f0e6] font-bold mb-1">No Delicacy Found</h4>
                <p className="text-xs text-[#a8a396] mb-4">
                  No menu items matched your filter or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setDietaryFilter('all');
                  }}
                  className="px-5 py-2 bg-[#1c1c25] hover:bg-[#252532] text-[#dfb75a] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#c5a869]/40 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal for Dish Details */}
        {selectedDish && (() => {
          const dishId = selectedDish._id || (selectedDish as any).id;
          const dishQty = getItemQuantity(dishId);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-[#131318] border border-[#c5a869]/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#1c1c25]/90 text-[#f5f0e6] flex items-center justify-center hover:bg-[#252532] shadow-md cursor-pointer border border-[#c5a869]/30"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="h-60 w-full relative">
                  <img
                    src={selectedDish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {selectedDish.price !== null && selectedDish.price !== undefined && (
                    <div className="absolute bottom-3 right-4 px-4 py-1 rounded-full bg-[#131318]/95 border border-[#dfb75a] text-[#dfb75a] font-bold text-lg shadow-md">
                      ₹{selectedDish.price}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-royal text-2xl text-[#f5f0e6] font-bold">
                      {selectedDish.name}
                    </h3>
                    {selectedDish.urduName && (
                      <span className="font-urdu text-2xl text-[#dfb75a]">
                        {selectedDish.urduName}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#d0cbc0] leading-relaxed mb-6">
                    {selectedDish.description || 'Traditional Al Taj recipe prepared with fresh authentic ingredients, charcoal embers, and royal aromatic spices.'}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c5a869]/20 pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#a8a396] font-medium">
                      <span className="capitalize">{selectedDish.dietaryType || 'Non-Veg'}</span>
                      <span>•</span>
                      <span className="capitalize">{selectedDish.spiceLevel || 'Medium Spice'}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* Parcel Cart Action inside Modal */}
                      {dishQty === 0 ? (
                        <button
                          onClick={() => onAddToCart?.(selectedDish)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Parcel</span>
                        </button>
                      ) : (
                        <div className="flex items-center rounded-lg bg-[#1c1c25] border border-[#dfb75a]/70 px-2 py-1">
                          <button
                            onClick={() => onUpdateQuantity?.(dishId, -1)}
                            className="w-6 h-6 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#dfb75a] px-2">
                            {dishQty} in Parcel
                          </span>
                          <button
                            onClick={() => onUpdateQuantity?.(dishId, 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Direct WhatsApp Dish Inquire */}
                      <a
                        href={`https://wa.me/91${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Al-Taj Hotel Hassan! I would like to inquire about "${selectedDish.name}" (₹${selectedDish.price || 'Special'}). Is it available today?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#152317] hover:bg-[#1a2d1d] text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        title="Inquire directly on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {onBookTable && (
                        <button
                          onClick={() => {
                            setSelectedDish(null);
                            onBookTable();
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1c1c25] text-[#dfb75a] border border-[#c5a869]/30 hover:border-[#dfb75a] font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Book Table</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedDish(null)}
                        className="px-3 py-2 rounded-lg bg-[#1c1c25] text-[#a8a396] hover:text-[#f5f0e6] text-xs font-semibold uppercase tracking-wider border border-[#c5a869]/30 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Sticky Floating Parcel Bar when dishes are selected */}
        {totalCartCount > 0 && onOpenCart && (
          <div className="sticky bottom-6 z-30 max-w-xl mx-auto mt-10">
            <button
              onClick={onOpenCart}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#dfb75a] via-[#c5a869] to-[#dfb75a] text-[#070709] font-bold shadow-[0_10px_35px_rgba(223,183,90,0.35)] hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-[#fff2c6]/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#070709] text-[#dfb75a] flex items-center justify-center font-bold text-xs shadow-inner">
                  {totalCartCount}
                </div>
                <div className="text-left">
                  <span className="text-xs uppercase tracking-wider block font-extrabold">Your Dastarkhwan Parcel</span>
                  <span className="text-[11px] opacity-85">{totalCartCount} items added • Freshly Prepared</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base sm:text-lg font-black tracking-tight">₹{totalCartValue}</span>
                <span className="text-xs uppercase font-extrabold tracking-wider bg-[#070709] text-[#dfb75a] px-3.5 py-1.5 rounded-xl shadow-xs">View Parcel →</span>
              </div>
            </button>
          </div>
        )}

        {/* Khidmat & Hospitality Note */}
        <div className="mt-16 text-center text-xs text-[#a8a396] max-w-xl mx-auto border-t border-[#c5a869]/20 pt-6">
          <p>
            Al Taj Hotel welcomes you to our dining hall at 234V+5GH, Ameer Mohalla, Hassan. 
            All dishes are prepared fresh upon order following strict Halal culinary standards.
          </p>
        </div>

      </div>
    </section>
  );
};
