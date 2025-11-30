import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, User, MapPin, Smartphone, Trash2, Tag, Check, X } from 'lucide-react';
import { VALID_COUPONS } from '../constants';
import { Coupon } from '../types';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, processCheckout, t, convertPrice } = useStore();
  
  // Conditional Form State
  const [playerId, setPlayerId] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Analyze Cart Content
  const hasPubg = cart.some(i => i.category === 'PUBG');
  const hasImo = cart.some(i => i.category === 'IMO');
  const hasPhysical = cart.some(i => i.category === 'PHYSICAL');

  // Calculations
  const totalUSD = cart.reduce((sum, item) => sum + item.price, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = totalUSD * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, totalUSD - discountAmount);

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    
    if (!couponCode.trim()) return;

    const found = VALID_COUPONS.find(c => c.code === couponCode.trim());
    if (found) {
      setAppliedCoupon(found);
      setCouponMessage({ 
        type: 'success', 
        text: found.discountType === 'PERCENTAGE' ? `${found.value}% Discount Applied` : `$${found.value} Discount Applied` 
      });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Pass data to store to handle the splitting logic
    await processCheckout(
      { playerId: hasPubg ? playerId : undefined, phone: hasImo ? phone : undefined },
      { address: hasPhysical ? address : undefined }
    );

    setIsProcessing(false);
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400 font-bold mb-4">{t('cart_empty')}</h2>
        <Button onClick={() => navigate('/')}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Left Column: Cart Items & Inputs */}
      <div className="md:col-span-2 space-y-8">
        <h1 className="text-3xl font-bold text-white mb-6">{t('checkout')}</h1>

        {/* Cart Review */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Cart Items ({cart.length})</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between bg-dark-900/50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.amount || item.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-mono">{convertPrice(item.price)}</span>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Forms based on Category */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          
          {(hasPubg || hasImo) && (
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 animate-in fade-in">
              <h3 className="text-brand-400 font-bold mb-4 flex items-center">
                 <Smartphone className="w-5 h-5 mr-2" /> {t('checkout_digital_info')}
              </h3>
              <div className="space-y-4">
                {hasPubg && (
                  <Input 
                    label={t('label_player_id')} 
                    placeholder="Enter Player ID" 
                    value={playerId}
                    onChange={e => setPlayerId(e.target.value)}
                    required
                    icon={<User className="w-4 h-4" />}
                  />
                )}
                {hasImo && (
                  <Input 
                    label={t('label_phone')} 
                    placeholder="Enter Phone Number" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    icon={<Smartphone className="w-4 h-4" />}
                  />
                )}
              </div>
            </div>
          )}

          {hasPhysical && (
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 animate-in fade-in">
              <h3 className="text-purple-400 font-bold mb-4 flex items-center">
                 <MapPin className="w-5 h-5 mr-2" /> {t('checkout_physical_info')}
              </h3>
              <Input 
                label={t('label_address')} 
                placeholder="Street, City, Zip Code" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
          )}
        </form>
      </div>

      {/* Right Column: Summary */}
      <div className="md:col-span-1">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">{t('order_summary')}</h2>
          
          {/* Coupon Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Coupon Code</label>
            <div className="flex space-x-2 rtl:space-x-reverse">
               <div className="relative flex-grow">
                 <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none disabled:opacity-50"
                 />
                 <Tag className="w-4 h-4 text-gray-500 absolute top-2.5 right-3 rtl:left-3 rtl:right-auto" />
               </div>
               {appliedCoupon ? (
                 <button onClick={removeCoupon} className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
               ) : (
                 <button onClick={handleApplyCoupon} className="bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors">
                    Apply
                 </button>
               )}
            </div>
            {couponMessage && (
               <div className={`mt-2 text-xs flex items-center ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {couponMessage.type === 'success' ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  {couponMessage.text}
               </div>
            )}
          </div>

          <div className="space-y-2 text-sm mb-6 border-t border-dark-700 pt-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>{convertPrice(totalUSD)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-brand-400 animate-in fade-in">
                <span>Discount</span>
                <span>-{convertPrice(discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-400">
              <span>Processing Fee</span>
              <span>{convertPrice(0)}</span>
            </div>
            
            <div className="border-t border-dark-700 my-2 pt-2 flex justify-between text-white font-bold text-lg">
              <span>{t('total')}</span>
              <span>{convertPrice(finalTotal)}</span>
            </div>
          </div>

          <Button 
            form="checkout-form"
            type="submit" 
            className="w-full py-4 text-lg shadow-brand-500/20" 
            isLoading={isProcessing}
          >
            {t('btn_place_order')}
          </Button>
          
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <ShieldCheck className="w-3 h-3 mr-1" /> Secure Encrypted Payment
          </div>
        </div>
      </div>

    </div>
  );
};