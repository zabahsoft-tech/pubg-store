import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Product, Language, Tenant, Currency, CartItem, Order, Page, BlogPost } from '../types';
import { MOCK_USER, TRANSLATIONS, EXCHANGE_RATES, DYNAMIC_PAGES } from '../constants';
import { api } from '../services/api';

interface StoreContextType {
  user: User;
  cart: CartItem[];
  language: Language;
  currency: Currency;
  pages: Page[];
  blogPosts: BlogPost[];
  products: Product[]; // Added products to context
  currentTenant: Tenant;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  convertPrice: (priceUSD: number) => string;
  processCheckout: (digitalData: { playerId?: string, phone?: string }, physicalData: { address?: string }) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  switchTenant: (tenantId: string) => void;
  t: (key: string) => string;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Local State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');
  const [pages] = useState<Page[]>(DYNAMIC_PAGES);

  // --- React Query Data Fetching ---

  // 1. Fetch User
  const { data: user = MOCK_USER } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
    initialData: MOCK_USER,
  });

  // 2. Fetch Blog Posts
  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: api.getBlogPosts,
  });

  // 3. Fetch Products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  // Derived State
  useEffect(() => {
    if (user.tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.tenants[0].id);
    }
  }, [user, currentTenantId]);

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const currentTenant = user.tenants.find(t => t.id === currentTenantId) || user.tenants[0];

  const t = (key: string): string => {
    return TRANSLATIONS[language][key as keyof typeof TRANSLATIONS['en']] || key;
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  // --- Currency Logic ---
  const convertPrice = (priceUSD: number): string => {
    const rate = EXCHANGE_RATES[currency];
    const converted = priceUSD * rate;
    
    if (currency === 'USD') return `$${converted.toFixed(2)}`;
    return `${Math.floor(converted).toLocaleString()} ؋`;
  };

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: `cart_${Date.now()}_${Math.random()}` };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  // --- Mutations ---

  // Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async ({ digitalData, physicalData }: { digitalData: any, physicalData: any }) => {
      // Simulation of checkout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newOrders: Order[] = [];
      const digitalItems = cart.filter(item => item.category !== 'PHYSICAL');
      const physicalItems = cart.filter(item => item.category === 'PHYSICAL');

      if (digitalItems.length > 0) {
        newOrders.push({
          id: `ord_dig_${Date.now()}`,
          date: new Date().toISOString(),
          items: digitalItems,
          totalAmount: digitalItems.reduce((sum, item) => sum + item.price, 0),
          currency: 'USD',
          status: 'COMPLETED',
          type: 'DIGITAL_BUNDLE'
        });
      }

      physicalItems.forEach((item, index) => {
        newOrders.push({
          id: `ord_phys_${Date.now()}_${index}`,
          date: new Date().toISOString(),
          items: [item],
          totalAmount: item.price,
          currency: 'USD',
          status: 'PENDING',
          type: 'PHYSICAL_SINGLE'
        });
      });

      return newOrders;
    },
    onSuccess: (newOrders) => {
      // Optimistically update user orders
      queryClient.setQueryData(['user'], (oldUser: User) => ({
        ...oldUser,
        orders: [...newOrders, ...oldUser.orders]
      }));
      clearCart();
    }
  });

  const processCheckout = async (digitalData: { playerId?: string, phone?: string }, physicalData: { address?: string }) => {
    await checkoutMutation.mutateAsync({ digitalData, physicalData });
  };

  // Email Verification Mutation
  const verifyEmailMutation = useMutation({
    mutationFn: api.verifyEmail,
    onSuccess: () => {
      queryClient.setQueryData(['user'], (oldUser: User) => ({
        ...oldUser,
        emailVerified: true
      }));
    }
  });

  const verifyEmail = async () => {
    await verifyEmailMutation.mutateAsync();
  };

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], (old: User) => ({ ...old, ...updatedUser }));
    }
  });

  const updateProfile = async (data: Partial<User>) => {
    await updateProfileMutation.mutateAsync(data);
  };

  // --- Blog Mutations (Mocked Persistence) ---
  
  const addBlogPostMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'date'>) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      const newPost: BlogPost = {
        ...post,
        id: `blog_${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      return newPost;
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData(['blogPosts'], (old: BlogPost[] = []) => [newPost, ...old]);
    }
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, post }: { id: string, post: Partial<BlogPost> }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, changes: post };
    },
    onSuccess: ({ id, changes }) => {
      queryClient.setQueryData(['blogPosts'], (old: BlogPost[] = []) => 
        old.map(p => p.id === id ? { ...p, ...changes } : p)
      );
    }
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['blogPosts'], (old: BlogPost[] = []) => 
        old.filter(p => p.id !== id)
      );
    }
  });

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date'>) => {
    await addBlogPostMutation.mutateAsync(post);
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    await updateBlogPostMutation.mutateAsync({ id, post });
  };

  const deleteBlogPost = async (id: string) => {
    await deleteBlogPostMutation.mutateAsync(id);
  };

  return (
    <StoreContext.Provider value={{ 
      user, 
      cart, 
      language, 
      currency,
      pages,
      blogPosts,
      products,
      currentTenant, 
      setLanguage, 
      setCurrency,
      addToCart,
      removeFromCart,
      clearCart,
      convertPrice,
      processCheckout, 
      verifyEmail, 
      updateProfile,
      switchTenant,
      t,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};