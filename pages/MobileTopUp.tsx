
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { Smartphone, Signal, CheckCircle, Zap, Tag, Check, X, CreditCard, Hash, Wallet, AlertCircle } from 'lucide-react';
import { OPERATOR_PREFIXES } from '../constants';
import { Coupon, PaymentMethod } from '../types';

export const MobileTopUp: React.FC = () => {
  const { t, convertPrice, currentTenant, createTopUp, validateCoupon } = useStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('WALLET');
  const [error, setError] = useState<string | null>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Smart Operator Detection Logic (Afghan Numbers 07x)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Numeric only
    setPhoneNumber(val);
    
    // Check first 3 digits for Afghan Prefixes (e.g. 079)
    if (val.length >= 3) {
      const prefix = val.substring(0, 3);
      setDetectedOperator(OPERATOR_PREFIXES[prefix] || null);
    } else {
      setDetectedOperator(null);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
        const coupon = await validateCoupon(couponCode.trim());
        setAppliedCoupon(coupon);
        setCouponMessage({ 
          type: 'success', 
          text: coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% Discount Applied` : `$${coupon.value} Discount Applied` 
        });
    } catch (err) {
        setAppliedCoupon(null);
        setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
    } finally {
        setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic frontend check for Laravel validation min:10
    const numericAmount = parseFloat(amount);
    if (!phoneNumber || !numericAmount || numericAmount < 10) {
        setError("Minimum top-up amount is 10.");
        return;
    }

    setIsLoading(true);
    try {
        const response = await createTopUp({
            phone: phoneNumber,
            amount: numericAmount,
            pm_type: paymentMethod.toLowerCase(),
            coupon: appliedCoupon?.code
        });
        setSuccessMessage(response.message || t('topup_success'));
        setSuccess(true);
    } catch (err: any) {
        setError(err.message || 'Top-up failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  // Calculate Finals for display
  const baseAmount = parseFloat(amount) || 0;
  let finalAmount = baseAmount;
  let discountAmount = 0;

  if (appliedCoupon && baseAmount > 0) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = baseAmount * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
    finalAmount = Math.max(0, baseAmount - discountAmount);
  }

  const isBalanceInsufficient = paymentMethod === 'WALLET' && currentTenant.balance < finalAmount;

  return (
    <div className="max-w-4xl mx-auto">
       {/* Header Section */}
       <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl shadow-2xl shadow-brand-500/20 mb-4">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{t('nav_mobile')}</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Instantly recharge mobile credit for any major operator. Secure, fast, and reliable.</p>
       </div>

      {success ? (
        <div className="max-w-md mx-auto bg-dark-800 border border-green-500/30 rounded-2xl p-8 text-center animate-in zoom-in-95 shadow-2xl shadow-green-900/20">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{successMessage}</h2>
          <div className="bg-dark-900/50 rounded-lg p-4 mb-6 border border-dark-700">
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">{t('number_label')}</span>
               <span className="text-white font-mono">{phoneNumber}</span>
             </div>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">{t('operator')}</span>
               <span className="text-white">{detectedOperator || 'Detected'}</span>
             </div>
             <div className="border-t border-dark-700 my-2 pt-2 flex justify-between font-bold">
               <span className="text-gray-400">{t('amount')}</span>
               <span className="text-brand-400">{convertPrice(finalAmount)}</span>
             </div>
          </div>
          <Button onClick={() => { setSuccess(false); setPhoneNumber(''); setAmount(''); setAppliedCoupon(null); setCouponCode(''); }} variant="primary" className="w-full">
            {t('make_another_topup')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Input Form */}
           <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleRecharge} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                {/* Phone Input Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t('phone_number')}</label>
                     {detectedOperator && (
                        <span className="flex items-center text-brand-400 font-bold text-sm bg-brand-900/30 px-3 py-1 rounded-full border border-brand-500/20 animate-in fade-in">
                            <Signal className="w-3 h-3 mr-2" /> {detectedOperator}
                        </span>
                     )}
                   </div>
                   
                   <div className="relative group">
                     <Input 
                        placeholder="079 123 4567"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        icon={<Smartphone className="w-5 h-5 group-focus-within:text-brand-400 transition-colors" />}
                        required
                        className="text-lg font-mono tracking-wider"
                        maxLength={10}
                      />
                   </div>
                </div>

                {/* Amount Section */}
                <div className={`transition-all duration-500 ${phoneNumber.length >= 3 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4 grayscale pointer-events-none'}`}>
                   <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">{t('amount')} (Min 10)</label>
                   
                   {/* Preset Buttons - Starting from 10 to match backend min:10 */}
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                     {[10, 20, 50, 100, 200, 500].map((val) => (
                       <button
                         key={val}
                         type="button"
                         onClick={() => setAmount(val.toString())}
                         className={`py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 relative overflow-hidden ${
                           amount === val.toString()
                             ? 'border-brand-500 bg-brand-500/10 text-white shadow-lg shadow-brand-500/10 transform scale-[1.02]' 
                             : 'border-dark-700 bg-dark-900/50 text-gray-400 hover:border-dark-500 hover:bg-dark-800'
                         }`}
                       >
                         {convertPrice(val)}
                         {amount === val.toString() && <div className="absolute inset-0 bg-brand-500/5"></div>}
                       </button>
                     ))}
                   </div>

                   {/* Custom Amount Input */}
                   <div className="relative">
                      <Input 
                        placeholder={t('enter_custom_amount')}
                        type="number"
                        min="10"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={<Hash className="w-5 h-5" />}
                        className="bg-dark-900/50"
                      />
                   </div>
                </div>
              </form>
           </div>

           {/* Right Column: Order Summary & Coupon */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl sticky top-24">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-brand-400" /> {t('summary')}
                 </h3>

                 {/* Payment Method Selector */}
                 <div className="mb-6 space-y-3">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
                     <div 
                        onClick={() => setPaymentMethod('WALLET')}
                        className={`cursor-pointer rounded-lg p-3 border transition-all flex justify-between items-center ${paymentMethod === 'WALLET' ? 'border-brand-500 bg-brand-500/5' : 'border-dark-700 bg-dark-900/50'}`}
                     >
                        <div className="flex items-center space-x-2">
                           <Wallet className="w-4 h-4 text-brand-400" />
                           <span className="text-sm font-medium">Wallet</span>
                        </div>
                        <div className="text-xs text-gray-400">{convertPrice(currentTenant.balance)}</div>
                     </div>

                     <div 
                        onClick={() => setPaymentMethod('STRIPE')}
                        className={`cursor-pointer rounded-lg p-3 border transition-all flex justify-between items-center ${paymentMethod === 'STRIPE' ? 'border-brand-500 bg-brand-500/5' : 'border-dark-700 bg-dark-900/50'}`}
                     >
                        <div className="flex items-center space-x-2">
                           <CreditCard className="w-4 h-4 text-brand-400" />
                           <span className="text-sm font-medium">Stripe / Card</span>
                        </div>
                     </div>
                 </div>

                 {paymentMethod === 'STRIPE' && (
                     <div className="mb-6">
                         <StripePaymentForm isLoading={isLoading} />
                     </div>
                 )}
                 
                 {/* Coupon Section */}
                 <div className="mb-6 pb-6 border-b border-dark-700">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('coupon_code')}</label>
                    <div className="flex space-x-2">
                       <div className="relative flex-grow">
                         <input 
                            type="text" 
                            placeholder={t('promo_code_placeholder')}
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={!!appliedCoupon || isValidatingCoupon}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none disabled:opacity-50 font-mono uppercase"
                         />
                         <Tag className="w-4 h-4 text-gray-500 absolute top-2.5 right-3 rtl:left-3 rtl:right-auto" />
                       </div>
                       {appliedCoupon ? (
                         <button onClick={removeCoupon} className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-colors">
                            <X className="w-5 h-5" />
                         </button>
                       ) : (
                         <button 
                             onClick={handleApplyCoupon} 
                             disabled={!couponCode || isValidatingCoupon}
                             className="bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-900/20 disabled:opacity-50"
                         >
                            {isValidatingCoupon ? '...' : t('apply')}
                         </button>
                       )}
                    </div>
                    {couponMessage && (
                       <div className={`mt-2 text-xs flex items-center font-medium animate-in fade-in ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {couponMessage.type === 'success' ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                          {couponMessage.text}
                       </div>
                    )}
                 </div>

                 {/* Totals */}
                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-gray-400 text-sm">
                       <span>{t('topup_amount')}</span>
                       <span>{convertPrice(baseAmount)}</span>
                    </div>
                    {discountAmount > 0 && (
                       <div className="flex justify-between text-brand-400 text-sm font-medium">
                          <span>{t('discount')}</span>
                          <span>-{convertPrice(discountAmount)}</span>
                       </div>
                    )}
                    <div className="border-t border-dark-700 pt-3 flex justify-between text-white font-bold text-xl">
                       <span>{t('total')}</span>
                       <span>{convertPrice(finalAmount)}</span>
                    </div>
                 </div>

                 {isBalanceInsufficient && paymentMethod === 'WALLET' && (
                     <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Insufficient Balance
                     </div>
                 )}
                 
                 {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {error}
                    </div>
                 )}

                 <Button 
                   onClick={handleRecharge} 
                   className="w-full py-4 text-lg shadow-brand-500/20" 
                   disabled={!phoneNumber || !amount || parseFloat(amount) < 10 || (isBalanceInsufficient && paymentMethod === 'WALLET')} 
                   isLoading={isLoading}
                 >
                   <Zap className="w-5 h-5 mr-2 fill-current" />
                   {t('btn_place_order')}
                 </Button>
                 
                 <p className="text-center text-xs text-gray-500 mt-4">
                    {t('secure_transaction')}
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
