import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Language, Tenant } from '../types';
import { MOCK_USER, TRANSLATIONS } from '../constants';
import { api } from '../services/api';

interface StoreContextType {
  user: User;
  cartItem: Product | null;
  language: Language;
  currentTenant: Tenant;
  setLanguage: (lang: Language) => void;
  switchTenant: (tenantId: string) => void;
  setCartItem: (product: Product | null) => void;
  topUpWallet: (amount: number) => Promise<void>;
  processPurchase: (amount: number, description: string, method: 'WALLET' | 'STRIPE') => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with empty/mock data, fetch real data on mount
  const [user, setUser] = useState<User>(MOCK_USER);
  const [cartItem, setCartItem] = useState<Product | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [currentTenantId, setCurrentTenantId] = useState<string>('');

  // Set default tenant once user is loaded
  useEffect(() => {
    if (user.tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.tenants[0].id);
    }
  }, [user, currentTenantId]);

  // Handle RTL/LTR direction
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Fetch Initial Data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api.getUser();
        setUser(userData);
        if (userData.tenants.length > 0) {
          setCurrentTenantId(userData.tenants[0].id);
        }
      } catch (error) {
        console.error("Failed to load user data from Laravel API", error);
      }
    };
    fetchUserData();
  }, []);

  const currentTenant = user.tenants.find(t => t.id === currentTenantId) || user.tenants[0] || { id: 'temp', name: 'Loading', balance: 0, type: 'PERSONAL' };

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  // API: Verify Email
  const verifyEmail = async (): Promise<void> => {
    await api.verifyEmail();
    setUser(prev => ({ ...prev, emailVerified: true }));
  };

  // API: Update Profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    await api.updateProfile(data);
    setUser(prev => ({ ...prev, ...data }));
  };

  // API: Top Up Wallet
  const topUpWallet = async (amount: number): Promise<void> => {
    // Call backend
    const result = await api.topUpWallet(amount, currentTenantId);
    
    // Update local state based on API result
    setUser(prev => ({
      ...prev,
      tenants: prev.tenants.map(tenant => 
        tenant.id === currentTenantId 
          ? { ...tenant, balance: prev.tenants.find(t => t.id === currentTenantId)!.balance + amount } // Ideally use result.balance
          : tenant
      ),
      transactions: [result.transaction, ...prev.transactions]
    }));
  };

  // API: Process Purchase
  const processPurchase = async (amount: number, description: string, method: 'WALLET' | 'STRIPE'): Promise<void> => {
    if (method === 'WALLET' && currentTenant.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    // Call backend
    const result = await api.purchase(amount, description, method, currentTenantId);

    // Update local state
    setUser(prev => ({
      ...prev,
      tenants: prev.tenants.map(tenant => 
        tenant.id === currentTenantId && method === 'WALLET'
          ? { ...tenant, balance: tenant.balance - amount }
          : tenant
      ),
      transactions: [result.transaction, ...prev.transactions]
    }));
  };

  return (
    <StoreContext.Provider value={{ 
      user, 
      cartItem, 
      language, 
      currentTenant, 
      setLanguage, 
      switchTenant, 
      setCartItem, 
      topUpWallet, 
      processPurchase, 
      verifyEmail, 
      updateProfile,
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