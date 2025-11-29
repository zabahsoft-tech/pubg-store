import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { VALID_COUPONS } from '../constants';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, CreditCard, Wallet, Tag, Gamepad, AlertCircle, Building2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItem, user, currentTenant, processPurchase, t } = useStore();
  
  // Form State
  const [gameId, setGameId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'STRIPE'>('WALLET');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cartItem) {
      navigate('/');
    }
  }, [cartItem, navigate]);

  if (!cartItem) return null;

  // Calculations
  const subtotal = cartItem.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - discountAmount);
  
  const canUseWallet = currentTenant.balance >= total;

  // Handlers
  const handleApplyCoupon = () => {
    setCouponError(null);
    const coupon = VALID_COUPONS.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      let discount = 0;
      if (coupon.discountType === 'FIXED') {
        discount = coupon.value;
      } else {
        discount = (subtotal * coupon.value) / 100;
      }
      setAppliedCoupon({ code: coupon.code, discount });
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId) {
      setError('Please enter your Game ID');
      return;
    }
    
    setError(null);
    setIsProcessing(true);

    try {
      await processPurchase(
        total, 
        `${cartItem.name} - ${cartItem.amount} (ID: ${gameId})`, 
        paymentMethod
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-brand-500/10 p-3 rounded-full">
          <ShieldCheck className="w-8 h-8 text-brand-500" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-center text-white mb-8">{t('secure_checkout')}</h1>

      <div className="grid gap-8">
        {/* Order Summary */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-dark-700 pb-2">{t('order_summary')}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img src={cartItem.image} alt={cartItem.name} className="w-16 h-16 rounded-lg object-cover bg-dark-900" />
            <div>
              <p className="font-bold text-white">{cartItem.name}</p>
              <p className="text-brand-400">{cartItem.amount}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-white">${cartItem.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Identification */}
          <div className="space-y-4">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">1. Account Details</h3>
            <Input
              label={`Enter your ${cartItem.type} ID`}
              placeholder="e.g. 512345678"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              icon={<Gamepad className="w-5 h-5" />}
              required
            />
            <p className="text-xs text-gray-500">
              Please double check your ID. Digital goods are non-refundable.
            </p>
          </div>

          {/* Step 2: Payment Method */}
          <div className="space-y-4">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">2. Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wallet Option */}
              <label className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'WALLET' 
                  ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500' 
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              } ${!canUseWallet ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="WALLET"
                  checked={paymentMethod === 'WALLET'}
                  onChange={() => canUseWallet && setPaymentMethod('WALLET')}
                  disabled={!canUseWallet}
                  className="sr-only"
                />
                <Wallet className={`w-5 h-5 mt-0.5 mr-3 ${paymentMethod === 'WALLET' ? 'text-brand-400' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <span className="block font-medium text-white">{t('pay_wallet')}</span>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                     <Building2 className="w-3 h-3 mr-1" />
                     {currentTenant.name}: ${currentTenant.balance.toFixed(2)}
                  </div>
                  {!canUseWallet && <span className="text-xs text-red-400 mt-1 block">Insufficient funds</span>}
                </div>
              </label>

              {/* Stripe Option */}
              <label className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'STRIPE' 
                  ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500' 
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="STRIPE"
                  checked={paymentMethod === 'STRIPE'}
                  onChange={() => setPaymentMethod('STRIPE')}
                  className="sr-only"
                />
                <CreditCard className={`w-5 h-5 mt-0.5 mr-3 ${paymentMethod === 'STRIPE' ? 'text-brand-400' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <span className="block font-medium text-white">{t('pay_card')}</span>
                  <span className="block text-sm text-gray-400">Secure via Stripe</span>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Coupon */}
          <div className="space-y-4">
             <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">3. Discounts</h3>
             <div className="flex space-x-2">
                <div className="flex-1">
                    <Input 
                      placeholder="Enter code (e.g. APEX10)" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      icon={<Tag className="w-4 h-4" />}
                      disabled={!!appliedCoupon}
                    />
                </div>
                {appliedCoupon ? (
                  <Button type="button" variant="secondary" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}>
                    Remove
                  </Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                )}
             </div>
             {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
             {appliedCoupon && (
               <p className="text-green-500 text-sm flex items-center">
                 <ShieldCheck className="w-4 h-4 mr-1" /> Code {appliedCoupon.code} applied!
               </p>
             )}
          </div>

          {/* Totals & Submit */}
          <div className="bg-dark-900 rounded-xl p-6 border border-dark-800">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-dark-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isProcessing}>
              {paymentMethod === 'WALLET' ? t('confirm_pay') : 'Proceed to Stripe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};