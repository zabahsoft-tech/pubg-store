
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Product, ProductCategory, Language, Tenant, Currency, CartItem, OrderProduct, Page, BlogPost, PaymentMethod, Wallet, WalletTransaction, Coupon, LoginCredentials, RegisterData } from '../types';
import { TRANSLATIONS, EXCHANGE_RATES } from '../constants';
import { api } from '../services/api';

interface StoreContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  cart: CartItem[];
  language: Language;
  currency: Currency;
  pages: Page[];
  blogPosts: BlogPost[];
  products: Product[];
  categories: ProductCategory[];
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  currentTenant: Tenant;
  
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  convertPrice: (priceUSD: number) => string;
  
  // Auth
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;

  processCheckout: (
    metaData: { playerId?: string, phone?: string, address?: string },
    paymentMethod: PaymentMethod
  ) => Promise<void>;
  creditWallet: (amount: number, pm_type?: string) => Promise<void>;
  validateCoupon: (code: string) => Promise<Coupon>;
  createTopUp: (data: { phone: string; amount: number; pm_type: string; coupon?: string }) => Promise<any>;
  verifyEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  switchTenant: (tenantId: string) => void;
  t: (key: string) => string;
  
  // Admin Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'created_at'>) => Promise<BlogPost>;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');

  const safeArray = <T,>(data: any, fallback: T[] = []): T[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).data)) return (data as any).data;
    return fallback;
  };

  const safeObject = <T,>(data: any, fallback: T): T => {
    if (data && typeof data === 'object' && !Array.isArray(data) && (data as any).data) return (data as any).data;
    return data || fallback;
  };

  const { data: userData, isError, isLoading: isUserQueryLoading } = useQuery({
    queryKey: ['user', token],
    queryFn: api.getUser,
    enabled: !!token, 
    retry: 2,
    staleTime: 1000 * 60 * 10, // 10 minutes cache for user profile
  });

  // Memoized user derivation for stability and persistence
  const user = useMemo(() => {
    if (!token || isError || !userData) return null;
    const raw = safeObject<User | null>(userData, null);
    if (!raw) return null;
    return {
      ...raw,
      orders: safeArray(raw.orders, []),
      tenants: safeArray(raw.tenants, [])
    };
  }, [userData, isError, token]);

  const isAuthenticated = !!user;
  // loading state is true only when we HAVE a token but the user object isn't fetched yet
  const isAuthLoading = !!token && isUserQueryLoading && !userData;

  const login = async (credentials: LoginCredentials) => {
      const response = await api.login(credentials);
      const newToken = response.token;
      if (newToken) {
          localStorage.setItem('auth_token', newToken);
          setToken(newToken);
          // Pre-fill cache for immediate UI update
          queryClient.setQueryData(['user', newToken], response.user);
      }
  };

  const register = async (data: RegisterData) => {
      const response = await api.register(data);
      const newToken = response.token;
      if (newToken) {
          localStorage.setItem('auth_token', newToken);
          setToken(newToken);
          queryClient.setQueryData(['user', newToken], response.user);
      }
  };

  const logout = async () => {
      try {
        if (token) await api.logout();
      } catch (e) {
        console.error("Logout error", e);
      } finally {
        localStorage.removeItem('auth_token');
        setToken(null);
        queryClient.clear();
      }
  };

  // Peripheral Data Queries
  const { data: walletData } = useQuery({
    queryKey: ['wallet', token],
    queryFn: api.getWallet,
    enabled: isAuthenticated,
    retry: 3,
  });
  const wallet = safeObject<Wallet | null>(walletData, null);

  const { data: transactionsData } = useQuery({
    queryKey: ['transactions', token],
    queryFn: api.getWalletTransactions,
    enabled: isAuthenticated,
    retry: 3,
  });
  const transactions = safeArray<WalletTransaction>(transactionsData, []);

  const { data: productsData } = useQuery({ queryKey: ['products'], queryFn: api.getProducts, retry: 3 });
  const products = safeArray<Product>(productsData, []);

  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories, retry: 3 });
  const categories = safeArray<ProductCategory>(categoriesData, []);

  const { data: pagesData } = useQuery({ queryKey: ['pages'], queryFn: () => api.getPages(), retry: 3 });
  const pages = safeArray<Page>(pagesData, []);

  const { data: blogPostsData } = useQuery({ queryKey: ['blogPosts'], queryFn: api.getBlogPosts, retry: 3 });
  const blogPosts = safeArray<BlogPost>(blogPostsData, []);

  useEffect(() => {
    if (user && user.tenants && user.tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.tenants[0].id);
    }
  }, [user, currentTenantId]);

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const baseTenant = user?.tenants?.find(t => t.id === currentTenantId) || user?.tenants?.[0] || { id: 'default', name: 'Default', type: 'PERSONAL', balance: 0 };
  const currentTenant: Tenant = {
    ...baseTenant,
    balance: wallet ? wallet.balance : (baseTenant.balance || 0)
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language][key as keyof typeof TRANSLATIONS['en']] || key;
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  const convertPrice = (priceUSD: number): string => {
    const rate = EXCHANGE_RATES[currency];
    const converted = priceUSD * rate;
    if (currency === 'USD') return `$${converted.toFixed(2)}`;
    return `${Math.floor(converted).toLocaleString()} ؋`;
  };

  const addToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: `cart_${Date.now()}_${Math.random()}` };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const creditWallet = async (amount: number, pm_type: string = 'stripe') => {
    await api.creditWallet(amount, pm_type);
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  const processCheckout = async (
    metaData: { playerId?: string, phone?: string, address?: string },
    paymentMethod: PaymentMethod
  ) => {
    for (const item of cart) {
        await api.createOrderProduct({
            product_id: item.id,
            pm_type: paymentMethod.toLowerCase(),
            quantity: 1, 
            total_price: item.price,
        });
    }
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    clearCart();
  };

  const verifyEmail = async () => {};

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.updateProfile(data);
    queryClient.invalidateQueries({ queryKey: ['user'] });
    return res;
  };

  const validateCoupon = async (code: string) => {
      return await api.validateCoupon(code);
  };

  const createTopUp = async (data: { phone: string; amount: number; pm_type: string; coupon?: string }) => {
      const res = await api.createTopUp(data);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      return res;
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => { return {} as BlogPost; };
  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {};
  const deleteBlogPost = async (id: number) => {};
  const addProduct = async (prod: Omit<Product, 'id'>) => { return {} as Product; };
  const updateProduct = async (id: number, product: Partial<Product>) => {};
  const deleteProduct = async (id: number) => {};

  return (
    <StoreContext.Provider value={{ 
      user, 
      isAuthenticated,
      isAuthLoading,
      cart, 
      language, 
      currency,
      pages,
      blogPosts,
      products,
      categories,
      wallet,
      transactions,
      currentTenant, 
      setLanguage, 
      setCurrency,
      addToCart,
      removeFromCart,
      clearCart,
      convertPrice,
      login,
      register,
      logout,
      processCheckout, 
      creditWallet,
      validateCoupon,
      createTopUp,
      verifyEmail, 
      updateProfile,
      switchTenant,
      t,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addProduct,
      updateProduct,
      deleteProduct
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
