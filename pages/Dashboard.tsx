import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, topUpWallet } = useStore();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    setIsLoading(true);
    try {
      await topUpWallet(Number(amount));
      setAmount('');
      setShowTopUp(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet className="w-32 h-32 text-brand-500" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-gray-400 font-medium mb-1">Total Balance</h2>
          <div className="text-4xl md:text-5xl font-bold text-white mb-8">
            ${user.balance.toFixed(2)}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowTopUp(!showTopUp)}>
              <CreditCard className="w-5 h-5 mr-2" />
              Add Funds
            </Button>
          </div>
        </div>

        {/* Top Up Form (Expandable) */}
        {showTopUp && (
          <div className="mt-8 pt-8 border-t border-dark-700 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Top Up via Stripe</h3>
            <form onSubmit={handleTopUp} className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Amount ($)"
                  type="number"
                  min="5"
                  step="0.01"
                  placeholder="20.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" isLoading={isLoading} disabled={!amount}>
                Pay Securely
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Secure transaction processed by Stripe
            </p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-brand-500" />
          Recent Transactions
        </h3>
        
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {user.transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-dark-700">
              {user.transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-dark-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'DEPOSIT' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-brand-500/10 text-brand-400'
                    }`}>
                      {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()} • {tx.paymentMethod}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-white'
                  }`}>
                    {tx.type === 'DEPOSIT' ? '+' : ''}{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};