import { Product, Coupon, User } from './types';

export const MOCK_USER: User = {
  id: 'u_12345',
  name: 'Alex Gamer',
  email: 'alex@example.com',
  balance: 15.50,
  transactions: [
    {
      id: 'tx_99',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'DEPOSIT',
      description: 'Wallet Top-up',
      amount: 50.00,
      status: 'COMPLETED',
      paymentMethod: 'STRIPE'
    },
    {
      id: 'tx_98',
      date: new Date(Date.now() - 172800000).toISOString(),
      type: 'PURCHASE',
      description: 'PUBG Mobile - 300 UC',
      amount: -4.99,
      status: 'COMPLETED',
      paymentMethod: 'WALLET'
    }
  ]
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
  { code: 'APEX10', discountType: 'PERCENTAGE', value: 10 }, // 10% off
  { code: 'WELCOME5', discountType: 'FIXED', value: 5.00 },   // $5 off
];