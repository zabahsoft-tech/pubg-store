
import { User, Product, ProductCategory, OrderProduct, Wallet, WalletTransaction, BlogPost, Page, Coupon, LoginCredentials, RegisterData, AuthResponse } from '../types';

/**
 * API CONFIGURATION
 */
export const API_BASE_URL = 'https://dashboard.rahatpay.com/api';
export const STORAGE_BASE_URL = 'https://dashboard.rahatpay.com/storage';

export const getStorageUrl = (path: string | null | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http') || path.startsWith('https')) return path;
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${STORAGE_BASE_URL}/${cleanPath}`;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Enable cookie-based session auth
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle Unauthenticated
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        // We do not auto-redirect here to avoid loops, purely clear state
    }

    throw new Error(errorData.message || `API Request Failed: ${response.status}`);
  }

  // Handle Laravel Resource wrappers if present, otherwise return json
  const json = await response.json();
  return json;
}

export const api = {

  // --- Auth ---
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      // Assuming Laravel Sanctum /login endpoint returning { token, user }
      const response = await apiRequest<any>('/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
      });
      return response.data || response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await apiRequest<any>('/register', {
          method: 'POST',
          body: JSON.stringify(data)
      });
      return response.data || response;
  },

  logout: async (): Promise<void> => {
      return apiRequest('/logout', { method: 'POST' });
  },

  // --- User ---
  getUser: async (): Promise<User> => {
    const response = await apiRequest<any>('/user');
    return response.data || response;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiRequest<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response;
  },

  verifyEmail: async (): Promise<void> => {
    return apiRequest('/email/verify', { method: 'POST' });
  },

  // --- Wallet ---
  getWallet: async (): Promise<Wallet> => {
    const response = await apiRequest<any>('/wallet');
    return response.data || response;
  },

  getWalletTransactions: async (): Promise<WalletTransaction[]> => {
    const response = await apiRequest<any>('/wallet/transactions');
    return response.data || response;
  },

  creditWallet: async (amount: number, pm_type: string = 'stripe'): Promise<{ wallet: Wallet, transaction: WalletTransaction }> => {
     const response = await apiRequest<any>('/wallet/credit', {
        method: 'POST',
        body: JSON.stringify({ amount, pm_type })
     });
     return response.data || response;
  },

  debitWallet: async (amount: number, pm_type: string = 'order'): Promise<{ wallet: Wallet, transaction: WalletTransaction }> => {
     const response = await apiRequest<any>('/wallet/debit', {
        method: 'POST',
        body: JSON.stringify({ amount, pm_type })
     });
     return response.data || response;
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const response = await apiRequest<any>('/products');
    return response.data || response;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiRequest<any>('/products/featured');
    return response.data || response;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await apiRequest<any>(`/products/${slug}`);
    return response.data || response;
  },

  // --- Categories ---
  getCategories: async (): Promise<ProductCategory[]> => {
    const response = await apiRequest<any>('/product-categories');
    return response.data || response;
  },

  getCategoryProducts: async (slug: string): Promise<Product[]> => {
    const response = await apiRequest<any>(`/product-categories/${slug}/products`);
    return response.data || response;
  },

  // --- Orders ---
  getOrderProducts: async (): Promise<OrderProduct[]> => {
     const response = await apiRequest<any>('/order-products');
     return response.data || response;
  },

  createOrderProduct: async (data: Partial<OrderProduct>): Promise<OrderProduct> => {
      const response = await apiRequest<any>('/order-products', {
          method: 'POST',
          body: JSON.stringify(data)
      });
      return response.data || response;
  },

  // --- Blog ---
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const response = await apiRequest<any>('/blogs');
    return response.data || response;
  },

  getBlogPost: async (idOrSlug: string | number): Promise<BlogPost> => {
    const response = await apiRequest<any>(`/blogs/${idOrSlug}`);
    return response.data || response;
  },

  // --- Pages ---
  getPages: async (featured?: boolean): Promise<Page[]> => {
    const query = featured ? '?featured=1' : '';
    const response = await apiRequest<any>(`/pages${query}`);
    return response.data || response;
  },

  getPage: async (slug: string): Promise<Page> => {
     const response = await apiRequest<any>(`/pages/${slug}`);
     return response.data || response;
  },

  // --- Coupons ---
  validateCoupon: async (code: string): Promise<Coupon> => {
    const response = await apiRequest<any>('/coupon/validate', {
        method: 'POST',
        body: JSON.stringify({ code })
    });
    return response.data || response;
  },

  // --- Top Ups ---
  createTopUp: async (data: { phone: string; amount: number; operator: string; pm_type?: string }): Promise<any> => {
      // Assuming endpoint from TopUpController
      const response = await apiRequest<any>('/top-ups', {
          method: 'POST',
          body: JSON.stringify(data)
      });
      return response.data || response;
  }
};
