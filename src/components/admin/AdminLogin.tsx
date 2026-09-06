import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, User, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

interface Props {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onBackToSite }) => {
  const { login, error, clearError } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!username.trim() || !password) return;

    setLoading(true);
    try {
      await login(username.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,168,105,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Back link */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#a8a396] hover:text-[#c5a869] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Restaurant</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#121215] border border-[#c5a869]/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full border border-[#c5a869]/60 bg-[#17171d] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(197,168,105,0.2)]">
              <Shield className="w-7 h-7 text-[#c5a869]" />
            </div>
            <h1 className="font-royal text-2xl font-bold tracking-[0.12em] text-[#f5f0e6]">
              AL-TAJ HOTEL
            </h1>
            <p className="text-[11px] tracking-[0.2em] text-[#c5a869] uppercase font-sans font-medium mt-1">
              Management Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-950/70 border border-red-800/60 text-red-200 text-xs leading-relaxed animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#d0cbc0] mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a869]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181e] border border-[#c5a869]/25 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] placeholder-[#66625a] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#d0cbc0] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a869]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#18181e] border border-[#c5a869]/25 focus:border-[#c5a869] rounded-lg text-sm text-[#f5f0e6] placeholder-[#66625a] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c887f] hover:text-[#f5f0e6] focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#c5a869] to-[#d4af37] hover:from-[#d4af37] hover:to-[#dfb75a] text-[#0b0b0c] font-bold text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0b0b0c] border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Access CMS</span>
                )}
              </button>
            </div>
          </form>

          {/* Information badge */}
          <div className="mt-8 pt-6 border-t border-[#1f1e24] text-center">
            <p className="text-[11px] text-[#7d7970] leading-relaxed">
              Default administrator credential is provided in system setup instructions. Authorized personnel only.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
