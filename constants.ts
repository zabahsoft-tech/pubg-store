import { Product, Coupon, User, Language } from './types';

// Updated translations without Spanish (es)
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    nav_store: "Store",
    nav_dashboard: "Dashboard",
    nav_mobile: "Mobile Top-up",
    nav_profile: "Profile",
    wallet_balance: "Total Balance",
    add_funds: "Add Funds",
    recent_transactions: "Recent Transactions",
    hero_title: "Instant Top-Up with",
    hero_subtitle: "Rahat Pay provides secure purchase of UC, Gems, and credits. Delivered instantly.",
    buy_btn: "Buy",
    login: "Login",
    secure_checkout: "Secure Checkout",
    order_summary: "Order Summary",
    pay_wallet: "My Wallet",
    pay_card: "Credit Card",
    confirm_pay: "Confirm Payment",
    verify_email_title: "Verify your email",
    verify_email_desc: "Please verify your email address to unlock all features.",
    verify_btn: "Verify Now",
    switch_workspace: "Switch Workspace",
    personal_acc: "Personal Account",
    business_acc: "Reseller Store",
    verified_status: "Verified",
    unverified_status: "Unverified",
    mobile_topup_title: "Local Mobile Recharge",
    enter_phone: "Phone Number",
    select_operator: "Select Operator",
    amount: "Amount",
    profile_title: "Profile Settings",
    save_changes: "Save Changes",
    full_name: "Full Name",
    email_address: "Email Address",
    phone_number: "Mobile Number",
    success_msg: "Operation successful!",
    operator_mci: "MCI",
    operator_mtn: "MTN Irancell",
    operator_rightel: "Rightel"
  },
  fa: {
    nav_store: "فروشگاه",
    nav_dashboard: "داشبورد",
    nav_mobile: "شارژ موبایل",
    nav_profile: "پروفایل",
    wallet_balance: "موجودی کل",
    add_funds: "افزایش اعتبار",
    recent_transactions: "تراکنش‌های اخیر",
    hero_title: "شارژ فوری با",
    hero_subtitle: "راحت پی؛ خرید امن یوسی، جم و اعتبار. تحویل آنی.",
    buy_btn: "خرید",
    login: "ورود",
    secure_checkout: "پرداخت امن",
    order_summary: "خلاصه سفارش",
    pay_wallet: "کیف پول من",
    pay_card: "کارت بانکی",
    confirm_pay: "تایید پرداخت",
    verify_email_title: "تایید ایمیل",
    verify_email_desc: "لطفا ایمیل خود را تایید کنید تا به تمام امکانات دسترسی داشته باشید.",
    verify_btn: "تایید اکنون",
    switch_workspace: "تغییر فضای کاری",
    personal_acc: "حساب شخصی",
    business_acc: "فروشگاه نمایندگی",
    verified_status: "تایید شده",
    unverified_status: "تایید نشده",
    mobile_topup_title: "شارژ سیم‌کارت",
    enter_phone: "شماره موبایل",
    select_operator: "انتخاب اپراتور",
    amount: "مبلغ",
    profile_title: "تنظیمات پروفایل",
    save_changes: "ذخیره تغییرات",
    full_name: "نام کامل",
    email_address: "آدرس ایمیل",
    phone_number: "شماره موبایل",
    success_msg: "عملیات با موفقیت انجام شد",
    operator_mci: "همراه اول",
    operator_mtn: "ایرانسل",
    operator_rightel: "رایتل"
  }
};

// Kept as initial state fallback, but API will override this
export const MOCK_USER: User = {
  id: 'u_12345',
  name: 'Alex Gamer',
  email: 'alex@example.com',
  phoneNumber: '',
  emailVerified: false, 
  tenants: [
    { id: 't_personal', name: 'Personal Account', type: 'PERSONAL', balance: 0.00 },
    { id: 't_business', name: 'Reseller Store', type: 'BUSINESS', balance: 0.00 }
  ],
  transactions: []
};

export const PRODUCTS: Product[] = [
  // PUBG Products
  {
    id: 'pubg_60',
    name: 'PUBG Mobile UC',
    type: 'PUBG',
    amount: '60 UC',
    price: 0.99,
    image: 'https://picsum.photos/seed/pubg1/200/200'
  },
  {
    id: 'pubg_300',
    name: 'PUBG Mobile UC',
    type: 'PUBG',
    amount: '300 UC',
    bonus: '+25 Bonus',
    price: 4.99,
    image: 'https://picsum.photos/seed/pubg2/200/200'
  },
  {
    id: 'pubg_600',
    name: 'PUBG Mobile UC',
    type: 'PUBG',
    amount: '600 UC',
    bonus: '+60 Bonus',
    price: 9.99,
    image: 'https://picsum.photos/seed/pubg3/200/200'
  },
  {
    id: 'pubg_1500',
    name: 'PUBG Mobile UC',
    type: 'PUBG',
    amount: '1500 UC',
    bonus: '+300 Bonus',
    price: 24.99,
    image: 'https://picsum.photos/seed/pubg4/200/200'
  },
  
  // IMO Products
  {
    id: 'imo_40',
    name: 'IMO Gems',
    type: 'IMO',
    amount: '40 Gems',
    price: 0.99,
    image: 'https://picsum.photos/seed/imo1/200/200'
  },
  {
    id: 'imo_200',
    name: 'IMO Gems',
    type: 'IMO',
    amount: '200 Gems',
    price: 4.50,
    image: 'https://picsum.photos/seed/imo2/200/200'
  },
  {
    id: 'imo_1000',
    name: 'IMO Gems',
    type: 'IMO',
    amount: '1000 Gems',
    bonus: 'Best Value',
    price: 19.99,
    image: 'https://picsum.photos/seed/imo3/200/200'
  },
];

export const VALID_COUPONS: Coupon[] = [
  { code: 'RAHAT10', discountType: 'PERCENTAGE', value: 10 }, 
  { code: 'WELCOME5', discountType: 'FIXED', value: 5.00 },   
];