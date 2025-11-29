import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Smartphone, Signal, CreditCard, Wallet, CheckCircle } from 'lucide-react';

export const MobileTopUp: React.FC = () => {
  const { user, currentTenant, processPurchase, t, language } = useStore();
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [operator, setOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const operators = [
    { id: 'mci', name: t('operator_mci'), color: 'bg-cyan-500' },
    { id: 'mtn', name: t('operator_mtn'), color: 'bg-yellow-500' },
    { id: 'rightel', name: t('operator_rightel'), color: 'bg-purple-500' },
  ];

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !amount || !operator) return;

    setIsLoading(true);
    setSuccess(false);
    
    try {
      // Simulate purchase
      await processPurchase(
        Number(amount), 
        `${t('mobile_topup_title')} - ${operator} (${phoneNumber})`, 
        'WALLET'
      );
      setSuccess(true);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
       <div className="flex items-center justify-center mb-8">
        <div className="bg-brand-500/10 p-4 rounded-full">
          <Smartphone className="w-10 h-10 text-brand-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-white mb-8">{t('mobile_topup_title')}</h1>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-8 text-center animate-in zoom-in-95">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('success_msg')}</h2>
          <p className="text-gray-400 mb-6">Your top-up for {phoneNumber} has been processed.</p>
          <Button onClick={() => setSuccess(false)} variant="outline">
            Top Up Another
          </Button>
        </div>
      ) : (
        <form onSubmit={handleRecharge} className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6">
          
          <Input 
            label={t('enter_phone')}
            placeholder="0912 345 6789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            icon={<Smartphone className="w-5 h-5" />}
            required
            dir="ltr" // Phone numbers are usually LTR even in RTL layouts
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t('select_operator')}</label>
            <div className="grid grid-cols-3 gap-3">
              {operators.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setOperator(op.id)}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    operator === op.id 
                      ? 'border-brand-500 bg-brand-500/10 text-white' 
                      : 'border-dark-700 bg-dark-900 text-gray-400 hover:border-brand-500/50'
                  }`}
                >
                  <Signal className={`w-6 h-6 mb-2 ${operator === op.id ? 'text-brand-400' : 'text-gray-500'}`} />
                  <span className="text-xs font-medium text-center">{op.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t('amount')}</label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 5, 10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                    amount === val.toString()
                      ? 'border-brand-500 bg-brand-500 text-white' 
                      : 'border-dark-700 bg-dark-900 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
            <Input 
              placeholder="Custom Amount" 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="pt-4 border-t border-dark-700">
             <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-400">{t('pay_wallet')}</span>
                <span className="text-white font-bold">${currentTenant.balance.toFixed(2)}</span>
             </div>
             <Button type="submit" className="w-full" disabled={!operator || !amount || !phoneNumber} isLoading={isLoading}>
                {t('confirm_pay')}
             </Button>
          </div>
        </form>
      )}
    </div>
  );
};