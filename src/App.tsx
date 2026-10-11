import React, { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { OpeningExperience } from './components/OpeningExperience';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { FeaturedDishes } from './components/FeaturedDishes';
import { MenuSection } from './components/MenuSection';
import { BookingSection } from './components/BookingSection';
import { GallerySection } from './components/GallerySection';
import { EnquirySection } from './components/EnquirySection';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { MobileFloatingBar } from './components/MobileFloatingBar';
import { DiningPreferencesSection } from './components/DiningPreferencesSection';
import { ReviewSection } from './components/ReviewSection';
import { TakeawayCartModal } from './components/TakeawayCartModal';

// Admin CMS Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMenu } from './components/admin/AdminMenu';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminReservations } from './components/admin/AdminReservations';
import { AdminEnquiries } from './components/admin/AdminEnquiries';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminReviews } from './components/admin/AdminReviews';

import {
  getMenu,
  getGallery,
  getSettings,
  getAdminReservations,
  getAdminEnquiries,
  adminUpdateReservationStatus,
} from './lib/api';
import { MenuItem, MenuCategory, GalleryImage, WebsiteSettings, Reservation, Enquiry, CartItem, DiningPreference } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const MainApplication: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  // View state: 'public' | 'admin'
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('admin') || window.location.pathname.startsWith('/admin')
        ? 'admin'
        : 'public';
    }
    return 'public';
  });

  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Public & shared data state
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | undefined>(undefined);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Admin specific lists
  const [adminReservations, setAdminReservations] = useState<Reservation[]>([]);
  const [adminEnquiries, setAdminEnquiries] = useState<Enquiry[]>([]);

  // Cart & Takeaway Parcel State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('altaj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [initialBookingPreference, setInitialBookingPreference] = useState<DiningPreference | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem('altaj_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const handleAddToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const itemId = item._id || (item as any).id;
      const existing = prev.find((c) => (c.item._id || (c.item as any).id) === itemId);
      if (existing) {
        return prev.map((c) =>
          (c.item._id || (c.item as any).id) === itemId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if ((c.item._id || (c.item as any).id) === itemId) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCartItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  // Hash change detection
  useEffect(() => {
    const handleHashOrPop = () => {
      if (window.location.hash.includes('admin') || window.location.pathname.startsWith('/admin')) {
        setViewMode('admin');
      } else {
        setViewMode('public');
      }
    };
    window.addEventListener('hashchange', handleHashOrPop);
    window.addEventListener('popstate', handleHashOrPop);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPop);
      window.removeEventListener('popstate', handleHashOrPop);
    };
  }, []);

  // Fetch Public Data
  const loadPublicData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [menuData, galleryData, settingsData] = await Promise.all([
        getMenu(),
        getGallery(),
        getSettings(),
      ]);

      setCategories(menuData.categories || []);
      setMenuItems(menuData.items || []);
      setGallery(galleryData || []);
      setSettings(settingsData);
    } catch (err: any) {
      console.error('Failed to load AL-TAJ data:', err);
      setDataError(err.message || 'Unable to load restaurant information. Please try again.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Fetch Admin Data
  const loadAdminData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [resList, enqList] = await Promise.all([
        getAdminReservations(),
        getAdminEnquiries(),
      ]);
      setAdminReservations(resList || []);
      setAdminEnquiries(enqList || []);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    if (isAuthenticated && viewMode === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, viewMode, loadAdminData]);

  // Section navigation helper
  const scrollToSection = (sectionId: string) => {
    if (viewMode === 'admin') {
      setViewMode('public');
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await adminUpdateReservationStatus(id, status);
      await loadAdminData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Safe fallback if data fetch error occurred (Section 29 - Never blank black screen)
  if (dataError && !categories.length && !settings) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-[#f5f0e6] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-[#141418] border border-[#c5a869]/30 rounded-2xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-700/50 flex items-center justify-center mx-auto mb-4 text-red-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-royal text-xl font-bold text-[#f5f0e6] mb-2">
            Unable to Connect to AL-TAJ Database
          </h2>
          <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
            {dataError}
          </p>
          <button
            onClick={() => loadPublicData()}
            className="px-6 py-3 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= ADMIN VIEW =================
  if (viewMode === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#070709] flex items-center justify-center text-[#c5a869]">
          <div className="w-8 h-8 border-2 border-[#c5a869] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLogin
          onBackToSite={() => {
            setViewMode('public');
            window.location.hash = '';
          }}
        />
      );
    }

    const pendingCount = adminReservations.filter((r) => r.status === 'PENDING').length;
    const newEnquiriesCount = adminEnquiries.filter((e) => e.status === 'NEW').length;

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onReturnToSite={() => {
          setViewMode('public');
          window.location.hash = '';
        }}
        pendingReservationsCount={pendingCount}
        newEnquiriesCount={newEnquiriesCount}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            menuItems={menuItems}
            categories={categories}
            reservations={adminReservations}
            enquiries={adminEnquiries}
            gallery={gallery}
            onNavigateTab={setAdminTab}
            onUpdateReservationStatus={handleAdminUpdateStatus}
          />
        )}

        {adminTab === 'menu' && (
          <AdminMenu
            menuItems={menuItems}
            categories={categories}
            onRefresh={() => {
              loadPublicData();
            }}
          />
        )}

        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onRefresh={() => {
              loadPublicData();
            }}
          />
        )}

        {adminTab === 'reservations' && (
          <AdminReservations
            reservations={adminReservations}
            onRefresh={() => {
              loadAdminData();
            }}
          />
        )}

        {adminTab === 'enquiries' && (
          <AdminEnquiries
            enquiries={adminEnquiries}
            onRefresh={() => {
              loadAdminData();
            }}
          />
        )}

        {adminTab === 'reviews' && (
          <AdminReviews />
        )}

        {adminTab === 'gallery' && (
          <AdminGallery
            images={gallery}
            onRefresh={() => {
              loadPublicData();
            }}
          />
        )}

        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings || {
              restaurantName: 'AL-TAJ HOTEL',
              tagline: 'Aapki Khidmat, Hamara Fakhr',
              phone: '+91 94801 23456',
              whatsapp: '9620532473',
              email: 'altajhotelhassan@gmail.com',
              address: '234V+5GH, Ameer Mohalla',
              city: 'Hassan',
              state: 'Karnataka',
              openingHours: '11:30 AM – 11:30 PM (Daily)',
            }}
            onRefresh={() => {
              loadPublicData();
            }}
          />
        )}
      </AdminLayout>
    );
  }

  // ================= PUBLIC WEBSITE VIEW =================
  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f0e6] font-sans antialiased selection:bg-[#dfb75a] selection:text-[#070709]">
      {/* Royal Opening Experience */}
      <OpeningExperience onNavigate={scrollToSection} />

      {/* Luxury Sticky Navbar */}
      <Navbar
        settings={settings}
        onNavigate={scrollToSection}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.location.hash = '#/admin';
        }}
      />

      {/* Main Sections */}
      <main>
        {/* Cinematic Hero */}
        <Hero
          settings={settings}
          onNavigate={scrollToSection}
        />

        {/* Authentic About Section */}
        <AboutSection settings={settings} />

        {/* Featured Delicacies */}
        <FeaturedDishes
          items={menuItems}
          categories={categories}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onViewFullMenu={() => scrollToSection('menu')}
        />

        {/* Dastarkhwan-E-Al Taj (Main Digital Menu) */}
        <MenuSection
          items={menuItems}
          categories={categories}
          loading={dataLoading}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onOpenCart={() => setIsCartOpen(true)}
          onBookTable={() => scrollToSection('booking')}
          whatsappNumber={settings?.whatsapp}
        />

        {/* Mahāfil Gallery */}
        <GallerySection
          images={gallery}
          loading={dataLoading}
        />

        {/* Tailored Dining Preferences (General, Family Room, Events, Mandi) */}
        <DiningPreferencesSection
          onReserveSpace={(space) => {
            setInitialBookingPreference(space as DiningPreference);
            scrollToSection('booking');
          }}
        />

        {/* Guest Reviews & Star Ratings */}
        <ReviewSection />

        {/* Table Reservation Engine */}
        <BookingSection
          settings={settings}
          initialPreference={initialBookingPreference}
        />

        {/* Guest Assistance & Enquiry */}
        <EnquirySection />

        {/* Location & Direct Contact */}
        <LocationContact
          settings={settings}
          onBookTable={() => scrollToSection('booking')}
        />
      </main>

      {/* Luxury Footer */}
      <Footer
        settings={settings}
        onNavigate={scrollToSection}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.location.hash = '#/admin';
        }}
      />

      {/* Mobile Floating Bar */}
      <MobileFloatingBar
        settings={settings}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onBookTable={() => scrollToSection('booking')}
      />

      {/* Dastarkhwan Takeaway / Parcel Cart Modal */}
      <TakeawayCartModal
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        whatsappNumber={settings?.whatsapp}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <MainApplication />
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}
