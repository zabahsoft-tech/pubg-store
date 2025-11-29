import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Transaction, Product } from '../types';
import { MOCK_USER } from '../constants';

interface StoreContextType {
  user: User;
  cartItem: Product | null;
  setCartItem: (product: Product | null) => void;
  topUpWallet: (amount: number) => Promise<void>;
  processPurchase: (amount: number, description: string, method: 'WALLET' | 'STRIPE') => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [cartItem, setCartItem] = useState<Product | null>(null);

  const topUpWallet = async (amount: number): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      type: 'DEPOSIT',
      description: 'Wallet Top-up via Stripe',
      amount: amount,
      status: 'COMPLETED',
      paymentMethod: 'STRIPE'
    };

    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const processPurchase = async (amount: number, description: string, method: 'WALLET' | 'STRIPE'): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (method === 'WALLET' && user.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      type: 'PURCHASE',
      description: description,
      amount: -amount,
      status: 'COMPLETED',
      paymentMethod: method
    };

    setUser(prev => ({
      ...prev,
      balance: method === 'WALLET' ? prev.balance - amount : prev.balance,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  return (
    <StoreContext.Provider value={{ user, cartItem, setCartItem, topUpWallet, processPurchase }}>
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