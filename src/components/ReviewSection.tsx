import React, { useState, useEffect } from 'react';
import { CustomerReview, ReviewStats, DiningPreference } from '../types';
import { fetchReviews, submitReview } from '../lib/api';
import { Star, MessageSquarePlus, CheckCircle2, ThumbsUp, X, Sparkles, Filter } from 'lucide-react';

export const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 4.9,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formPreference, setFormPreference] = useState<DiningPreference>('Family Room');
  const [formDishLoved, setFormDishLoved] = useState('');
  const [formReviewText, setFormReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchReviews();
      setReviews(res.reviews);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formName.trim()) {
      setSubmitError('Please enter your name');
      return;
    }
    if (!formReviewText.trim() || formReviewText.trim().length < 5) {
      setSubmitError('Please share a few words about your dining experience');
      return;
    }

    try {
      setSubmitting(true);
      await submitReview({
        customerName: formName.trim(),
        rating: formRating,
        reviewText: formReviewText.trim(),
        diningPreference: formPreference,
        dishLoved: formDishLoved.trim() || undefined
      });

      setSubmitSuccess('Shukriya! Your experience has been submitted with honor.');
      setFormName('');
      setFormReviewText('');
      setFormDishLoved('');
      setFormRating(5);
      
      // Reload reviews
      loadData();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(null);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  return (
    <section id="reviews" className="py-24 bg-[#0a0a0e] relative border-t border-[#c5a869]/20 text-[#f5f0e6]">
      {/* Backlit Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Guest Testimonials
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="font-royal text-3xl sm:text-5xl text-[#f5f0e6] font-bold tracking-wide">
              Customer Reviews & Ratings
            </h2>
          </div>

          <p className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            مہمانوں کے تاثرات اور تجربات
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Honoring every guest who graces our Dastarkhwan. Hear from families, food lovers, and travelers who experienced authentic Nawabi dining in Hassan.
          </p>
        </div>

        {/* Rating Summary Card & Action Bar */}
        <div className="bg-[#131318] border border-[#c5a869]/25 rounded-2xl p-6 sm:p-8 mb-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Main Score */}
            <div className="lg:col-span-4 text-center lg:border-r lg:border-[#c5a869]/20 lg:pr-8">
              <div className="font-royal text-5xl sm:text-6xl font-black text-[#dfb75a] tracking-tight">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(stats.averageRating)
                        ? 'text-[#dfb75a] fill-[#dfb75a]'
                        : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#a8a396] uppercase tracking-wider font-mono font-medium">
                Based on {stats.totalReviews} authentic guest reviews
              </p>
            </div>

            {/* Rating Bars */}
            <div className="lg:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((ratingNum) => {
                const count = stats.ratingDistribution[ratingNum] || 0;
                const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={ratingNum} className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => setFilterRating(filterRating === ratingNum ? 'all' : ratingNum)}
                      className="flex items-center gap-1 text-[#a8a396] hover:text-[#dfb75a] w-12 cursor-pointer font-mono font-bold"
                    >
                      <span>{ratingNum}</span>
                      <Star className="w-3 h-3 text-[#dfb75a] fill-[#dfb75a]" />
                    </button>
                    <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c5a869] to-[#dfb75a] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#a8a396] w-8 text-right font-mono font-semibold">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Write Review Button */}
            <div className="lg:col-span-3 text-center lg:text-right">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Share Your Experience</span>
              </button>
              <p className="font-urdu text-base text-[#dfb75a] font-semibold mt-2 text-center lg:text-right">
                اپنی رائے یا تاثرات درج کریں
              </p>
            </div>

          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#a8a396] font-medium flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#dfb75a]" />
              Filter:
            </span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shadow-xs ${
                filterRating === 'all'
                  ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] border-[#dfb75a]'
                  : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a] hover:text-[#f5f0e6]'
              }`}
            >
              All Reviews
            </button>
            {[5, 4, 3].map((starVal) => (
              <button
                key={starVal}
                onClick={() => setFilterRating(starVal)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shadow-xs ${
                  filterRating === starVal
                    ? 'bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] border-[#dfb75a]'
                    : 'bg-[#131318] text-[#a8a396] border-[#c5a869]/20 hover:border-[#dfb75a] hover:text-[#f5f0e6]'
                }`}
              >
                <span>{starVal}</span>
                <Star className="w-3 h-3 fill-current text-[#dfb75a]" />
              </button>
            ))}
          </div>

          <div className="text-xs text-[#a8a396] font-medium">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#dfb75a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#dfb75a] font-bold">Loading Guest Testimonials...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-[#131318] border border-[#c5a869]/20 hover:border-[#dfb75a]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                <div>
                  {/* Top Bar: Stars & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating
                              ? 'text-[#dfb75a] fill-[#dfb75a]'
                              : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>

                    {rev.verifiedDining && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Guest
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#d0cbc0] leading-relaxed mb-4 italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                {/* Bottom Meta */}
                <div className="pt-4 border-t border-[#c5a869]/20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-royal text-base text-[#f5f0e6] font-bold">
                      {rev.customerName}
                    </h4>
                    <span className="text-[10px] text-[#a8a396] font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Dining Preference & Dish Loved */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {rev.diningPreference && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#1c1c25] text-[#dfb75a] border border-[#c5a869]/30 font-bold">
                        {rev.diningPreference}
                      </span>
                    )}
                    {rev.dishLoved && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#241c10] text-[#dfb75a] border border-[#c5a869]/30 flex items-center gap-1 font-medium">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        {rev.dishLoved}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Write Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#131318] border border-[#c5a869]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#f5f0e6]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1c25] text-[#a8a396] hover:text-[#f5f0e6] border border-[#c5a869]/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <h3 className="font-royal text-2xl text-[#f5f0e6] font-bold">
                  Share Your Experience
                </h3>
                <p className="font-urdu text-lg text-[#dfb75a] font-semibold mt-0.5">
                  ال تاج ہوٹل میں اپنے کھانے کے تاثرات پیش کریں
                </p>
                <p className="text-xs text-[#a8a396] mt-1">
                  Your review honors our culinary khidmat and guides fellow guests.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-950/80 border border-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-royal text-lg text-emerald-200 font-bold">
                    {submitSuccess}
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Thank you for choosing Al Taj Hotel.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 text-xs bg-red-950/80 border border-red-800 text-red-300 rounded-lg font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* Interactive Star Rating */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfb75a] mb-1.5 font-bold">
                      Your Rating (ستارے) *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || formRating)
                                ? 'text-[#dfb75a] fill-[#dfb75a]'
                                : 'text-stone-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-[#dfb75a] font-mono font-bold ml-2">
                        {hoverRating || formRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfb75a] mb-1 font-bold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Mohammed Farhan"
                      className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none"
                    />
                  </div>

                  {/* Dining Preference Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfb75a] mb-1 font-bold">
                      Dining Area Experienced
                    </label>
                    <select
                      value={formPreference}
                      onChange={(e) => setFormPreference(e.target.value as DiningPreference)}
                      className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none"
                    >
                      <option value="General Seating" className="bg-[#131318] text-[#f5f0e6]">General Seating (عوامی نشست)</option>
                      <option value="Family Room" className="bg-[#131318] text-[#f5f0e6]">Family Room (خاندانی کمرہ)</option>
                      <option value="Events & Celebrations" className="bg-[#131318] text-[#f5f0e6]">Events & Celebrations (تقاریب و جشن)</option>
                      <option value="Mandi" className="bg-[#131318] text-[#f5f0e6]">Mandi Seating (شاہی مندی دسترخوان)</option>
                    </select>
                  </div>

                  {/* Favorite Dish Loved */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfb75a] mb-1 font-bold">
                      Dish You Loved Most (Optional)
                    </label>
                    <input
                      type="text"
                      value={formDishLoved}
                      onChange={(e) => setFormDishLoved(e.target.value)}
                      placeholder="e.g., Al Taj Special Dum Biryani / Tandoori Chicken"
                      className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfb75a] mb-1 font-bold">
                      Your Review & Experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formReviewText}
                      onChange={(e) => setFormReviewText(e.target.value)}
                      placeholder="Describe the flavor, hospitality, or atmosphere..."
                      className="w-full px-4 py-2.5 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] hover:opacity-95 text-[#070709] font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {submitting ? 'Submitting Review...' : 'Submit Review (ارسال کریں)'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
