import React, { useState } from 'react';
import { Calendar, Users, Clock, Phone, CheckCircle, Sparkles, Armchair, Home, PartyPopper, UtensilsCrossed } from 'lucide-react';
import { submitReservation } from '../lib/api';
import { Reservation, WebsiteSettings, DiningPreference } from '../types';

interface Props {
  settings?: WebsiteSettings;
}

export const BookingSection: React.FC<Props> = ({ settings }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    time: '19:30',
    guests: 4,
    diningPreference: 'Family Room' as DiningPreference,
    occasion: 'Family Dining',
    specialRequest: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const timeSlots = [
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
  ];

  const occasions = [
    'Family Dining',
    'Birthday Celebration',
    'Anniversary',
    'Get-Together / Feast',
    'Business / Formal Dining',
    'Casual Dining'
  ];

  const diningPreferencesList: {
    id: DiningPreference;
    title: string;
    urdu: string;
    description: string;
    icon: any;
  }[] = [
    {
      id: 'General Seating',
      title: 'General Seating',
      urdu: 'عوامی نشست',
      description: 'Lively, comfortable dining hall setup with spacious tables for friends and quick gatherings.',
      icon: Armchair
    },
    {
      id: 'Family Room',
      title: 'Family Room',
      urdu: 'خاندانی کمرہ',
      description: 'Private, secluded dining chambers offering refined privacy and comfort for families.',
      icon: Home
    },
    {
      id: 'Events & Celebrations',
      title: 'Events & Celebrations',
      urdu: 'تقاریب و جشن',
      description: 'Custom seating setup for milestone celebrations, birthday parties, and festive banquets.',
      icon: PartyPopper
    },
    {
      id: 'Mandi',
      title: 'Mandi Seating',
      urdu: 'شاہی مندی دسترخوان',
      description: 'Authentic Arabian carpeted floor seating with low brass tables for traditional communal feasting.',
      icon: UtensilsCrossed
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError('Please provide a valid phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.date) {
      setError('Please select a reservation date');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitReservation(formData);
      setConfirmedReservation(result);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        date: '',
        time: '19:30',
        guests: 4,
        diningPreference: 'Family Room',
        occasion: 'Family Dining',
        specialRequest: '',
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit reservation. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const businessPhone = settings?.phone || '+91 94801 23456';

  return (
    <section id="booking" className="py-24 bg-[#070709] relative overflow-hidden border-t border-[#c5a869]/20 text-[#f5f0e6]">
      {/* Ambient soft background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(197,168,105,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#131318] mb-3.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#dfb75a]" />
            <span className="text-[11px] tracking-[0.24em] text-[#dfb75a] uppercase font-serif font-bold">
              Table Reservations
            </span>
          </div>

          <h2 className="font-royal text-3xl sm:text-5xl text-[#f5f0e6] font-bold tracking-wide mb-2">
            Reserve Your Dastarkhwan
          </h2>

          <p className="font-urdu text-2xl sm:text-3xl text-[#dfb75a] font-semibold tracking-wide mb-3">
            میز اور دسترخوان کی پیشگی بکنگ
          </p>

          <p className="text-[#a8a396] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Select your preferred dining space—whether a private Family Room, authentic carpeted Mandi floor seating, or lively General dining.
          </p>
        </div>

        {/* Confirmation Modal / Card */}
        {confirmedReservation ? (
          <div className="bg-[#131318] border border-[#c5a869]/40 rounded-2xl p-8 sm:p-10 shadow-2xl text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#c5a869]/20 border border-[#dfb75a] rounded-full flex items-center justify-center mx-auto mb-6 text-[#dfb75a]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-royal text-2xl sm:text-3xl text-[#f5f0e6] font-bold mb-1">
              Table Request Submitted
            </h3>
            <p className="font-urdu text-xl text-[#dfb75a] font-semibold mb-2">
              آپ کی درخواست موصول ہوگئی ہے
            </p>
            
            <p className="text-xs text-[#dfb75a] uppercase tracking-widest font-mono mb-6 font-bold">
              Reference: {confirmedReservation.reservationId}
            </p>

            <div className="bg-[#0d0d12] rounded-xl p-5 border border-[#c5a869]/20 text-left space-y-2.5 text-xs sm:text-sm text-[#d0cbc0] mb-6">
              <div className="flex justify-between">
                <span className="text-[#a8a396]">Guest Name:</span>
                <span className="font-bold text-[#f5f0e6]">{confirmedReservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a8a396]">Dining Space:</span>
                <span className="font-bold text-[#dfb75a]">{confirmedReservation.diningPreference || 'Family Room'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a8a396]">Date & Time:</span>
                <span className="font-medium text-[#f5f0e6]">{confirmedReservation.date} at {confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a8a396]">Guests:</span>
                <span className="font-medium text-[#f5f0e6]">{confirmedReservation.guests} Persons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a8a396]">Phone:</span>
                <span className="font-medium text-[#f5f0e6]">{confirmedReservation.phone}</span>
              </div>
            </div>

            <p className="text-xs text-[#a8a396] leading-relaxed mb-8">
              Our hospitality team at AL-TAJ HOTEL will review table availability and contact your phone shortly to confirm your booking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-md transition-opacity"
              >
                <Phone className="w-4 h-4" />
                <span>Call Restaurant Desk</span>
              </a>
              <button
                onClick={() => setConfirmedReservation(null)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#1c1c25] hover:bg-[#252532] text-[#f5f0e6] border border-[#c5a869]/30 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Reserve Another Table
              </button>
            </div>
          </div>
        ) : (
          /* The Booking Form */
          <div className="bg-[#131318] border border-[#c5a869]/25 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Dining Preference Selection Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#dfb75a] mb-3">
                  1. Choose Dining Preference (نشست کا انتخاب) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {diningPreferencesList.map((pref) => {
                    const isSelected = formData.diningPreference === pref.id;
                    const IconComp = pref.icon;
                    return (
                      <div
                        key={pref.id}
                        onClick={() => setFormData({ ...formData, diningPreference: pref.id })}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-[#1c1c25] border-[#dfb75a] shadow-md ring-1 ring-[#dfb75a]'
                            : 'bg-[#0d0d12] border-[#c5a869]/20 hover:border-[#dfb75a]/50'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#dfb75a] text-[#070709]'
                              : 'bg-[#1c1c25] text-[#dfb75a]'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-royal text-base font-bold text-[#f5f0e6]">
                              {pref.title}
                            </h4>
                            <span className="font-urdu text-base text-[#dfb75a] font-semibold">
                              {pref.urdu}
                            </span>
                          </div>
                          <p className="text-xs text-[#a8a396] leading-relaxed mt-1">
                            {pref.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#dfb75a] mb-3">
                  2. Guest & Contact Information *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g., Syed Arshad"
                      className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 94801 23456"
                      className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfb75a]" />
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                        className="w-full pl-11 pr-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30].map((num) => (
                          <option key={num} value={num} className="bg-[#131318] text-[#f5f0e6]">
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#dfb75a] mb-3">
                  3. Schedule & Special Requests *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Reservation Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={getTodayString()}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfb75a]" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none transition-colors"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot} className="bg-[#131318] text-[#f5f0e6]">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] focus:outline-none transition-colors"
                    >
                      {occasions.map((occ) => (
                        <option key={occ} value={occ} className="bg-[#131318] text-[#f5f0e6]">
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d0cbc0] mb-1.5">
                    Special Request or Seating Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                    placeholder="E.g., high chair needed, cake arrangement, special flower setup, Mandi carpet seating preference..."
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-[#c5a869]/30 focus:border-[#dfb75a] rounded-xl text-sm text-[#f5f0e6] placeholder-stone-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-[#c5a869] via-[#dfb75a] to-[#c5a869] hover:opacity-95 text-[#070709] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
                >
                  {submitting ? 'Submitting Reservation...' : 'Submit Table Reservation (پیشگی بکنگ)'}
                </button>
                <p className="text-[11px] text-[#a8a396] mt-3">
                  No advance payment needed. Our manager will confirm your reservation promptly.
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
};
