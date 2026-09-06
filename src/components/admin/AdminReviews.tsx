import React, { useState, useEffect } from 'react';
import { CustomerReview, ReviewStats } from '../../types';
import { adminFetchReviews, adminUpdateReviewStatus, adminDeleteReview } from '../../lib/api';
import { Star, CheckCircle, XCircle, Clock, Trash2, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 5,
    totalReviews: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await adminFetchReviews(statusFilter);
      setReviews(res.reviews);
      setStats(res.stats);
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    try {
      await adminUpdateReviewStatus(id, newStatus);
      setActionMessage(`Review marked as ${newStatus}`);
      setTimeout(() => setActionMessage(null), 3000);
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the review from "${name}"?`)) {
      return;
    }
    try {
      await adminDeleteReview(id);
      setActionMessage(`Review deleted successfully`);
      setTimeout(() => setActionMessage(null), 3000);
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#f5f0e6]">
            Customer Reviews Moderation
          </h2>
          <p className="text-xs text-[#a8a396] mt-1">
            Review, approve, or reject customer feedback and guest testimonials for Dastarkhwan-E-Al Taj.
          </p>
        </div>

        <button
          onClick={loadReviews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a20] hover:bg-[#25252e] text-[#c5a869] text-xs font-semibold uppercase tracking-wider border border-[#c5a869]/30 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#141418] border border-zinc-800 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
            Average Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#dfb75a] font-royal">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center text-[#dfb75a]">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        <div className="bg-[#141418] border border-zinc-800 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
            Total Reviews
          </span>
          <span className="text-2xl font-bold text-white font-mono">
            {stats.totalReviews}
          </span>
        </div>

        <div className="bg-[#141418] border border-emerald-900/40 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 block mb-1">
            Live Approved
          </span>
          <span className="text-2xl font-bold text-emerald-300 font-mono">
            {approvedCount}
          </span>
        </div>

        <div className="bg-[#141418] border border-amber-900/40 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-amber-400 block mb-1">
            Pending Moderation
          </span>
          <span className="text-2xl font-bold text-amber-300 font-mono">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-[#141418] border border-zinc-800 p-3.5 rounded-xl flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#c5a869]" />
            Status:
          </span>
          {['all', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
                statusFilter === st
                  ? 'bg-[#c5a869] text-black border-[#c5a869]'
                  : 'bg-[#1b1b22] text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-500 font-mono">
          Showing {reviews.length} reviews
        </span>
      </div>

      {/* Reviews Table / List */}
      {loading ? (
        <div className="py-16 text-center text-xs uppercase tracking-widest text-[#c5a869]">
          Loading Reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center bg-[#141418] border border-zinc-800 rounded-xl">
          <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No reviews found matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-[#141418] border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Review Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-royal text-base font-bold text-white">
                      {rev.customerName}
                    </h4>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-[#dfb75a]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-current text-[#dfb75a]' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : rev.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                          : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                      }`}
                    >
                      {rev.status}
                    </span>

                    {/* Dining Preference */}
                    {rev.diningPreference && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {rev.diningPreference}
                      </span>
                    )}

                    {rev.dishLoved && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e1a12] text-[#dfb75a] border border-[#c5a869]/20">
                        Loved: {rev.dishLoved}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#cac5ba] leading-relaxed italic bg-[#0f0f13] p-3 rounded-lg border border-zinc-800/80">
                    "{rev.reviewText}"
                  </p>

                  <div className="text-[11px] text-zinc-500 font-mono">
                    Submitted on {new Date(rev.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center sm:flex-col gap-2 shrink-0">
                  {rev.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(rev._id, 'APPROVED')}
                      className="flex-1 sm:w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-medium cursor-pointer transition-colors"
                      title="Approve and make visible on website"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleStatusChange(rev._id, 'REJECTED')}
                      className="flex-1 sm:w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-medium cursor-pointer transition-colors"
                      title="Reject and hide from public view"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {rev.status !== 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange(rev._id, 'PENDING')}
                      className="flex-1 sm:w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 text-xs font-medium cursor-pointer transition-colors"
                      title="Mark as pending moderation"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev._id, rev.customerName)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Permanently delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
