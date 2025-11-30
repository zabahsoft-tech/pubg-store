export type ProductType = 'PUBG' | 'IMO' | 'PHYSICAL';
export type Currency = 'USD' | 'AFN'; // Multi-currency support
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type Language = 'en' | 'fa';

export interface ExchangeRate {
  [key: string]: number; // e.g., 'AFN': 75
}

export interface Product {
  id: string;
  name: string;
  category: ProductType;
  description?: string;
  longDescription?: string; // For Single Page
  features?: string[]; // Bullet points for Single Page
  amount?: string; // For digital (e.g., "60 UC")
  price: number; // Base price in USD
  bonus?: string;
  image: string;
  isFeatured?: boolean;
}

// CMS: Blog Post for Slider
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Full content for the blog post page
  image: string;
  isFeatured: boolean; // Determines if it appears on Homepage Slider
  date: string;
}

// CMS: Dynamic Pages
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  showInFooter: boolean;
}

// Cart Item
export interface CartItem extends Product {
  cartId: string; // Unique ID for this instance in cart
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[]; // Array of items in this specific order
  totalAmount: number;
  currency: Currency;
  status: OrderStatus;
  type: 'DIGITAL_BUNDLE' | 'PHYSICAL_SINGLE'; // To track the split logic
}

export interface Transaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'PURCHASE';
  description: string;
  amount: number;
  status: string;
  paymentMethod: string;
  tenantId: string;
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
  isAdmin: boolean; // Super Admin Flag
  tenants: Tenant[];
  orders: Order[]; // Changed from transactions to orders for better structure
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
}