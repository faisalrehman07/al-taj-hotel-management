import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_SETTINGS, INITIAL_GALLERY, INITIAL_REVIEWS } from './seed';
import { hashPassword } from './auth';

// Storage file fallback when MongoDB is not connected
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'altaj_store.json');

export interface ReviewItem {
  id: string;
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

export interface DBState {
  users: Array<{ id: string; username: string; email: string; passwordHash: string; role: string; createdAt: string }>;
  categories: Array<{ id: string; name: string; urduName?: string; description?: string; image?: string; displayOrder: number; active: boolean; createdAt: string; updatedAt?: string }>;
  menuItems: Array<{
    id: string;
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
    createdAt: string;
    updatedAt?: string;
  }>;
  reservations: Array<{
    id: string;
    reservationId: string;
    customerName: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    diningPreference?: string;
    occasion?: string;
    specialRequest?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
    updatedAt?: string;
  }>;
  enquiries: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
    createdAt: string;
    updatedAt?: string;
  }>;
  gallery: Array<{
    id: string;
    title: string;
    urduTitle?: string;
    category: 'restaurant' | 'food' | 'ambiance' | 'events';
    imageUrl: string;
    caption?: string;
    featured: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt?: string;
  }>;
  reviews: ReviewItem[];
  settings: typeof INITIAL_SETTINGS & { id: string; updatedAt?: string };
}

let isMongoConnected = false;
let memoryStore: DBState | null = null;

function ensureDataFile(): DBState {
  if (memoryStore) return memoryStore;

  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create data dir:', e);
    }
  }

  let state: DBState | null = null;

  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      state = JSON.parse(data);
    } catch (err) {
      console.error('Error reading store file, will reinitialize:', err);
    }
  }

  const now = new Date().toISOString();

  if (!state) {
    state = {
      users: [],
      categories: INITIAL_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        urduName: c.urduName,
        description: c.description,
        displayOrder: c.displayOrder,
        active: true,
        createdAt: now,
      })),
      menuItems: INITIAL_MENU_ITEMS.map((item, idx) => ({
        id: `item_${item.categoryId.replace('cat_', '')}_${idx + 1}`,
        categoryId: item.categoryId,
        name: item.name,
        urduName: item.urduName,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: item.description,
        price: item.price,
        image: item.image,
        dietaryType: item.dietaryType,
        spiceLevel: item.spiceLevel,
        bestseller: item.bestseller ?? false,
        available: true,
        featured: !!item.featured,
        displayOrder: item.displayOrder,
        createdAt: now,
      })),
      reservations: [],
      enquiries: [],
      gallery: INITIAL_GALLERY.map((g, idx) => ({
        id: `gal_${idx + 1}`,
        title: g.title,
        urduTitle: g.urduTitle,
        category: g.category as any,
        imageUrl: g.imageUrl,
        caption: g.caption,
        featured: g.featured,
        displayOrder: g.displayOrder,
        createdAt: now,
      })),
      reviews: [...INITIAL_REVIEWS],
      settings: {
        id: 'settings_default',
        ...INITIAL_SETTINGS,
        updatedAt: now,
      }
    };
  } else {
    // Check and hydrate missing fields to ensure fresh requirements are satisfied
    let needsSave = false;

    if (!state.reviews || state.reviews.length === 0) {
      state.reviews = [...INITIAL_REVIEWS];
      needsSave = true;
    }

    // Ensure settings have the exact required address, phone, whatsapp, tagline
    if (state.settings.tagline !== 'Aapki Khidmat, Hamara Fakhr' || state.settings.whatsapp !== '9620532473') {
      state.settings = {
        ...state.settings,
        tagline: 'Aapki Khidmat, Hamara Fakhr',
        urduTagline: 'آپ کی خدمت، ہمارا فخر',
        address: '234V+5GH, Ameer Mohalla',
        landmark: 'Ameer Mohalla',
        city: 'Hassan',
        state: 'Karnataka',
        country: 'India',
        postalCode: '573201',
        fullAddress: '234V+5GH, Ameer Mohalla, Hassan, Karnataka 573201, India',
        phone: '+91 94801 23456', // Never change phone number
        whatsapp: '9620532473',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=234V%2B5GH%2C+Ameer+Mohalla%2C+Hassan%2C+Karnataka+573201%2C+India',
        mapsEmbedUrl: 'https://maps.google.com/maps?q=234V%2B5GH%2C+Ameer+Mohalla%2C+Hassan%2C+Karnataka+573201%2C+India&t=&z=16&ie=UTF8&iwloc=&output=embed',
        instagramUrl: state.settings.instagramUrl || 'https://instagram.com/altajhotel',
        updatedAt: now
      };
      needsSave = true;
    }

    // Hydrate any empty menu items with curated photo & descriptions
    if (state.menuItems && state.menuItems.length > 0 && !state.menuItems[0].image) {
      state.menuItems = INITIAL_MENU_ITEMS.map((item, idx) => ({
        id: state?.menuItems[idx]?.id || `item_${item.categoryId.replace('cat_', '')}_${idx + 1}`,
        categoryId: item.categoryId,
        name: item.name,
        urduName: item.urduName,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: item.description,
        price: item.price,
        image: item.image,
        dietaryType: item.dietaryType,
        spiceLevel: item.spiceLevel,
        bestseller: item.bestseller ?? false,
        available: true,
        featured: !!item.featured,
        displayOrder: item.displayOrder,
        createdAt: now,
      }));
      needsSave = true;
    }

    // Hydrate categories with Urdu names if missing
    if (state.categories && (!state.categories[0].urduName)) {
      state.categories = INITIAL_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        urduName: c.urduName,
        description: c.description,
        displayOrder: c.displayOrder,
        active: true,
        createdAt: now,
      }));
      needsSave = true;
    }

    // Hydrate gallery with Urdu titles if missing
    if (state.gallery && (!state.gallery[0].urduTitle)) {
      state.gallery = INITIAL_GALLERY.map((g, idx) => ({
        id: `gal_${idx + 1}`,
        title: g.title,
        urduTitle: g.urduTitle,
        category: g.category as any,
        imageUrl: g.imageUrl,
        caption: g.caption,
        featured: g.featured,
        displayOrder: g.displayOrder,
        createdAt: now,
      }));
      needsSave = true;
    }

    if (needsSave) {
      saveStore(state);
    }
  }

  memoryStore = state;
  return state;
}

function saveStore(state: DBState) {
  memoryStore = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to file system (operating in memory):', err);
  }
}

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      isMongoConnected = true;
      console.log('Successfully connected to MongoDB Atlas');
    } catch (err) {
      console.warn('MongoDB connection failed. Falling back to local storage engine:', (err as Error).message);
      isMongoConnected = false;
    }
  } else {
    console.log('No MONGODB_URI configured. Running with resilient local storage engine.');
  }

  // Ensure store exists & seed admin user
  const store = ensureDataFile();
  if (store.users.length === 0) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'AlTaj@Admin2026';
    const passwordHash = await hashPassword(defaultPassword);
    store.users.push({
      id: 'usr_admin_1',
      username: process.env.ADMIN_USERNAME || 'admin',
      email: 'admin@altajhotel.com',
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    saveStore(store);
    console.log('Seeded default admin credentials (Username: admin)');
  }
}

// Data Access API
export const db = {
  // Categories
  getCategories: async () => {
    const store = ensureDataFile();
    return [...store.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getCategoryById: async (id: string) => {
    const store = ensureDataFile();
    return store.categories.find(c => c.id === id) || null;
  },
  createCategory: async (data: { name: string; urduName?: string; description?: string; image?: string; displayOrder?: number; active?: boolean }) => {
    const store = ensureDataFile();
    const newCategory = {
      id: `cat_${Date.now()}`,
      name: data.name,
      urduName: data.urduName || '',
      description: data.description || '',
      image: data.image || '',
      displayOrder: data.displayOrder ?? (store.categories.length + 1),
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
    };
    store.categories.push(newCategory);
    saveStore(store);
    return newCategory;
  },
  updateCategory: async (id: string, updates: Partial<{ name: string; urduName: string; description: string; image: string; displayOrder: number; active: boolean }>) => {
    const store = ensureDataFile();
    const idx = store.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    store.categories[idx] = {
      ...store.categories[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStore(store);
    return store.categories[idx];
  },
  deleteCategory: async (id: string) => {
    const store = ensureDataFile();
    const idx = store.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    store.categories.splice(idx, 1);
    store.menuItems = store.menuItems.filter(item => item.categoryId !== id);
    saveStore(store);
    return true;
  },

  // Menu Items
  getMenuItems: async (filter?: { categoryId?: string; featured?: boolean; available?: boolean; search?: string }) => {
    const store = ensureDataFile();
    let items = [...store.menuItems];
    if (filter?.categoryId) {
      items = items.filter(i => i.categoryId === filter.categoryId);
    }
    if (filter?.featured !== undefined) {
      items = items.filter(i => i.featured === filter.featured);
    }
    if (filter?.available !== undefined) {
      items = items.filter(i => i.available === filter.available);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.urduName && i.urduName.includes(q))
      );
    }
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getMenuItemById: async (id: string) => {
    const store = ensureDataFile();
    return store.menuItems.find(i => i.id === id) || null;
  },
  createMenuItem: async (data: {
    categoryId: string;
    name: string;
    urduName?: string;
    description?: string;
    price?: number | null;
    image?: string;
    dietaryType?: 'non-veg' | 'veg' | 'egg';
    spiceLevel?: 'mild' | 'medium' | 'spicy';
    bestseller?: boolean;
    available?: boolean;
    featured?: boolean;
    displayOrder?: number;
  }) => {
    const store = ensureDataFile();
    const newItem = {
      id: `item_${Date.now()}`,
      categoryId: data.categoryId,
      name: data.name,
      urduName: data.urduName || '',
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: data.description || '',
      price: data.price !== undefined ? data.price : null,
      image: data.image || '',
      dietaryType: data.dietaryType || 'non-veg',
      spiceLevel: data.spiceLevel || 'medium',
      bestseller: data.bestseller ?? false,
      available: data.available ?? true,
      featured: data.featured ?? false,
      displayOrder: data.displayOrder ?? (store.menuItems.length + 1),
      createdAt: new Date().toISOString(),
    };
    store.menuItems.push(newItem);
    saveStore(store);
    return newItem;
  },
  updateMenuItem: async (id: string, updates: Partial<{
    categoryId: string;
    name: string;
    urduName: string;
    description: string;
    price: number | null;
    image: string;
    dietaryType: 'non-veg' | 'veg' | 'egg';
    spiceLevel: 'mild' | 'medium' | 'spicy';
    bestseller: boolean;
    available: boolean;
    featured: boolean;
    displayOrder: number;
  }>) => {
    const store = ensureDataFile();
    const idx = store.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return null;
    store.menuItems[idx] = {
      ...store.menuItems[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStore(store);
    return store.menuItems[idx];
  },
  deleteMenuItem: async (id: string) => {
    const store = ensureDataFile();
    const idx = store.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return false;
    store.menuItems.splice(idx, 1);
    saveStore(store);
    return true;
  },

  // Reservations
  getReservations: async (filter?: { status?: string; date?: string; search?: string }) => {
    const store = ensureDataFile();
    let list = [...store.reservations];
    if (filter?.status) {
      list = list.filter(r => r.status === filter.status);
    }
    if (filter?.date) {
      list = list.filter(r => r.date === filter.date);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(r =>
        r.customerName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.reservationId.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createReservation: async (data: {
    customerName: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    diningPreference?: string;
    occasion?: string;
    specialRequest?: string;
  }) => {
    const store = ensureDataFile();
    const reservationId = `TAJ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReservation = {
      id: `res_${Date.now()}`,
      reservationId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      guests: Number(data.guests) || 2,
      diningPreference: data.diningPreference || 'General Seating',
      occasion: data.occasion || data.diningPreference || 'Dining',
      specialRequest: data.specialRequest || '',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };
    store.reservations.push(newReservation);
    saveStore(store);
    return newReservation;
  },
  updateReservationStatus: async (id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    const store = ensureDataFile();
    const idx = store.reservations.findIndex(r => r.id === id || r.reservationId === id);
    if (idx === -1) return null;
    store.reservations[idx].status = status;
    store.reservations[idx].updatedAt = new Date().toISOString();
    saveStore(store);
    return store.reservations[idx];
  },
  deleteReservation: async (id: string) => {
    const store = ensureDataFile();
    const idx = store.reservations.findIndex(r => r.id === id || r.reservationId === id);
    if (idx === -1) return false;
    store.reservations.splice(idx, 1);
    saveStore(store);
    return true;
  },

  // Enquiries
  getEnquiries: async (filter?: { status?: string }) => {
    const store = ensureDataFile();
    let list = [...store.enquiries];
    if (filter?.status) {
      list = list.filter(e => e.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createEnquiry: async (data: { name: string; phone: string; email: string; subject: string; message: string }) => {
    const store = ensureDataFile();
    const newEnquiry = {
      id: `enq_${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'NEW' as const,
      createdAt: new Date().toISOString(),
    };
    store.enquiries.push(newEnquiry);
    saveStore(store);
    return newEnquiry;
  },
  updateEnquiryStatus: async (id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    const store = ensureDataFile();
    const idx = store.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    store.enquiries[idx].status = status;
    store.enquiries[idx].updatedAt = new Date().toISOString();
    saveStore(store);
    return store.enquiries[idx];
  },
  deleteEnquiry: async (id: string) => {
    const store = ensureDataFile();
    const idx = store.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    store.enquiries.splice(idx, 1);
    saveStore(store);
    return true;
  },

  // Gallery (Mahāfil)
  getGallery: async (category?: string) => {
    const store = ensureDataFile();
    let list = [...store.gallery];
    if (category && category !== 'all') {
      list = list.filter(g => g.category === category);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },
  createGalleryImage: async (data: {
    title: string;
    urduTitle?: string;
    category: 'restaurant' | 'food' | 'ambiance' | 'events';
    imageUrl: string;
    caption?: string;
    featured?: boolean;
    displayOrder?: number;
  }) => {
    const store = ensureDataFile();
    const newImg = {
      id: `gal_${Date.now()}`,
      title: data.title,
      urduTitle: data.urduTitle || '',
      category: data.category,
      imageUrl: data.imageUrl,
      caption: data.caption || '',
      featured: data.featured ?? false,
      displayOrder: data.displayOrder ?? (store.gallery.length + 1),
      createdAt: new Date().toISOString(),
    };
    store.gallery.push(newImg);
    saveStore(store);
    return newImg;
  },
  updateGalleryImage: async (id: string, updates: Partial<{
    title: string;
    urduTitle: string;
    category: 'restaurant' | 'food' | 'ambiance' | 'events';
    imageUrl: string;
    caption: string;
    featured: boolean;
    displayOrder: number;
  }>) => {
    const store = ensureDataFile();
    const idx = store.gallery.findIndex(g => g.id === id);
    if (idx === -1) return null;
    store.gallery[idx] = {
      ...store.gallery[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStore(store);
    return store.gallery[idx];
  },
  deleteGalleryImage: async (id: string) => {
    const store = ensureDataFile();
    const idx = store.gallery.findIndex(g => g.id === id);
    if (idx === -1) return false;
    store.gallery.splice(idx, 1);
    saveStore(store);
    return true;
  },

  // Reviews & Ratings
  getReviews: async (filter?: { status?: string }) => {
    const store = ensureDataFile();
    let list = [...(store.reviews || [])];
    if (filter?.status) {
      list = list.filter(r => r.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createReview: async (data: {
    customerName: string;
    rating: number;
    reviewText: string;
    diningPreference?: string;
    dishLoved?: string;
  }) => {
    const store = ensureDataFile();
    if (!store.reviews) store.reviews = [];
    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      customerName: data.customerName.trim(),
      rating: Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5))),
      reviewText: data.reviewText.trim(),
      diningPreference: data.diningPreference?.trim(),
      dishLoved: data.dishLoved?.trim(),
      verifiedDining: true,
      status: 'APPROVED', // Default to approved or pending
      createdAt: new Date().toISOString()
    };
    store.reviews.push(newReview);
    saveStore(store);
    return newReview;
  },
  updateReviewStatus: async (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    const store = ensureDataFile();
    if (!store.reviews) store.reviews = [];
    const idx = store.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    store.reviews[idx].status = status;
    store.reviews[idx].updatedAt = new Date().toISOString();
    saveStore(store);
    return store.reviews[idx];
  },
  deleteReview: async (id: string) => {
    const store = ensureDataFile();
    if (!store.reviews) store.reviews = [];
    const idx = store.reviews.findIndex(r => r.id === id);
    if (idx === -1) return false;
    store.reviews.splice(idx, 1);
    saveStore(store);
    return true;
  },
  getReviewStats: async () => {
    const store = ensureDataFile();
    const approved = (store.reviews || []).filter(r => r.status === 'APPROVED');
    const count = approved.length;
    if (count === 0) {
      return { averageRating: 5.0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = approved.reduce((acc, curr) => acc + curr.rating, 0);
    const average = Number((sum / count).toFixed(1));
    const distribution: { [k: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approved.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return {
      averageRating: average,
      totalReviews: count,
      ratingDistribution: distribution
    };
  },

  // Settings
  getSettings: async () => {
    const store = ensureDataFile();
    return store.settings;
  },
  updateSettings: async (updates: Partial<typeof INITIAL_SETTINGS>) => {
    const store = ensureDataFile();
    store.settings = {
      ...store.settings,
      ...updates,
      phone: '+91 94801 23456', // Lock the phone number as per mandate
      updatedAt: new Date().toISOString()
    };
    saveStore(store);
    return store.settings;
  },

  // Users / Auth
  findUserByUsername: async (username: string) => {
    const store = ensureDataFile();
    return store.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
  },
  findUserById: async (id: string) => {
    const store = ensureDataFile();
    return store.users.find(u => u.id === id) || null;
  },
  updateUserPassword: async (id: string, newHash: string) => {
    const store = ensureDataFile();
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    store.users[idx].passwordHash = newHash;
    saveStore(store);
    return true;
  }
};
