import React from 'react';
import { CreditCard, Lock, Calendar } from 'lucide-react';
import { Input } from './ui/Input';

interface StripePaymentFormProps {
  isLoading?: boolean;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ isLoading }) => {
  return (
    <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700 space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between mb-2">
         <span className="text-sm font-medium text-gray-300">Card Details</span>
         <div className="flex space-x-2 opacity-50">
            <div className="w-8 h-5 bg-gray-600 rounded"></div>
            <div className="w-8 h-5 bg-gray-600 rounded"></div>
            <div className="w-8 h-5 bg-gray-600 rounded"></div>
         </div>
      </div>

      <div className="relative">
         <Input 
           placeholder="0000 0000 0000 0000"
           icon={<CreditCard className="w-4 h-4" />}
           className="font-mono tracking-wider"
           maxLength={19}
           disabled={isLoading}
         />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Input 
           placeholder="MM / YY"
           icon={<Calendar className="w-4 h-4" />}
           className="font-mono"
           maxLength={5}
           disabled={isLoading}
         />
         <Input 
           placeholder="CVC"
           icon={<Lock className="w-4 h-4" />}
           className="font-mono"
           type="password"
           maxLength={3}
           disabled={isLoading}
         />
      </div>
      
      <div className="flex items-center text-xs text-gray-500 justify-center pt-2">
         <Lock className="w-3 h-3 mr-1" />
         Payments processed securely by Stripe
      </div>
    </div>
  );
};