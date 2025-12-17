
export type Currency = 'USD' | 'AFN';
export type OrderStatus = 'pending' | 'completed' | 'failed';
export type Language = 'en' | 'fa';
export type PaymentMethod = 'WALLET' | 'STRIPE';

export interface ExchangeRate {
  [key: string]: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Laravel ProductCategory Model
export interface ProductCategory {
  id: number;
  en_name: string;
  fa_name: string;
  en_description?: string;
  fa_description?: string;
  media?: string[]; // Cast as array
  thumbnail?: string;
  slug: string;
  is_active: boolean;
}

// Laravel Product Model
export interface Product {
  id: number;
  en_name: string;
  fa_name: string;
  thumbnail: string; // Single string in fillable, usually URL
  media?: string[]; // Cast as array
  en_description: string;
  fa_description: string;
  price: number;
  discount?: number;
  slug: string;
  is_featured: boolean;
  is_active: boolean;
  product_category_id: number;
  // Relation
  product_category?: ProductCategory;
}

// CMS: Blog Post
export interface BlogPost {
  id: number;
  slug: string;
  en_title: string;
  fa_title: string;
  en_description: string;
  fa_description: string;
  thumbnail: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  user_id?: number;
}

// CMS: Dynamic Pages
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  showInFooter: boolean;
}

// Cart Item extends Product
export interface CartItem extends Product {
  cartId: string;
}

// Laravel OrderProduct Model
export interface OrderProduct {
  id: number;
  pm_type: string; // 'stripe', 'wallet'
  quantity: number;
  total_price: number;
  is_paid: boolean;
  status: string; // 'pending', etc.
  product_id: number;
  user_id: number;
  coupon_id?: number;
  created_at?: string;
  // Relations
  product?: Product;
  user?: User;
  coupon?: Coupon;
}

// Laravel Wallet Model
export interface Wallet {
  id: number;
  balance: number;
  is_active: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

// Laravel WalletTransaction Model
export interface WalletTransaction {
  id: number;
  pm_type: string;
  type: 'credit' | 'debit';
  amount: number;
  wallet_id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Tenant {
  id: string;
  name: string;
  type: 'PERSONAL' | 'BUSINESS';
  balance: number; // Deprecated in favor of Wallet
}

export interface User {
  id: string; 
  name: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
  isAdmin: boolean;
  tenants: Tenant[];
  orders: OrderProduct[];
  wallet?: Wallet; // Optional relation
}

export interface Coupon {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
}
