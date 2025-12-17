
import { Coupon, User, BlogPost, Page, ExchangeRate, Product, ProductCategory, OrderProduct, Wallet, WalletTransaction } from './types';

// Exchange Rates (Base USD)
export const EXCHANGE_RATES: ExchangeRate = {
  'USD': 1,
  'AFN': 75 
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
    nav_cart: "Cart",
    nav_blog: "Blog",
    my_app: "My App",
    currency: "Currency",
    hero_read_more: "Read Article",
    digital_section: "Digital Services",
    physical_section: "Physical Products",
    add_to_cart: "Add to Cart",
    checkout: "Checkout",
    cart_empty: "Your cart is empty",
    total: "Total",
    checkout_digital_info: "Digital Delivery Info",
    checkout_physical_info: "Shipping Address",
    label_player_id: "Player ID (for Game Credits)",
    label_phone: "Phone Number",
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
    unverified_status: "Unverified",
    amount: "Amount",
    coupon_code: "Coupon Code",
    apply: "Apply",
    discount: "Discount",
    topup_amount: "Top-up Amount",
    topup_success: "Top-up Successful!",
    make_another_topup: "Make Another Top-up",
    secure_transaction: "Secure encrypted transaction.",
    summary: "Summary",
    cart_items: "Cart Items",
    subtotal: "Subtotal",
    processing_fee: "Processing Fee",
    order_summary: "Order Summary",
    account_status: "Account Status",
    latest_news: "Latest News",
    news_subtitle: "Updates from the Rahat Pay team",
    share: "Share",
    written_by: "Written by",
    in_stock: "In Stock",
    sign_out: "Sign Out",
    enter_custom_amount: "Enter custom amount...",
    promo_code_placeholder: "Promo Code",
    operator: "Operator",
    number_label: "Number",
    go_shopping: "Go Shopping",
    back_home: "Back to Home",
    post_not_found: "Post not found",
    loading: "Loading...",
    featured_tag: "Featured",
    wallet_balance: "Wallet Balance",
    add_funds: "Add Funds to Wallet",
    recent_transactions: "Recent Transactions"
  },
  fa: {
    nav_store: "فروشگاه",
    nav_dashboard: "داشبورد",
    nav_mobile: "شارژ موبایل",
    nav_admin: "مدیریت",
    nav_cart: "سبد خرید",
    nav_blog: "وبلاگ",
    my_app: "برنامه من",
    currency: "واحد پول",
    hero_read_more: "خواندن مقاله",
    digital_section: "خدمات دیجیتال",
    physical_section: "محصولات فیزیکی",
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
    unverified_status: "تایید نشده",
    amount: "مبلغ",
    coupon_code: "کد تخفیف",
    apply: "اعمال",
    discount: "تخفیف",
    topup_amount: "مبلغ شارژ",
    topup_success: "شارژ موفقیت‌آمیز بود!",
    make_another_topup: "انجام شارژ مجدد",
    secure_transaction: "تراکنش امن و رمزگذاری شده",
    summary: "خلاصه",
    cart_items: "آیتم‌های سبد خرید",
    subtotal: "جمع جزئی",
    processing_fee: "کارمزد پردازش",
    order_summary: "خلاصه سفارش",
    account_status: "وضعیت حساب",
    latest_news: "آخرین اخبار",
    news_subtitle: "اخبار و بروزرسانی‌های تیم راحت پی",
    share: "اشتراک‌گذاری",
    written_by: "نوشته شده توسط",
    in_stock: "موجود",
    sign_out: "خروج",
    enter_custom_amount: "مبلغ دلخواه را وارد کنید...",
    promo_code_placeholder: "کد تبلیغاتی",
    operator: "اپراتور",
    number_label: "شماره",
    go_shopping: "خرید کنید",
    back_home: "بازگشت به خانه",
    post_not_found: "پست پیدا نشد",
    loading: "در حال بارگذاری...",
    featured_tag: "ویژه",
    wallet_balance: "موجودی کیف پول",
    add_funds: "افزایش موجودی",
    recent_transactions: "تراکنش‌های اخیر"
  }
};

export const CATEGORIES: ProductCategory[] = [
  {
    id: 1,
    en_name: 'PUBG Mobile',
    fa_name: 'پابجی موبایل',
    slug: 'pubg-mobile',
    is_active: true
  },
  {
    id: 2,
    en_name: 'IMO Chat',
    fa_name: 'ایمو',
    slug: 'imo-chat',
    is_active: true
  },
  {
    id: 3,
    en_name: 'Gaming Merch',
    fa_name: 'تجهیزات گیمینگ',
    slug: 'gaming-merch',
    is_active: true
  }
];

export const PRODUCTS: Product[] = [
  // --- Digital: PUBG (Category 1) ---
  {
    id: 1,
    en_name: 'PUBG Mobile 60 UC',
    fa_name: 'پابجی موبایل ۶۰ یوسی',
    product_category_id: 1,
    price: 0.99,
    discount: 0,
    thumbnail: 'https://picsum.photos/seed/pubg1/400/400',
    en_description: 'Get 60 Unknown Cash (UC) instantly delivered to your PUBG Mobile account.',
    fa_description: 'دریافت ۶۰ یوسی برای حساب پابجی موبایل به صورت آنی.',
    slug: 'pubg-mobile-60-uc',
    is_featured: true,
    is_active: true
  },
  {
    id: 2,
    en_name: 'PUBG Mobile 600 UC',
    fa_name: 'پابجی موبایل ۶۰۰ یوسی',
    product_category_id: 1,
    price: 9.99,
    discount: 0,
    thumbnail: 'https://picsum.photos/seed/pubg3/400/400',
    en_description: 'Top up 600 UC + Bonus. Perfect for the Elite Pass.',
    fa_description: 'شارژ ۶۰۰ یوسی + پاداش. عالی برای الیت پس.',
    slug: 'pubg-mobile-600-uc',
    is_featured: false,
    is_active: true
  },
  // --- Digital: IMO (Category 2) ---
  {
    id: 3,
    en_name: 'IMO 40 Gems',
    fa_name: 'ایمو ۴۰ الماس',
    product_category_id: 2,
    price: 0.99,
    discount: 0,
    thumbnail: 'https://picsum.photos/seed/imo1/400/400',
    en_description: 'Purchase 40 IMO Gems to send gifts in chat rooms.',
    fa_description: 'خرید ۴۰ الماس ایمو برای ارسال هدایا در چت روم‌ها.',
    slug: 'imo-40-gems',
    is_featured: false,
    is_active: true
  },
  {
    id: 4,
    en_name: 'IMO 1000 Gems',
    fa_name: 'ایمو ۱۰۰۰ الماس',
    product_category_id: 2,
    price: 19.99,
    discount: 5,
    thumbnail: 'https://picsum.photos/seed/imo3/400/400',
    en_description: 'The ultimate gem pack. Get 1000 Gems with a discount.',
    fa_description: 'بسته نهایی الماس. دریافت ۱۰۰۰ الماس با تخفیف.',
    slug: 'imo-1000-gems',
    is_featured: true,
    is_active: true
  },
  // --- Physical (Category 3) ---
  {
    id: 5,
    en_name: 'Rahat Gamer T-Shirt',
    fa_name: 'تی‌شرت گیمر راحت',
    product_category_id: 3,
    price: 24.99,
    discount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
    en_description: '100% Cotton, Black, Size L. Official Rahat Pay limited edition.',
    fa_description: '۱۰۰٪ نخ، مشکی، سایز بزرگ. نسخه محدود رسمی راحت پی.',
    slug: 'rahat-gamer-tshirt',
    is_featured: false,
    is_active: true
  },
  {
    id: 6,
    en_name: 'Gaming Coffee Mug',
    fa_name: 'لیوان قهوه گیمینگ',
    product_category_id: 3,
    price: 14.50,
    discount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=500',
    en_description: 'Ceramic, Heat reactive. Level up your morning coffee.',
    fa_description: 'سرامیکی، حساس به حرارت. قهوه صبحگاهی خود را ارتقا دهید.',
    slug: 'gaming-coffee-mug',
    is_featured: false,
    is_active: true
  }
];

export const VALID_COUPONS: Coupon[] = [
  { id: 1, code: 'RAHAT10', discountType: 'PERCENTAGE', value: 10 }, 
];

export const MOCK_WALLET: Wallet = {
  id: 1,
  balance: 150.00,
  is_active: true,
  user_id: 12345,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 1,
    pm_type: 'stripe',
    type: 'credit',
    amount: 50.00,
    wallet_id: 1,
    user_id: 12345,
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    id: 2,
    pm_type: 'stripe',
    type: 'credit',
    amount: 100.00,
    wallet_id: 1,
    user_id: 12345,
    created_at: '2024-03-05T14:30:00Z'
  },
  {
    id: 3,
    pm_type: 'wallet',
    type: 'debit',
    amount: 25.00,
    wallet_id: 1,
    user_id: 12345,
    created_at: '2024-03-10T09:15:00Z'
  }
];

export const MOCK_USER: User = {
  id: 'u_12345',
  name: 'Alex Gamer',
  email: 'alex@example.com',
  phoneNumber: '',
  emailVerified: true, 
  isAdmin: true,
  tenants: [
    { id: 't_personal', name: 'Personal Account', type: 'PERSONAL', balance: 150.00 }, // Legacy support
  ],
  orders: [],
  wallet: MOCK_WALLET
};

// CMS: Blog Posts
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'pubg-mobile-update',
    en_title: 'New Season: PUBG Mobile Update',
    fa_title: 'فصل جدید: بروزرسانی پابجی موبایل',
    en_description: 'The new season of PUBG Mobile is here!',
    fa_description: 'فصل جدید پابجی موبایل از راه رسید!',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    is_featured: true,
    is_active: true,
    created_at: '2024-03-10'
  },
  {
    id: 2,
    slug: 'rahat-pay-merch',
    en_title: 'Rahat Pay Exclusive: Merch Drop',
    fa_title: 'محصولات انحصاری راحت پی: عرضه جدید',
    en_description: 'We are excited to announce our first-ever physical merchandise drop!',
    fa_description: 'ما با هیجان اولین عرضه محصولات فیزیکی خود را اعلام می‌کنیم!',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999',
    is_featured: true,
    is_active: true,
    created_at: '2024-03-12'
  }
];

export const DYNAMIC_PAGES: Page[] = [
  { id: 'p1', slug: 'terms', title: 'Terms of Service', content: 'Terms content...', showInFooter: true },
  { id: 'p2', slug: 'privacy', title: 'Privacy Policy', content: 'Privacy content...', showInFooter: true },
  { id: 'p3', slug: 'about', title: 'About Us', content: 'About content...', showInFooter: true },
];
