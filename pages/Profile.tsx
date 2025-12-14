import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { User, Mail, Phone, CheckCircle, Save, Wallet, Plus, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, t, currentTenant, convertPrice, topUpWallet } = useStore();
  
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
        await topUpWallet(Number(topUpAmount));
        setTopUpSuccess(true);
        setTopUpAmount('');
        setTimeout(() => setTopUpSuccess(false), 4000);
    } catch (error) {
        console.error(error);
    } finally {
        setIsTopUpLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center">
        <User className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-brand-500" />
        {t('profile_title')}
      </h1>

      {/* Wallet Section */}
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-xl">
         <div className="p-6 md:p-8 flex items-center justify-between">
            <div>
               <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Current Balance</h2>
               <div className="text-4xl font-mono font-bold text-white flex items-baseline">
                   {convertPrice(currentTenant.balance)}
               </div>
            </div>
            <div className="p-4 bg-brand-500/10 rounded-full">
               <Wallet className="w-8 h-8 text-brand-500" />
            </div>
         </div>
         
         <div className="bg-dark-900/50 border-t border-dark-700">
             <button 
                onClick={() => setIsTopUpOpen(!isTopUpOpen)}
                className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
             >
                 <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Funds to Wallet</span>
                 {isTopUpOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
             </button>
             
             {isTopUpOpen && (
                 <div className="p-6 border-t border-dark-700 bg-dark-800/50 animate-in slide-in-from-top-2">
                    {topUpSuccess ? (
                        <div className="flex flex-col items-center justify-center py-6 text-green-400">
                            <CheckCircle className="w-12 h-12 mb-3" />
                            <p className="font-bold">Funds Added Successfully!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleTopUpSubmit} className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-400 mb-1.5">Amount to Add (USD)</label>
                               <div className="relative">
                                   <Input 
                                      type="number"
                                      value={topUpAmount}
                                      onChange={(e) => setTopUpAmount(e.target.value)}
                                      placeholder="e.g., 50.00"
                                      min="1"
                                      step="0.01"
                                      required
                                      icon={<DollarSign className="w-4 h-4" />}
                                      className="font-mono text-lg"
                                   />
                               </div>
                           </div>
                           
                           <StripePaymentForm isLoading={isTopUpLoading} />
                           
                           <Button type="submit" isLoading={isTopUpLoading} className="w-full">
                              Pay & Top Up
                           </Button>
                        </form>
                    )}
                 </div>
             )}
         </div>
      </div>

      {/* Profile Details */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6">Personal Details</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
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
            disabled // Often email is the key and immutable without special flow
          />

          <Input 
            label={t('phone_number')}
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            icon={<Phone className="w-5 h-5" />}
            placeholder="+1 234 567 8900"
          />

          <div className="pt-4 flex items-center justify-between">
            {profileSuccess ? (
              <span className="text-green-500 flex items-center text-sm font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('success_msg')}
              </span>
            ) : <span></span>}
            
            <Button type="submit" isLoading={isProfileLoading}>
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('save_changes')}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
         <h2 className="text-lg font-semibold text-white mb-4">{t('account_status')}</h2>
         <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-400">{t('email_address')}:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {user.emailVerified ? t('verified_status') : t('unverified_status')}
            </span>
         </div>
      </div>
    </div>
  );
};