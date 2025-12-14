import { User, Product, Transaction, BlogPost, Page } from '../types';
import { MOCK_USER, PRODUCTS, BLOG_POSTS, DYNAMIC_PAGES } from '../constants';

/**
 * API CONFIGURATION
 * Change this to false to connect to your real Laravel Backend.
 */
const USE_MOCK_DATA = true; 
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Generic Fetch Wrapper
 * Handles headers and basic error parsing from Laravel responses.
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token'); // Assuming you store JWT here
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API Request Failed');
  }

  return response.json();
}

/**
 * API SERVICES
 * Each function corresponds to a backend action.
 */
export const api = {

  /**
   * Fetch current user data (profile, wallet balance, transactions)
   */
  getUser: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      return MOCK_USER;
    }
    return apiRequest<User>('/user');
  },

  /**
   * Fetch available products
   */
  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      return PRODUCTS;
    }
    return apiRequest<Product[]>('/products');
  },

  /**
   * Fetch Blog Posts
   */
  getBlogPosts: async (): Promise<BlogPost[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 500));
      return BLOG_POSTS;
    }
    return apiRequest<BlogPost[]>('/posts');
  },

  /**
   * Fetch Dynamic Pages
   * GET /api/pages
   * GET /api/pages?featured=1
   */
  getPages: async (featured?: boolean): Promise<Page[]> => {
    if (USE_MOCK_DATA) {
       await new Promise(r => setTimeout(r, 600));
       if (featured) {
         // Mock logic: return pages marked for footer as "featured" for this example
         return DYNAMIC_PAGES.filter(p => p.showInFooter);
       }
       return DYNAMIC_PAGES;
    }
    const query = featured ? '?featured=1' : '';
    return apiRequest<Page[]>(`/pages${query}`);
  },

  /**
   * Fetch Single Page
   * GET /api/pages/{slug}
   */
  getPage: async (slug: string): Promise<Page> => {
     if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 400));
        const page = DYNAMIC_PAGES.find(p => p.slug === slug);
        if (!page) throw new Error('Page not found');
        return page;
     }
     return apiRequest<Page>(`/pages/${slug}`);
  },

  /**
   * Top-up Wallet
   * @param amount The amount to add
   * @param tenantId The workspace/tenant ID
   */
  topUpWallet: async (amount: number, tenantId: string): Promise<{ balance: number, transaction: Transaction }> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        balance: 100 + amount, // Simplified mock logic
        transaction: {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString(),
          type: 'DEPOSIT',
          description: 'Wallet Top-up',
          amount: amount,
          status: 'COMPLETED',
          paymentMethod: 'STRIPE',
          tenantId
        }
      };
    }
    return apiRequest('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, tenant_id: tenantId }),
    });
  },

  /**
   * Process a Purchase
   */
  purchase: async (
    amount: number, 
    description: string, 
    method: 'WALLET' | 'STRIPE', 
    tenantId: string
  ): Promise<{ success: boolean, transaction: Transaction }> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 2000));
      return {
        success: true,
        transaction: {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString(),
          type: 'PURCHASE',
          description,
          amount: -amount,
          status: 'COMPLETED',
          paymentMethod: method,
          tenantId
        }
      };
    }
    return apiRequest('/purchase', {
      method: 'POST',
      body: JSON.stringify({ amount, description, method, tenant_id: tenantId }),
    });
  },

  /**
   * Update User Profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 1000));
      return { ...MOCK_USER, ...data };
    }
    return apiRequest<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify Email
   */
  verifyEmail: async (): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 2000));
      return;
    }
    return apiRequest('/email/verify', { method: 'POST' });
  }
};