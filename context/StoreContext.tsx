import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');
  const [pages] = useState<Page[]>(DYNAMIC_PAGES); // CMS Pages
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (user.tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.tenants[0].id);
    }
  }, [user, currentTenantId]);

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Fetch Blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
        try {
            const posts = await api.getBlogPosts();
            setBlogPosts(posts);
        } catch (e) {
            console.error("Failed to fetch blogs", e);
        }
    };
    fetchBlogs();
  }, []);

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
    // AFN Formatting
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

  // --- CRITICAL: Hybrid Order Workflow Logic ---
  const processCheckout = async (digitalData: { playerId?: string, phone?: string }, physicalData: { address?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API

    const newOrders: Order[] = [];
    
    // 1. Separate Digital vs Physical items
    const digitalItems = cart.filter(item => item.category !== 'PHYSICAL');
    const physicalItems = cart.filter(item => item.category === 'PHYSICAL');

    // 2. Logic Scenario A & C (Digital Bundle)
    // If there are ANY digital items, they form ONE combined order
    if (digitalItems.length > 0) {
      newOrders.push({
        id: `ord_dig_${Date.now()}`,
        date: new Date().toISOString(),
        items: digitalItems,
        totalAmount: digitalItems.reduce((sum, item) => sum + item.price, 0),
        currency: 'USD', // Base currency storage
        status: 'COMPLETED',
        type: 'DIGITAL_BUNDLE'
      });
    }

    // 3. Logic Scenario B & C (Physical Singles)
    // Each physical item creates its OWN separate order
    physicalItems.forEach((item, index) => {
      newOrders.push({
        id: `ord_phys_${Date.now()}_${index}`,
        date: new Date().toISOString(),
        items: [item],
        totalAmount: item.price,
        currency: 'USD',
        status: 'PENDING', // Physical usually requires shipping status
        type: 'PHYSICAL_SINGLE'
      });
    });

    // 4. Update User State (Simulating Database Update)
    setUser(prev => ({
      ...prev,
      orders: [...newOrders, ...prev.orders]
    }));

    clearCart();
  };

  const verifyEmail = async (): Promise<void> => {
    await api.verifyEmail();
    setUser(prev => ({ ...prev, emailVerified: true }));
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    const updatedUser = await api.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <StoreContext.Provider value={{ 
      user, 
      cart, 
      language, 
      currency,
      pages,
      blogPosts,
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
      t 
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