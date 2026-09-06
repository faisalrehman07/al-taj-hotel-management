import React from 'react';
import { MenuItem, MenuCategory, Reservation, Enquiry, GalleryImage } from '../../types';
import { Utensils, Layers, Calendar, Clock, MessageSquare, Image, ArrowRight, CheckCircle2, Star } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  reservations: Reservation[];
  enquiries: Enquiry[];
  gallery: GalleryImage[];
  onNavigateTab: (tab: string) => void;
  onUpdateReservationStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED') => void;
}

export const AdminDashboard: React.FC<Props> = ({
  menuItems,
  categories,
  reservations,
  enquiries,
  gallery,
  onNavigateTab,
  onUpdateReservationStatus,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayReservations = reservations.filter((r) => r.date === todayStr);
  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');
  const newEnquiries = enquiries.filter((e) => e.status === 'NEW');

  const stats = [
    {
      label: 'Total Menu Items',
      value: menuItems.length,
      icon: Utensils,
      tab: 'menu',
      desc: 'Authentic AL-TAJ dishes',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Layers,
      tab: 'categories',
      desc: 'Active menu sections',
    },
    {
      label: "Today's Bookings",
      value: todayReservations.length,
      icon: Calendar,
      tab: 'reservations',
      desc: `${todayStr}`,
    },
    {
      label: 'Pending Requests',
      value: pendingReservations.length,
      icon: Clock,
      tab: 'reservations',
      desc: 'Awaiting confirmation',
      highlight: pendingReservations.length > 0,
    },
    {
      label: 'New Enquiries',
      value: newEnquiries.length,
      icon: MessageSquare,
      tab: 'enquiries',
      desc: 'Guest messages',
      highlight: newEnquiries.length > 0,
    },
    {
      label: 'Gallery Photos',
      value: gallery.length,
      icon: Image,
      tab: 'gallery',
      desc: 'Showcase photos',
    },
    {
      label: 'Customer Reviews',
      value: 'Live',
      icon: Star,
      tab: 'reviews',
      desc: 'Moderate ratings & feedback',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#121216] border border-[#c5a869]/30 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#c5a869] uppercase font-serif font-semibold block mb-1">
            Restaurant Management CMS
          </span>
          <h2 className="font-royal text-2xl sm:text-3xl text-[#f5f0e6] font-bold">
            AL-TAJ HOTEL Control Panel
          </h2>
          <p className="text-xs text-[#a8a396] mt-1 font-serif italic">
            "Al Taj is ready for your KHIDMAT" • Ameer Mohalla, Hassan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('menu')}
            className="px-4 py-2.5 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Manage Menu</span>
          </button>
          <button
            onClick={() => onNavigateTab('reservations')}
            className="px-4 py-2.5 bg-[#1a1a22] hover:bg-[#23232d] text-[#faedd0] border border-[#c5a869]/30 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Reservations
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer group shadow-lg ${
                item.highlight
                  ? 'bg-[#15151c] border-[#c5a869]/60 hover:border-[#c5a869]'
                  : 'bg-[#121215] border-[#c5a869]/20 hover:border-[#c5a869]/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#8c887f] font-medium uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="font-royal text-3xl font-bold text-[#f5f0e6] mt-2 mb-1 group-hover:text-[#faedd0] transition-colors">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-[#78746c]">
                    {item.desc}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${item.highlight ? 'bg-[#c5a869]/20 text-[#c5a869]' : 'bg-[#191920] text-[#a39e93] group-hover:text-[#c5a869]'} transition-colors`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Reservations Spotlight */}
      <div className="bg-[#121215] border border-[#c5a869]/25 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold tracking-wide">
              Pending Table Requests
            </h3>
            <p className="text-xs text-[#8c887f]">
              Direct customer booking requests requiring confirmation.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('reservations')}
            className="text-xs text-[#c5a869] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingReservations.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8c887f] bg-[#16161b] rounded-lg border border-[#1f1f26]">
            No pending reservations at this moment. All table requests are confirmed or processed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#22222a] text-[#8c887f] uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Ref ID</th>
                  <th className="pb-3 font-semibold">Guest</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Guests</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e26] text-[#d0cbc0]">
                {pendingReservations.slice(0, 5).map((res) => (
                  <tr key={res._id || (res as any).id} className="hover:bg-[#181820]/60 transition-colors">
                    <td className="py-3 font-mono text-[#c5a869] font-medium">
                      {res.reservationId}
                    </td>
                    <td className="py-3 font-medium text-[#f5f0e6]">
                      {res.customerName}
                    </td>
                    <td className="py-3">
                      {res.date} • {res.time}
                    </td>
                    <td className="py-3">
                      {res.guests} ({res.occasion || 'Dining'})
                    </td>
                    <td className="py-3">
                      <a href={`tel:${res.phone}`} className="hover:text-[#c5a869]">
                        {res.phone}
                      </a>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => onUpdateReservationStatus(res._id || (res as any).id, 'CONFIRMED')}
                        className="px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 text-[11px] rounded font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
