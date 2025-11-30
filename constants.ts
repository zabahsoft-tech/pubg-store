import { Product, Coupon, User, BlogPost, Page, ExchangeRate } from './types';

// Exchange Rates (Base USD)
export const EXCHANGE_RATES: ExchangeRate = {
  'USD': 1,
  'AFN': 75 // Approx rate 1 USD = 75 Afghani
};

// Operator Prefix Logic (Afghanistan)
export const OPERATOR_PREFIXES: Record<string, string> = {
  '070': 'AWCC', '071': 'AWCC',
  '072': 'Roshan', '079': 'Roshan',
  '078': 'Etisalat',
  '073': 'Etisalat',
  '077': 'MTN', '076': 'MTN',
  '074': 'Salaam', '075': 'Afghan Telecom'
};

export const TRANSLATIONS = {
  en: {
    nav_store: "Store",
    nav_dashboard: "Dashboard",
    nav_mobile: "Mobile Top-up",
    nav_admin: "Admin",
    currency: "Currency",
    hero_read_more: "Read Article",
    digital_section: "Digital Services",
    physical_section: "Gaming Gear & Merch",
    pubg_section: "PUBG Mobile",
    imo_section: "IMO Chat",
    add_to_cart: "Add to Cart",
    checkout: "Checkout",
    cart_empty: "Your cart is empty",
    total: "Total",
    checkout_digital_info: "Digital Delivery Info",
    checkout_physical_info: "Shipping Address",
    label_player_id: "Player ID (for Game Credits)",
    label_phone: "Phone Number (for App Credits)",
    label_address: "Full Shipping Address",
    btn_place_order: "Place Order",
    order_id: "Order #",
    status_pending: "Pending",
    status_completed: "Completed",
    status_failed: "Failed",
    type_digital: "Digital Bundle",
    type_physical: "Physical Shipment",
    tenant_personal: "Personal",
    tenant_business: "Business",
    back_store: "Back to Store",
    features: "Features",
    description: "Description",
    related_products: "Related Products",
    profile_title: "My Profile",
    full_name: "Full Name",
    email_address: "Email Address",
    phone_number: "Phone Number",
    save_changes: "Save Changes",
    success_msg: "Saved Successfully",
    verified_status: "Verified",
    unverified_status: "Unverified"
  },
  fa: {
    nav_store: "فروشگاه",
    nav_dashboard: "داشبورد",
    nav_mobile: "شارژ موبایل",
    nav_admin: "مدیریت",
    currency: "واحد پول",
    hero_read_more: "خواندن مقاله",
    digital_section: "خدمات دیجیتال",
    physical_section: "تجهیزات گیمینگ",
    pubg_section: "پابجی موبایل",
    imo_section: "ایمو",
    add_to_cart: "افزودن به سبد",
    checkout: "تصفیه حساب",
    cart_empty: "سبد خرید خالی است",
    total: "مجموع",
    checkout_digital_info: "اطلاعات تحویل دیجیتال",
    checkout_physical_info: "آدرس ارسال",
    label_player_id: "آیدی بازیکن",
    label_phone: "شماره موبایل",
    label_address: "آدرس کامل پستی",
    btn_place_order: "ثبت سفارش",
    order_id: "سفارش #",
    status_pending: "در انتظار",
    status_completed: "تکمیل شده",
    status_failed: "ناموفق",
    type_digital: "بسته دیجیتال",
    type_physical: "مرسوله فیزیکی",
    tenant_personal: "شخصی",
    tenant_business: "تجاری",
    back_store: "بازگشت به فروشگاه",
    features: "ویژگی‌ها",
    description: "توضیحات",
    related_products: "محصولات مرتبط",
    profile_title: "پروفایل من",
    full_name: "نام کامل",
    email_address: "ایمیل",
    phone_number: "شماره تماس",
    save_changes: "ذخیره تغییرات",
    success_msg: "با موفقیت ذخیره شد",
    verified_status: "تایید شده",
    unverified_status: "تایید نشده"
  }
};

export const MOCK_USER: User = {
  id: 'u_12345',
  name: 'Alex Gamer',
  email: 'alex@example.com',
  phoneNumber: '',
  emailVerified: true, 
  isAdmin: true, // Super Admin permission
  tenants: [
    { id: 't_personal', name: 'Personal Account', type: 'PERSONAL', balance: 150.00 },
    { id: 't_business', name: 'Pro Reseller', type: 'BUSINESS', balance: 2500.00 }
  ],
  orders: []
};

// CMS: Blog Posts (Featured ones appear in Slider)
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'New Season: PUBG Mobile Update',
    excerpt: 'Check out the latest skins and maps available in the new update.',
    content: 'The new season of PUBG Mobile is here! Experience the thrill of the new "Frost Festival" map mode, exclusive winter-themed skins, and weapon balancing updates. The developers have listened to community feedback and adjusted the recoil patterns for the M416 and Beryl M762. Jump in now and claim your rewards.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    isFeatured: true,
    date: '2024-03-10'
  },
  {
    id: 'b2',
    title: 'Rahat Pay Exclusive: Merch Drop',
    excerpt: 'Get your hands on limited edition hoodies and gaming accessories.',
    content: 'We are excited to announce our first-ever physical merchandise drop! Featuring high-quality cotton hoodies, mechanical keyboards, and precision gaming mice. All items are designed with the Rahat Pay aesthetic in mind. Limited stock available, so order quickly before they run out.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999',
    isFeatured: true,
    date: '2024-03-12'
  }
];

// CMS: Dynamic Pages
export const DYNAMIC_PAGES: Page[] = [
  { id: 'p1', slug: 'terms', title: 'Terms of Service', content: 'Terms content...', showInFooter: true },
  { id: 'p2', slug: 'privacy', title: 'Privacy Policy', content: 'Privacy content...', showInFooter: true },
  { id: 'p3', slug: 'about', title: 'About Us', content: 'About content...', showInFooter: true },
];

export const PRODUCTS: Product[] = [
  // --- Digital: PUBG ---
  {
    id: 'pubg_60',
    name: 'PUBG Mobile UC',
    category: 'PUBG',
    amount: '60 UC',
    price: 0.99,
    image: 'https://picsum.photos/seed/pubg1/200/200',
    longDescription: 'Get 60 Unknown Cash (UC) instantly delivered to your PUBG Mobile account. Use UC to purchase battle passes, skins, and crates.',
    features: ['Instant Delivery', 'Global Region Support', 'Safe & Secure'],
    isFeatured: true
  },
  {
    id: 'pubg_600',
    name: 'PUBG Mobile UC',
    category: 'PUBG',
    amount: '600 UC',
    price: 9.99,
    image: 'https://picsum.photos/seed/pubg3/200/200',
    longDescription: 'Top up 600 UC + Bonus. Perfect for the Elite Pass. Experience the battlefield with premium outfits and weapon skins.',
    features: ['Instant Delivery', 'Includes Bonus UC', 'Elite Pass Ready']
  },
  // --- Digital: IMO ---
  {
    id: 'imo_40',
    name: 'IMO Gems',
    category: 'IMO',
    amount: '40 Gems',
    price: 0.99,
    image: 'https://picsum.photos/seed/imo1/200/200',
    longDescription: 'Purchase 40 IMO Gems to send gifts and stickers to your friends and family in chat rooms.',
    features: ['Direct Top-up', 'No Login Required', '24/7 Support']
  },
  {
    id: 'imo_1000',
    name: 'IMO Gems',
    category: 'IMO',
    amount: '1000 Gems',
    bonus: 'Best Value',
    price: 19.99,
    image: 'https://picsum.photos/seed/imo3/200/200',
    longDescription: 'The ultimate gem pack for power users. Get 1000 Gems plus exclusive bonuses. Become a VIP in your favorite chat rooms.',
    features: ['Best Value', 'Instant Credit', 'Secure Payment'],
    isFeatured: true
  },
  // --- Physical Products ---
  {
    id: 'phys_tshirt',
    name: 'Rahat Gamer T-Shirt',
    category: 'PHYSICAL',
    description: '100% Cotton, Black, Size L',
    longDescription: 'Official Rahat Pay limited edition gamer tee. Made from 100% premium combed cotton with a high-quality screen print that does not fade.',
    features: ['100% Cotton', 'Unisex Fit', 'Machine Washable', 'Limited Edition'],
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'phys_mug',
    name: 'Gaming Coffee Mug',
    category: 'PHYSICAL',
    description: 'Ceramic, Heat reactive',
    longDescription: 'Level up your morning coffee with this heat-reactive gaming mug. The design changes when hot liquid is poured in.',
    features: ['Ceramic Material', 'Heat Reactive Color Change', '11oz Capacity', 'Dishwasher Safe'],
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=500',
  }
];

export const VALID_COUPONS: Coupon[] = [
  { code: 'RAHAT10', discountType: 'PERCENTAGE', value: 10 }, 
];