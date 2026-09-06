import React, { useState } from 'react';
import { Enquiry } from '../../types';
import { adminUpdateEnquiryStatus, adminDeleteEnquiry } from '../../lib/api';
import { Search, Phone, Mail, MessageSquare, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  enquiries: Enquiry[];
  onRefresh: () => void;
}

export const AdminEnquiries: React.FC<Props> = ({ enquiries, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    try {
      await adminUpdateEnquiryStatus(id, status);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteEnquiry(id);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q) ||
      (e.subject && e.subject.toLowerCase().includes(q));

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
          Guest Enquiries
        </h2>
        <p className="text-xs text-[#a8a396] mt-1">
          Review general guest questions, catering consultation, and feedback.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a869]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by guest name, email, message..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] placeholder-[#66625a] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] focus:outline-none"
        >
          <option value="ALL">All Enquiries ({enquiries.length})</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Enquiries Grid / Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8c887f] bg-[#121216] rounded-xl border border-[#c5a869]/20">
            No enquiries matching current filters.
          </div>
        ) : (
          filtered.map((item) => {
            const itemId = item._id || (item as any).id;
            return (
              <div
                key={itemId}
                className="bg-[#121216] border border-[#c5a869]/20 rounded-xl p-5 hover:border-[#c5a869]/40 transition-colors shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h4 className="font-royal text-base font-bold text-[#f5f0e6]">
                        {item.name}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1b24] text-[#c5a869] border border-[#c5a869]/20">
                        {item.subject || 'General'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                          item.status === 'RESOLVED'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-blue-950/70 text-blue-300 border-blue-800/50'
                            : 'bg-amber-950/70 text-amber-300 border-amber-800/50'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#8c887f] mb-3 flex-wrap">
                      <a href={`tel:${item.phone}`} className="hover:text-[#c5a869] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#c5a869]" />
                        {item.phone}
                      </a>
                      <a href={`mailto:${item.email}`} className="hover:text-[#c5a869] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#c5a869]" />
                        {item.email}
                      </a>
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${item.name}, thank you for reaching out to AL-TAJ HOTEL:`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 text-emerald-500 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </div>

                    <p className="text-xs text-[#d0cbc0] bg-[#16161c] p-3 rounded-lg border border-[#202028] leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    {item.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleStatusChange(itemId, 'RESOLVED')}
                        className="px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                    {item.status === 'NEW' && (
                      <button
                        onClick={() => handleStatusChange(itemId, 'IN_PROGRESS')}
                        className="px-3 py-1.5 bg-[#1f1f28] hover:bg-[#282836] text-[#faedd0] border border-[#c5a869]/30 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        In Progress
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(itemId)}
                      className="p-1.5 text-[#8c887f] hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-red-800/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold mb-2">
              Delete Enquiry?
            </h3>
            <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this guest message?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-[#1f1f26] text-[#d0cbc0] rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
