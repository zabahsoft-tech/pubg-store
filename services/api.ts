import { User, Product, ProductCategory, OrderProduct, Transaction, BlogPost, Page } from '../types';
import { MOCK_USER, PRODUCTS, CATEGORIES, BLOG_POSTS, DYNAMIC_PAGES } from '../constants';

/**
 * API CONFIGURATION
 */
const USE_MOCK_DATA = true; 
const API_BASE_URL = 'http://localhost:8000/api';

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
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API Request Failed');
  }

  return response.json();
}

export const api = {

  getUser: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 800));
      return MOCK_USER;
    }
    return apiRequest<User>('/user');
  },

  /**
   * PRODUCTS API
   */
  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 600));
      return PRODUCTS;
    }
    return apiRequest<Product[]>('/products');
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      return PRODUCTS.filter(p => p.is_featured);
    }
    return apiRequest<Product[]>('/products/featured');
  },

  getProduct: async (slug: string): Promise<Product> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      const prod = PRODUCTS.find(p => p.slug === slug);
      if (!prod) throw new Error('Product not found');
      return prod;
    }
    return apiRequest<Product>(`/products/${slug}`);
  },

  /**
   * CATEGORIES API
   */
  getCategories: async (): Promise<ProductCategory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 500));
      return CATEGORIES;
    }
    return apiRequest<ProductCategory[]>('/product-categories');
  },

  getCategoryProducts: async (slug: string): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 500));
        const category = CATEGORIES.find(c => c.slug === slug);
        if (!category) return [];
        return PRODUCTS.filter(p => p.product_category_id === category.id);
    }
    return apiRequest<Product[]>(`/product-categories/${slug}/products`);
  },

  /**
   * ORDER PRODUCTS API
   */
  getOrderProducts: async (): Promise<OrderProduct[]> => {
     if (USE_MOCK_DATA) {
         // Return mock user's orders
         return MOCK_USER.orders;
     }
     return apiRequest<OrderProduct[]>('/order-products');
  },

  createOrderProduct: async (data: Partial<OrderProduct>): Promise<OrderProduct> => {
      if (USE_MOCK_DATA) {
          await new Promise(r => setTimeout(r, 1500));
          const newOrder: OrderProduct = {
              id: Date.now(),
              is_paid: true,
              status: 'pending',
              pm_type: data.pm_type || 'wallet',
              product_id: data.product_id!,
              quantity: data.quantity || 1,
              total_price: data.total_price || 0,
              user_id: 12345, // Mock ID
              created_at: new Date().toISOString(),
              // Include product relation for UI mock
              product: PRODUCTS.find(p => p.id === data.product_id)
          };
          return newOrder;
      }
      return apiRequest<OrderProduct>('/order-products', {
          method: 'POST',
          body: JSON.stringify(data)
      });
  },

  // ... Blog and other existing APIs
  getBlogPosts: async (): Promise<BlogPost[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 500));
      return BLOG_POSTS;
    }
    return apiRequest<BlogPost[]>('/blogs');
  },

  getBlogPost: async (idOrSlug: string | number): Promise<BlogPost> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      const post = BLOG_POSTS.find(p => p.id === Number(idOrSlug) || p.slug === idOrSlug);
      if (!post) throw new Error('Post not found');
      return post;
    }
    return apiRequest<BlogPost>(`/blogs/${idOrSlug}`);
  },

  getPages: async (featured?: boolean): Promise<Page[]> => {
    if (USE_MOCK_DATA) {
       await new Promise(r => setTimeout(r, 600));
       if (featured) {
         return DYNAMIC_PAGES.filter(p => p.showInFooter);
       }
       return DYNAMIC_PAGES;
    }
    const query = featured ? '?featured=1' : '';
    return apiRequest<Page[]>(`/pages${query}`);
  },

  getPage: async (slug: string): Promise<Page> => {
     if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 400));
        const page = DYNAMIC_PAGES.find(p => p.slug === slug);
        if (!page) throw new Error('Page not found');
        return page;
     }
     return apiRequest<Page>(`/pages/${slug}`);
  },

  topUpWallet: async (amount: number, tenantId: string): Promise<{ balance: number, transaction: Transaction }> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        balance: 100 + amount, 
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

  verifyEmail: async (): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 2000));
      return;
    }
    return apiRequest('/email/verify', { method: 'POST' });
  }
};