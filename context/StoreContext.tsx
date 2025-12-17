
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Product, ProductCategory, Language, Tenant, Currency, CartItem, OrderProduct, Page, BlogPost, PaymentMethod, Wallet, WalletTransaction, Coupon } from '../types';
import { TRANSLATIONS, EXCHANGE_RATES } from '../constants';
import { api } from '../services/api';

interface StoreContextType {
  user: User;
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
  processCheckout: (
    metaData: { playerId?: string, phone?: string, address?: string },
    paymentMethod: PaymentMethod
  ) => Promise<void>;
  creditWallet: (amount: number, pm_type?: string) => Promise<void>;
  validateCoupon: (code: string) => Promise<Coupon>;
  createTopUp: (data: { phone: string; amount: number; operator: string; pm_type?: string }) => Promise<any>;
  verifyEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  switchTenant: (tenantId: string) => void;
  t: (key: string) => string;
  
  // Blog Actions (Client side mutation wrappers for admin)
  addBlogPost: (post: Omit<BlogPost, 'id' | 'created_at'>) => Promise<BlogPost>;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: number) => Promise<void>;
  // Product Actions (Admin)
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Guest User Fallback
const GUEST_USER: User = {
    id: 'guest',
    name: 'Guest User',
    email: '',
    emailVerified: false,
    isAdmin: false,
    tenants: [],
    orders: [],
    wallet: undefined
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Local State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');

  // --- Helpers ---
  const safeArray = <T,>(data: any, fallback: T[] = []): T[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).data)) return (data as any).data;
    return fallback;
  };

  const safeObject = <T,>(data: any, fallback: T): T => {
    if (data && typeof data === 'object' && !Array.isArray(data) && (data as any).data) return (data as any).data;
    return data || fallback;
  };

  // --- React Query Data Fetching ---

  // 1. Fetch User
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
    retry: false,
  });
  const user = safeObject<User>(userData, GUEST_USER);

  // 2. Fetch Wallet
  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: api.getWallet,
    enabled: !!user.id && user.id !== 'guest',
  });
  const wallet = safeObject<Wallet | null>(walletData, null);

  // 3. Fetch Wallet Transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: api.getWalletTransactions,
    enabled: !!user.id && user.id !== 'guest',
  });
  const transactions = safeArray<WalletTransaction>(transactionsData, []);

  // 4. Fetch Products
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });
  const products = safeArray<Product>(productsData, []);

  // 5. Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });
  const categories = safeArray<ProductCategory>(categoriesData, []);

  // 6. Fetch Pages and Blog
  const { data: pagesData } = useQuery({ queryKey: ['pages'], queryFn: () => api.getPages() });
  const pages = safeArray<Page>(pagesData, []);

  const { data: blogPostsData } = useQuery({ queryKey: ['blogPosts'], queryFn: api.getBlogPosts });
  const blogPosts = safeArray<BlogPost>(blogPostsData, []);

  // Derived State
  useEffect(() => {
    if (user.tenants && user.tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.tenants[0].id);
    }
  }, [user, currentTenantId]);

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Construct current tenant but override balance with wallet if available
  const baseTenant = user.tenants?.find(t => t.id === currentTenantId) || user.tenants?.[0] || { id: 'default', name: 'Default', type: 'PERSONAL', balance: 0 };
  const currentTenant: Tenant = {
    ...baseTenant,
    balance: wallet ? wallet.balance : baseTenant.balance || 0
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

  const creditWalletMutation = useMutation({
    mutationFn: async ({ amount, pm_type }: { amount: number, pm_type: string }) => {
      return api.creditWallet(amount, pm_type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const creditWallet = async (amount: number, pm_type: string = 'stripe') => {
    await creditWalletMutation.mutateAsync({ amount, pm_type });
  };

  // Checkout Mutation - Creates OrderProducts
  const checkoutMutation = useMutation({
    mutationFn: async ({ metaData, paymentMethod }: { metaData: any, paymentMethod: PaymentMethod }) => {
      // Logic handled mostly by backend now, but we iterate cart items to create orders
      // In a real app, you might send the whole cart to one endpoint '/orders', but here we use createOrderProduct loop as per existing structure
      // or assuming backend handles bulk.
      // Based on provided API, we have `createOrderProduct`.
      
      const results = [];
      for (const item of cart) {
          const order = await api.createOrderProduct({
              product_id: item.id,
              pm_type: paymentMethod.toLowerCase(),
              quantity: 1, 
              total_price: item.price,
              // metadata could be passed if API supports it, likely needs a custom field or comment
          });
          results.push(order);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Refresh user orders
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      clearCart();
    }
  });

  const processCheckout = async (
    metaData: { playerId?: string, phone?: string, address?: string },
    paymentMethod: PaymentMethod
  ) => {
    await checkoutMutation.mutateAsync({ metaData, paymentMethod });
  };

  const verifyEmailMutation = useMutation({
    mutationFn: api.verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
  const verifyEmail = async () => await verifyEmailMutation.mutateAsync();

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
  const updateProfile = async (data: Partial<User>) => await updateProfileMutation.mutateAsync(data);

  // --- New API wrappers ---
  const validateCoupon = async (code: string) => {
      return await api.validateCoupon(code);
  };

  const createTopUp = async (data: { phone: string; amount: number; operator: string; pm_type?: string }) => {
      const res = await api.createTopUp(data);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      return res;
  };

  // Blog & Product Mutations (Placeholder/mocked logic removed or kept minimal if backend endpoints exist for these)
  // Since api.php didn't show DELETE/PUT for blogs/products explicitly for admin (except maybe standard resource controllers), 
  // we will assume they exist or keep simple state updates if admin API is not fully provided.
  // The provided API list had GET for products/blogs. 
  // We'll leave these as placeholders that would call API if implemented.

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => {
      // const res = await apiRequest('/blogs', { method: 'POST', body: JSON.stringify(post) });
      // return res;
      return {} as BlogPost; // Placeholder
  };
  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {};
  const deleteBlogPost = async (id: number) => {};

  const addProduct = async (prod: Omit<Product, 'id'>) => {
       return {} as Product;
  };
  const updateProduct = async (id: number, prod: Partial<Product>) => {};
  const deleteProduct = async (id: number) => {};

  return (
    <StoreContext.Provider value={{ 
      user, 
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
