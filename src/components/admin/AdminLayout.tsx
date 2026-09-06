import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Utensils,
  Layers,
  Calendar,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Star,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onReturnToSite: () => void;
  pendingReservationsCount: number;
  newEnquiriesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onReturnToSite,
  pendingReservationsCount,
  newEnquiriesCount,
  children,
}) => {
  const { admin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Dishes', icon: Utensils },
    { id: 'categories', label: 'Categories', icon: Layers },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: Calendar,
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined,
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: MessageSquare,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
    },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f0e6] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0e0e12] border-r border-[#c5a869]/20 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1f1e24] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#c5a869]/60 bg-[#15151b] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#c5a869]" />
          </div>
          <div>
            <h1 className="font-royal text-sm font-bold tracking-wider text-[#f5f0e6]">
              AL-TAJ HOTEL
            </h1>
            <span className="text-[10px] tracking-[0.2em] text-[#c5a869] uppercase font-sans font-medium block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#c5a869] text-[#0b0b0c] shadow-[0_0_15px_rgba(197,168,105,0.25)]'
                    : 'text-[#d0cbc0] hover:bg-[#181820] hover:text-[#faedd0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#0b0b0c] text-[#c5a869]'
                        : 'bg-[#c5a869] text-[#0b0b0c]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile & footer */}
        <div className="p-4 border-t border-[#1f1e24] space-y-2">
          <button
            onClick={onReturnToSite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-[#a8a396] hover:text-[#f5f0e6] hover:bg-[#181820] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a869]" />
              <span>Live Website</span>
            </div>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#070709]/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-[#0e0e12] border-r border-[#c5a869]/20 flex flex-col h-full z-10">
            <div className="p-5 border-b border-[#1f1e24] flex items-center justify-between">
              <div>
                <h2 className="font-royal text-sm font-bold text-[#f5f0e6]">AL-TAJ HOTEL</h2>
                <span className="text-[10px] tracking-widest text-[#c5a869] uppercase font-sans">CMS Portal</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#a8a396] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      isActive
                        ? 'bg-[#c5a869] text-[#0b0b0c]'
                        : 'text-[#d0cbc0] hover:bg-[#181820]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a869] text-[#0b0b0c]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#1f1e24] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReturnToSite();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#a8a396]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c5a869]" />
                <span>Live Website</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0c0c10] border-b border-[#c5a869]/20 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded text-[#a8a396] hover:text-[#f5f0e6] hover:bg-[#181820] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-wider text-[#a8a396] font-medium hidden sm:inline">
              Management Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-[#f5f0e6] block">
                {admin?.username || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#c5a869] uppercase tracking-wider">
                {admin?.role || 'Super Admin'}
              </span>
            </div>

            <button
              onClick={onReturnToSite}
              className="px-3 py-1.5 bg-[#17171e] hover:bg-[#202029] text-[#faedd0] border border-[#c5a869]/30 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3 text-[#c5a869]" />
              <span className="hidden sm:inline">View Site</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
