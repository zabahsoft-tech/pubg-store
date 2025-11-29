import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, CheckCircle, Building2, User as UserIcon, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, topUpWallet, currentTenant, switchTenant, verifyEmail, t } = useStore();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  // Filter transactions for current tenant
  const tenantTransactions = user.transactions.filter(tx => tx.tenantId === currentTenant.id);

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

  const handleVerify = async () => {
    setIsVerifying(true);
    await verifyEmail();
    setIsVerifying(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sidebar / Tenant Switcher */}
      <aside className="w-full md:w-64 space-y-6">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('switch_workspace')}</h3>
          <div className="space-y-2">
            {user.tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => switchTenant(tenant.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  currentTenant.id === tenant.id 
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/50' 
                    : 'hover:bg-dark-700 text-gray-300 border border-transparent'
                }`}
              >
                {tenant.type === 'PERSONAL' ? <UserIcon className="w-5 h-5 mr-3" /> : <Building2 className="w-5 h-5 mr-3" />}
                <div className="text-left">
                  <div className="font-medium text-sm">{tenant.name}</div>
                  <div className="text-xs opacity-70">${tenant.balance.toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Status Card */}
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700 flex items-center space-x-3">
          <div className={`p-2 rounded-full ${user.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            {user.emailVerified ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{user.name}</div>
            <div className="text-xs text-gray-400">{user.emailVerified ? t('verified_status') : t('unverified_status')}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Email Verification Banner */}
        {!user.emailVerified && (
          <div className="bg-gradient-to-r from-yellow-900/50 to-dark-800 border border-yellow-700/50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-white font-bold">{t('verify_email_title')}</h3>
                <p className="text-gray-400 text-sm">{t('verify_email_desc')}</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={handleVerify} isLoading={isVerifying} className="whitespace-nowrap">
              {t('verify_btn')}
            </Button>
          </div>
        )}

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32 text-brand-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-dark-700 text-xs px-2 py-0.5 rounded text-gray-300">{currentTenant.name}</span>
            </div>
            <h2 className="text-gray-400 font-medium mb-1">{t('wallet_balance')}</h2>
            <div className="text-4xl md:text-5xl font-bold text-white mb-8">
              ${currentTenant.balance.toFixed(2)}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowTopUp(!showTopUp)}>
                <CreditCard className="w-5 h-5 mr-2" />
                {t('add_funds')}
              </Button>
            </div>
          </div>

          {/* Top Up Form */}
          {showTopUp && (
            <div className="mt-8 pt-8 border-t border-dark-700 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-semibold text-white mb-4">Top Up {currentTenant.name}</h3>
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
            {t('recent_transactions')}
          </h3>
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
            {tenantTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No transactions found for this workspace.</div>
            ) : (
              <div className="divide-y divide-dark-700">
                {tenantTransactions.map((tx) => (
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
    </div>
  );
};