import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Product, ProductCategory, Language, Tenant, Currency, CartItem, OrderProduct, Page, BlogPost, PaymentMethod } from '../types';
import { MOCK_USER, TRANSLATIONS, EXCHANGE_RATES, DYNAMIC_PAGES, PRODUCTS, CATEGORIES } from '../constants';
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
  topUpWallet: (amount: number) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  switchTenant: (tenantId: string) => void;
  t: (key: string) => string;
  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'created_at'>) => Promise<BlogPost>;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: number) => Promise<void>;
  // Product Actions (Admin)
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Local State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');

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
  const { data: products = PRODUCTS } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
    initialData: PRODUCTS,
  });

  // 4. Fetch Categories
  const { data: categories = CATEGORIES } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    initialData: CATEGORIES,
  });

  // 5. Fetch Pages
  const { data: pages = DYNAMIC_PAGES } = useQuery({
    queryKey: ['pages'],
    queryFn: () => api.getPages(),
    initialData: DYNAMIC_PAGES
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

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await api.topUpWallet(amount, currentTenant.id);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], (oldUser: User) => ({
        ...oldUser,
        tenants: oldUser.tenants.map(t => 
          t.id === currentTenant.id ? { ...t, balance: data.balance } : t
        )
      }));
    }
  });

  const topUpWallet = async (amount: number) => {
    await topUpMutation.mutateAsync(amount);
  };

  // Checkout Mutation - Creates OrderProducts
  const checkoutMutation = useMutation({
    mutationFn: async ({ metaData, paymentMethod }: { metaData: any, paymentMethod: PaymentMethod }) => {
      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

      // Check balance if Wallet payment
      if (paymentMethod === 'WALLET') {
         if (currentTenant.balance < totalAmount) {
            throw new Error('Insufficient wallet balance');
         }
      }

      // Create OrderProduct for each item in cart
      const createdOrders: OrderProduct[] = [];
      for (const item of cart) {
          const order = await api.createOrderProduct({
              product_id: item.id,
              pm_type: paymentMethod.toLowerCase(),
              status: 'pending',
              is_paid: true, 
              quantity: 1, // Assuming 1 per cart item for now
              total_price: item.price,
              // Pass metadata to backend if supported by OrderProduct
          });
          createdOrders.push(order);
      }

      return { createdOrders, totalAmount };
    },
    onSuccess: ({ createdOrders, totalAmount }, variables) => {
      // Update User Orders and Balance
      queryClient.setQueryData(['user'], (oldUser: User) => {
        const updatedTenants = oldUser.tenants.map(t => {
            if (t.id === currentTenant.id && variables.paymentMethod === 'WALLET') {
                return { ...t, balance: t.balance - totalAmount };
            }
            return t;
        });

        return {
          ...oldUser,
          tenants: updatedTenants,
          orders: [...createdOrders, ...oldUser.orders]
        };
      });
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
      queryClient.setQueryData(['user'], (oldUser: User) => ({
        ...oldUser,
        emailVerified: true
      }));
    }
  });

  const verifyEmail = async () => {
    await verifyEmailMutation.mutateAsync();
  };

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], (old: User) => ({ ...old, ...updatedUser }));
    }
  });

  const updateProfile = async (data: Partial<User>) => {
    await updateProfileMutation.mutateAsync(data);
  };

  // Blog Mutations
  const addBlogPostMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'created_at'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newPost: BlogPost = { ...post, id: Math.random(), created_at: new Date().toISOString().split('T')[0] };
      return newPost;
    },
    onSuccess: (newPost) => queryClient.setQueryData(['blogPosts'], (old: BlogPost[] = []) => [newPost, ...old])
  });
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => addBlogPostMutation.mutateAsync(post);
  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {};
  const deleteBlogPost = async (id: number) => {};

  // Product Mutations (Mock)
  const addProductMutation = useMutation({
      mutationFn: async (prod: Omit<Product, 'id'>) => {
          await new Promise(r => setTimeout(r, 500));
          return { ...prod, id: Date.now() } as Product;
      },
      onSuccess: (newProd) => {
          queryClient.setQueryData(['products'], (old: Product[] = []) => [...old, newProd]);
      }
  });

  const addProduct = async (prod: Omit<Product, 'id'>) => await addProductMutation.mutateAsync(prod);
  const updateProduct = async (id: number, prod: Partial<Product>) => {
       queryClient.setQueryData(['products'], (old: Product[] = []) => old.map(p => p.id === id ? {...p, ...prod} : p));
  };
  const deleteProduct = async (id: number) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) => old.filter(p => p.id !== id));
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
      categories,
      currentTenant, 
      setLanguage, 
      setCurrency,
      addToCart,
      removeFromCart,
      clearCart,
      convertPrice,
      processCheckout, 
      topUpWallet,
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