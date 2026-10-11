export interface MenuCategory {
  _id: string;
  name: string;
  urduName?: string;
  description?: string;
  image?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  urduName?: string;
  slug: string;
  description?: string;
  price?: number | null;
  image?: string;
  dietaryType?: 'non-veg' | 'veg' | 'egg';
  spiceLevel?: 'mild' | 'medium' | 'spicy';
  bestseller?: boolean;
  available: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type DiningPreference = 'General Seating' | 'Family Room' | 'Events & Celebrations' | 'Mandi';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  _id: string;
  reservationId: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  diningPreference?: DiningPreference | string;
  occasion?: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
}

export type EnquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  urduTitle?: string;
  category: 'restaurant' | 'food' | 'ambiance' | 'events';
  imageUrl: string;
  caption?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerReview {
  _id: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewText: string;
  diningPreference?: string;
  dishLoved?: string;
  verifiedDining?: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export interface WebsiteSettings {
  _id?: string;
  restaurantName: string;
  tagline: string;
  urduTagline?: string;
  heroSubtitle?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  fullAddress?: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  mapsUrl?: string;
  mapsEmbedUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  aboutTitle?: string;
  aboutSummary?: string;
  aboutHighlights?: string[];
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}
