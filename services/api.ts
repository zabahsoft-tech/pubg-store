
import { User, Product, ProductCategory, OrderProduct, Wallet, WalletTransaction, BlogPost, Page, Coupon, LoginCredentials, RegisterData, AuthResponse } from '../types';

/**
 * API CONFIGURATION
 */
export const BASE_URL = 'https://dashboard.rahatpay.com';
export const API_BASE_URL = `${BASE_URL}/api`;
export const STORAGE_BASE_URL = `${BASE_URL}/storage`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStorageUrl = (path: string | null | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http') || path.startsWith('https')) return path;
  
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${STORAGE_BASE_URL}/${cleanPath}`;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', 
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
          localStorage.removeItem('auth_token');
      }

      let errorMessage = json?.message || json?.error || `Server Error: ${response.status}`;
      
      // Specifically catch the "Rate limiter [api] is not defined" error
      if (errorMessage.includes('Rate limiter [api] is not defined')) {
          const detailedFix = "Laravel Config Error: Rate limiter [api] is not defined. " + 
                             "Add RateLimiter::for('api', ...) to your AppServiceProvider.php boot() method.";
          window.localStorage.setItem('api_critical_error', detailedFix);
          errorMessage = detailedFix;
      }

      // Handle transient "database is locked" error with retry
      if (errorMessage.includes('database is locked') && retries > 0) {
          console.warn(`Database busy on ${endpoint}, retrying... (${retries} attempts left)`);
          await sleep(1000 * (4 - retries)); // 1s, 2s, 3s backoff
          return apiRequest<T>(endpoint, options, retries - 1);
      }

      throw new Error(errorMessage);
    }

    // Even if status is 200, if JSON is null and T expects data, it might cause length errors downstream
    return json as T;
  } catch (error: any) {
    if (error.message.includes('database is locked') && retries > 0) {
        await sleep(1000 * (4 - retries));
        return apiRequest<T>(endpoint, options, retries - 1);
    }
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // --- Auth ---
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
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

  getUser: async (): Promise<User> => {
    try {
      const response = await apiRequest<any>('/me');
      return response.data || response;
    } catch (e) {
      const response = await apiRequest<any>('/user');
      return response.data || response;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiRequest<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response;
  },

  // --- Wallet & Transactions ---
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

  // --- Products & Categories ---
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

  // --- Blog & CMS ---
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const response = await apiRequest<any>('/blogs');
    return response.data || response;
  },

  getBlogPost: async (idOrSlug: string | number): Promise<BlogPost> => {
    const response = await apiRequest<any>(`/blogs/${idOrSlug}`);
    return response.data || response;
  },

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
  createTopUp: async (data: { phone: string; amount: number; pm_type: string; coupon?: string }): Promise<any> => {
      const response = await apiRequest<any>('/top-ups', {
          method: 'POST',
          body: JSON.stringify(data)
      });
      return response.data || response;
  }
};
