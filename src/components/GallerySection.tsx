import React, { useState } from 'react';
import { GalleryImage } from '../types';
import { Sparkles, Maximize2, X, Camera } from 'lucide-react';

interface Props {
  images: GalleryImage[];
  loading?: boolean;
}

export const GallerySection: React.FC<Props> = ({ images, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const filteredImages = images.filter((img) => {
    if (selectedCategory === 'all') return true;
    return img.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0e] relative border-t border-[#c5a869]/20">
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-1/3 w-80 h-80 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Visual Chronicles
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="font-royal text-3xl sm:text-5xl lg:text-6xl text-[#f5f0e6] font-bold tracking-wide">
              Mahāfil
            </h2>
            <span className="font-urdu text-3xl sm:text-5xl text-[#dfb75a] font-semibold">
              (محافل)
            </span>
          </div>

          <p className="font-urdu text-xl sm:text-2xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            محافل و دسترخوان کی جھلکیاں
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Glimpses of royal feasts, golden charcoal-flamed tandoor sizzles, serene family chambers, and treasured dining gatherings at Al Taj Hotel.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 mb-12 overflow-x-auto pb-3 scrollbar-none">
          {[
            { label: 'All Mahāfil', urdu: 'تمام', value: 'all' },
            { label: 'Food Specialties', urdu: 'خاص کھانے', value: 'food' },
            { label: 'Dining Spaces', urdu: 'دسترخوان', value: 'restaurant' },
            { label: 'Royal Ambiance', urdu: 'ماحول', value: 'ambiance' },
            { label: 'Events & Gatherings', urdu: 'تقاریب', value: 'events' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border flex items-center gap-2 whitespace-nowrap shadow-xs ${
                selectedCategory === tab.value
                  ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] font-bold border-[#dfb75a] shadow-md'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a] hover:text-[#f5f0e6]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`font-urdu text-xs ${selectedCategory === tab.value ? 'text-[#070709] font-bold' : 'text-[#dfb75a]'}`}>
                {tab.urdu}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#dfb75a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#dfb75a] font-bold">Loading Mahāfil Collection...</p>
          </div>
        )}

        {/* Image Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img._id || (img as any).id}
                onClick={() => setActiveImage(img)}
                className="group relative rounded-2xl overflow-hidden border border-[#c5a869]/20 hover:border-[#dfb75a]/70 transition-all duration-300 aspect-[4/3] bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9] contrast-[1.05]"
                />

                {/* Subtle vignette hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#dfb75a] font-bold block mb-1">
                    {img.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="font-royal text-base sm:text-lg text-white font-bold">
                      {img.title}
                    </h4>
                    {img.urduTitle && (
                      <span className="font-urdu text-base text-[#dfb75a] font-semibold">
                        {img.urduTitle}
                      </span>
                    )}
                  </div>
                  {img.caption && (
                    <p className="text-xs text-stone-200 mt-1 line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  )}
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-[#131318]/90 text-[#dfb75a] border border-[#c5a869]/40 shadow-xs backdrop-blur-sm">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Mobile Title Strip if not hovered */}
                <div className="sm:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between">
                  <span className="font-royal text-xs text-white font-medium truncate">{img.title}</span>
                  {img.urduTitle && <span className="font-urdu text-xs text-[#dfb75a]">{img.urduTitle}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeImage && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#131318] border border-[#c5a869]/40 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#1c1c25]/90 text-[#f5f0e6] hover:text-[#dfb75a] border border-[#c5a869]/30 shadow-md transition-colors cursor-pointer"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[72vh] flex items-center justify-center bg-stone-950 overflow-hidden">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="max-h-[72vh] w-full object-contain"
                />
              </div>

              <div className="p-6 bg-[#131318] border-t border-[#c5a869]/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#dfb75a] font-bold block mb-1">
                      {activeImage.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <h3 className="font-royal text-xl sm:text-2xl text-[#f5f0e6] font-bold">
                        {activeImage.title}
                      </h3>
                      {activeImage.urduTitle && (
                        <span className="font-urdu text-xl text-[#dfb75a] font-semibold">
                          {activeImage.urduTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {activeImage.caption && (
                  <p className="text-sm text-[#a8a396] mt-2.5 leading-relaxed">
                    {activeImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
