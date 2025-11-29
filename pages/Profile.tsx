import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Phone, CheckCircle, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, t } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center">
        <User className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-brand-500" />
        {t('profile_title')}
      </h1>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {success ? (
              <span className="text-green-500 flex items-center text-sm font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('success_msg')}
              </span>
            ) : <span></span>}
            
            <Button type="submit" isLoading={isLoading}>
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('save_changes')}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
         <h2 className="text-lg font-semibold text-white mb-4">{t('order_summary').replace('Order Summary', 'Account Status')}</h2>
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