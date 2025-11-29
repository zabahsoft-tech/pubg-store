export type ProductType = 'PUBG' | 'IMO';
export type Language = 'en' | 'fa';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  amount: string; // Display text like "60 UC"
  price: number;
  bonus?: string;
  image: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'PURCHASE';
  description: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod: 'WALLET' | 'STRIPE';
  tenantId: string; // Linked to specific tenant
}

export interface Tenant {
  id: string;
  name: string;
  type: 'PERSONAL' | 'BUSINESS';
  balance: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
  tenants: Tenant[];
  transactions: Transaction[];
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
}