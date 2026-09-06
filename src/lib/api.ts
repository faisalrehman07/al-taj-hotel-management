import { MenuCategory, MenuItem, Reservation, Enquiry, GalleryImage, WebsiteSettings, AdminUser, CustomerReview, ReviewStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('altaj_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCategories(): Promise<MenuCategory[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  const json = await res.json();
  return json.data || [];
}

export async function fetchMenuItems(params?: { categoryId?: string; featured?: boolean; search?: string }): Promise<MenuItem[]> {
  const query = new URLSearchParams();
  if (params?.categoryId && params.categoryId !== 'all') query.append('categoryId', params.categoryId);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/menu?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load menu items');
  const json = await res.json();
  return json.data || [];
}

export async function fetchSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to load website settings');
  const json = await res.json();
  return json.data;
}

export async function fetchGallery(category?: string): Promise<GalleryImage[]> {
  const url = category && category !== 'all' ? `${API_BASE}/gallery?category=${encodeURIComponent(category)}` : `${API_BASE}/gallery`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load gallery');
  const json = await res.json();
  return json.data || [];
}

export async function fetchReviews(): Promise<{ reviews: CustomerReview[]; stats: ReviewStats }> {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Failed to load customer reviews');
  const json = await res.json();
  return { reviews: json.data || [], stats: json.stats || { averageRating: 5, totalReviews: 0, ratingDistribution: {} } };
}

export async function submitReview(data: {
  customerName: string;
  rating: number;
  reviewText: string;
  diningPreference?: string;
  dishLoved?: string;
}): Promise<CustomerReview> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to submit review');
  }
  return json.data;
}

export async function submitReservation(data: {
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  diningPreference?: string;
  occasion?: string;
  specialRequest?: string;
}): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to submit reservation');
  }
  return json.data;
}

export async function submitEnquiry(data: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to submit enquiry');
  }
  return json.data;
}

// ADMIN API METHODS
export async function adminLogin(credentials: { username: string; password: string }): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Invalid credentials');
  }
  return { token: json.token, user: json.user };
}

export async function adminVerifySession(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.user : null;
  } catch {
    return null;
  }
}

export async function adminLogout(): Promise<void> {
  localStorage.removeItem('altaj_admin_token');
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch {}
}

export async function adminCreateMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`${API_BASE}/admin/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create menu item');
  return json.data;
}

export async function adminUpdateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update menu item');
  return json.data;
}

export async function adminDeleteMenuItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete menu item');
}

export async function adminCreateCategory(cat: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(cat),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create category');
  return json.data;
}

export async function adminUpdateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update category');
  return json.data;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete category');
}

export async function adminFetchReservations(params?: { status?: string; date?: string; search?: string }): Promise<Reservation[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.date) query.append('date', params.date);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/admin/reservations?${query.toString()}`, {
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load reservations');
  return json.data || [];
}

export async function adminUpdateReservationStatus(id: string, status: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/admin/reservations/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update reservation');
  return json.data;
}

export async function adminDeleteReservation(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/reservations/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete reservation');
}

export async function adminFetchEnquiries(status?: string): Promise<Enquiry[]> {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`${API_BASE}/admin/enquiries${query}`, {
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load enquiries');
  return json.data || [];
}

export async function adminUpdateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update enquiry');
  return json.data;
}

export async function adminDeleteEnquiry(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete enquiry');
}

export async function adminCreateGalleryImage(item: Partial<GalleryImage>): Promise<GalleryImage> {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to add gallery image');
  return json.data;
}

export async function adminDeleteGalleryImage(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete gallery image');
}

export async function adminUpdateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(settings),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update settings');
  return json.data;
}

export async function adminFetchReviews(status?: string): Promise<{ reviews: CustomerReview[]; stats: ReviewStats }> {
  const url = status && status !== 'all' ? `${API_BASE}/admin/reviews?status=${encodeURIComponent(status)}` : `${API_BASE}/admin/reviews`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch admin reviews');
  return { reviews: json.data || [], stats: json.stats || { averageRating: 5, totalReviews: 0, ratingDistribution: {} } };
}

export async function adminUpdateReviewStatus(id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED'): Promise<CustomerReview> {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update review status');
  return json.data;
}

export async function adminDeleteReview(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete review');
}

export async function getMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const [categories, items] = await Promise.all([
    fetchCategories(),
    fetchMenuItems(),
  ]);
  return { categories, items };
}

export async function getGallery(category?: string): Promise<GalleryImage[]> {
  return fetchGallery(category);
}

export async function getSettings(): Promise<WebsiteSettings> {
  return fetchSettings();
}

export async function getAdminReservations(params?: { status?: string; date?: string; search?: string }): Promise<Reservation[]> {
  return adminFetchReservations(params);
}

export async function getAdminEnquiries(status?: string): Promise<Enquiry[]> {
  return adminFetchEnquiries(status);
}

export async function adminUploadImage(image: string | File): Promise<{ url: string }> {
  let bodyData: any = {};
  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      bodyData = { imageUrl: image };
    } else {
      bodyData = { image };
    }
  } else if (image instanceof File) {
    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
    bodyData = { image: base64 };
  }

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(bodyData),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Image upload failed');
  return { url: json.url };
}
