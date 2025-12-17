
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { User, Mail, Phone, CheckCircle, Save, Wallet, Plus, ChevronDown, ChevronUp, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, t, wallet, transactions, convertPrice, creditWallet } = useStore();
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Top Up State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileSuccess(false);
    
    try {
      await updateProfile(formData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(Number(topUpAmount))) return;
    
    setIsTopUpLoading(true);
    setTopUpSuccess(false);

    try {
        await creditWallet(Number(topUpAmount), 'stripe');
        setTopUpSuccess(true);
        setTopUpAmount('');
        setTimeout(() => setTopUpSuccess(false), 4000);
    } catch (error) {
        console.error(error);
    } finally {
        setIsTopUpLoading(false);
    }
  };

  const balance = wallet ? wallet.balance : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center">
        <User className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-brand-500" />
        {t('profile_title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Wallet & Transactions */}
         <div className="lg:col-span-1 space-y-6">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-brand-900 to-dark-900 border border-brand-500/30 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-brand-300 text-sm font-bold uppercase tracking-wider flex items-center">
                        <Wallet className="w-4 h-4 mr-2" /> {t('wallet_balance')}
                     </span>
                  </div>
                  <div className="text-4xl font-mono font-bold text-white mb-6">
                      {convertPrice(balance)}
                  </div>
                  
                  <Button 
                    onClick={() => setIsTopUpOpen(!isTopUpOpen)}
                    className="w-full bg-white text-brand-900 hover:bg-gray-100"
                    size="sm"
                  >
                     <Plus className="w-4 h-4 mr-2" /> {t('add_funds')}
                  </Button>
              </div>

              {isTopUpOpen && (
                 <div className="p-6 bg-dark-800/90 border-t border-brand-500/20 animate-in slide-in-from-top-2">
                    {topUpSuccess ? (
                        <div className="flex flex-col items-center justify-center py-2 text-green-400">
                            <CheckCircle className="w-8 h-8 mb-2" />
                            <p className="font-bold text-sm">Funds Added!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleTopUpSubmit} className="space-y-4">
                           <div>
                               <div className="relative">
                                   <Input 
                                      type="number"
                                      value={topUpAmount}
                                      onChange={(e) => setTopUpAmount(e.target.value)}
                                      placeholder="Amount (USD)"
                                      min="1"
                                      step="0.01"
                                      required
                                      className="font-mono text-sm"
                                   />
                               </div>
                           </div>
                           <StripePaymentForm isLoading={isTopUpLoading} />
                           <Button type="submit" isLoading={isTopUpLoading} className="w-full" size="sm">
                              Pay Now
                           </Button>
                        </form>
                    )}
                 </div>
             )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
               <h3 className="text-white font-bold mb-4">{t('recent_transactions')}</h3>
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {transactions.length === 0 ? (
                     <p className="text-gray-500 text-sm text-center py-4">No transactions yet.</p>
                  ) : (
                     transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-dark-700/50">
                           <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                 {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                              </div>
                              <div>
                                 <p className="text-white text-sm font-bold capitalize">{tx.type} ({tx.pm_type})</p>
                                 <p className="text-xs text-gray-500">{new Date(tx.created_at || '').toLocaleDateString()}</p>
                              </div>
                           </div>
                           <span className={`font-mono font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                              {tx.type === 'credit' ? '+' : '-'}{convertPrice(tx.amount)}
                           </span>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>

         {/* Right Column: Profile Form */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 md:p-8">
               <h2 className="text-xl font-bold text-white mb-6">Personal Details</h2>
               <form onSubmit={handleProfileSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                     label={t('full_name')}
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     icon={<User className="w-5 h-5" />}
                  />
                  
                  <Input 
                     label={t('email_address')}
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     icon={<Mail className="w-5 h-5" />}
                     disabled
                  />
               </div>

               <Input 
                  label={t('phone_number')}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  icon={<Phone className="w-5 h-5" />}
                  placeholder="+1 234 567 8900"
               />

               <div className="pt-4 flex items-center justify-between border-t border-dark-700 mt-6">
                  <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">Account Status:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {user.emailVerified ? t('verified_status') : t('unverified_status')}
                      </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                     {profileSuccess && (
                        <span className="text-green-500 flex items-center text-sm font-medium animate-in fade-in">
                           <CheckCircle className="w-5 h-5 mr-2" />
                           {t('success_msg')}
                        </span>
                     )}
                     <Button type="submit" isLoading={isProfileLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        {t('save_changes')}
                     </Button>
                  </div>
               </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};
