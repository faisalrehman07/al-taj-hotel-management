import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'banner';
  className?: string;
}

export const RestaurantStatusBadge: React.FC<Props> = ({ variant = 'compact', className = '' }) => {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    isClosingSoon: boolean;
    message: string;
    detail: string;
  }>({
    isOpen: true,
    isClosingSoon: false,
    message: 'Open Now',
    detail: 'Kitchen serving until 11:30 PM',
  });

  useEffect(() => {
    const checkStatus = () => {
      // Calculate current IST (UTC+5:30) time
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istOffset = 5.5 * 60 * 60000;
      const istDate = new Date(utcTime + istOffset);

      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const currentDecimal = hours + minutes / 60;

      // 11:30 AM = 11.5, 11:30 PM = 23.5
      const openTime = 11.5;
      const closeTime = 23.5;
      const lastOrdersTime = 22.75; // 10:45 PM

      if (currentDecimal >= openTime && currentDecimal < closeTime) {
        if (currentDecimal >= lastOrdersTime) {
          setStatus({
            isOpen: true,
            isClosingSoon: true,
            message: 'Last Orders',
            detail: 'Kitchen closes at 11:30 PM tonight',
          });
        } else {
          setStatus({
            isOpen: true,
            isClosingSoon: false,
            message: 'Open Now',
            detail: 'Hot Charcoal Tandoor & Dum Biryani active',
          });
        }
      } else {
        setStatus({
          isOpen: false,
          isClosingSoon: false,
          message: 'Currently Closed',
          detail: 'Opens today at 11:30 AM • Advance booking active',
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          status.isOpen
            ? status.isClosingSoon
              ? 'bg-amber-950/70 border-amber-600/50 text-amber-300'
              : 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300'
            : 'bg-stone-900/90 border-stone-700/60 text-stone-300'
        } ${className}`}
        title={`Al-Taj Hotel Hassan: ${status.detail}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            status.isOpen
              ? status.isClosingSoon
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400 animate-pulse'
              : 'bg-stone-500'
          }`}
        />
        <span>{status.message}</span>
        <span className="text-stone-400 text-[10px] hidden sm:inline">• 11:30 AM - 11:30 PM</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-md shadow-lg ${
        status.isOpen
          ? status.isClosingSoon
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
          : 'bg-[#131318]/90 border-[#c5a869]/30 text-[#d0cbc0]'
      } ${className}`}
    >
      <div
        className={`w-2.5 h-2.5 rounded-full ${
          status.isOpen
            ? status.isClosingSoon
              ? 'bg-amber-400 animate-ping'
              : 'bg-emerald-400 animate-pulse'
            : 'bg-stone-500'
        }`}
      />
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider">
            {status.message}
          </span>
          <span className="text-[10px] opacity-75 font-mono">11:30 AM – 11:30 PM</span>
        </div>
        <p className="text-[11px] opacity-80 leading-none mt-0.5 font-sans">
          {status.detail}
        </p>
      </div>
    </div>
  );
};
