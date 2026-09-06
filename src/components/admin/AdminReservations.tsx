import React, { useState } from 'react';
import { Reservation } from '../../types';
import { adminUpdateReservationStatus, adminDeleteReservation } from '../../lib/api';
import { Search, Calendar, Phone, MessageSquare, CheckCircle, XCircle, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  reservations: Reservation[];
  onRefresh: () => void;
}

export const AdminReservations: React.FC<Props> = ({ reservations, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (id: string, newStatus: Reservation['status']) => {
    try {
      await adminUpdateReservationStatus(id, newStatus);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update reservation');
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await adminDeleteReservation(id);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete reservation');
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchDate = !dateFilter || r.date === dateFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.reservationId.toLowerCase().includes(q) ||
      (r.email && r.email.toLowerCase().includes(q));

    return matchStatus && matchDate && matchSearch;
  });

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50';
      case 'CANCELLED':
        return 'bg-red-950/70 text-red-300 border-red-800/50';
      case 'COMPLETED':
        return 'bg-blue-950/70 text-blue-300 border-blue-800/50';
      default:
        return 'bg-amber-950/70 text-amber-300 border-amber-700/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
          Table Reservations
        </h2>
        <p className="text-xs text-[#a8a396] mt-1">
          Review, confirm, or cancel customer table reservations in Hassan.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a869]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or reservation ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] placeholder-[#66625a] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] focus:outline-none"
        >
          <option value="ALL">All Statuses ({reservations.length})</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] focus:outline-none"
        />

        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="px-2.5 py-2 text-xs text-[#a8a396] hover:text-[#f5f0e6] cursor-pointer"
          >
            Clear Date
          </button>
        )}
      </div>

      {/* Reservations Table */}
      <div className="bg-[#121216] border border-[#c5a869]/20 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17171d] border-b border-[#25252e] text-[#8c887f] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Ref ID</th>
                <th className="py-3 px-4 font-semibold">Guest Details</th>
                <th className="py-3 px-4 font-semibold">Reservation Time</th>
                <th className="py-3 px-4 font-semibold">Party & Notes</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c24] text-[#d0cbc0]">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#8c887f]">
                    No reservations matching current filters.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const resId = res._id || (res as any).id;
                  return (
                    <tr key={resId} className="hover:bg-[#181820]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#c5a869] font-medium">
                        {res.reservationId}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-royal text-sm font-semibold text-[#f5f0e6]">
                          {res.customerName}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#8c887f] mt-1">
                          <a href={`tel:${res.phone}`} className="hover:text-[#c5a869] flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {res.phone}
                          </a>
                          <a
                            href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${res.customerName}, regarding your table booking (${res.reservationId}) at AL-TAJ HOTEL:`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-400 text-emerald-500"
                            title="WhatsApp Guest"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-[#f5f0e6] font-medium">
                          {res.date}
                        </p>
                        <p className="text-[11px] text-[#8c887f]">
                          {res.time}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#f5f0e6]">{res.guests} Guests</span>
                        <span className="text-[11px] text-[#c5a869] block">
                          {res.occasion || 'Dining'}
                        </span>
                        {res.specialRequest && (
                          <p className="text-[11px] text-[#8c887f] italic max-w-xs mt-0.5">
                            "{res.specialRequest}"
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(res.status)}`}>
                          {res.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {res.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(resId, 'CONFIRMED')}
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50 rounded cursor-pointer transition-colors"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {res.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(resId, 'CANCELLED')}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-950/50 rounded cursor-pointer transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(resId, 'COMPLETED')}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50 rounded cursor-pointer transition-colors"
                            title="Mark as Completed"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(resId)}
                          className="p-1.5 text-[#8c887f] hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-red-800/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold mb-2">
              Delete Reservation?
            </h3>
            <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this reservation record?
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
