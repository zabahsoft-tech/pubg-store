import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Wallet, Menu, UserCircle, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentTenant, language, setLanguage, t } = useStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-brand-400' : 'text-gray-400 hover:text-white';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="bg-white/5 p-1 rounded-full group-hover:scale-105 transition-transform">
               <img 
                 src="https://i.ibb.co/Wpq1jgG/image.png" 
                 alt="Rahat Pay Logo" 
                 className="w-10 h-10 object-contain"
               />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Rahat <span className="text-brand-400">Pay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>{t('nav_store')}</Link>
            <Link to="/mobile-topup" className={`text-sm font-medium transition-colors ${isActive('/mobile-topup')}`}>{t('nav_mobile')}</Link>
            <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard')}`}>{t('nav_dashboard')}</Link>
          </div>

          {/* Wallet / Profile / Lang */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse text-gray-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{language === 'fa' ? 'فارسی' : 'EN'}</span>
            </button>

            <Link to="/dashboard" className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-dark-800 hover:bg-dark-700 px-3 py-1.5 rounded-full border border-dark-700 transition-colors">
              <Wallet className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-bold text-white">${currentTenant.balance.toFixed(2)}</span>
            </Link>
            
            <Link to="/profile" className="hidden md:block relative group cursor-pointer">
               <UserCircle className={`w-8 h-8 ${user.emailVerified ? 'text-brand-400' : 'text-gray-400'}`} />
               {!user.emailVerified && (
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900"></span>
               )}
            </Link>
            
            <button className="md:hidden text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};