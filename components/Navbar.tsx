
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Wallet, Menu, UserCircle, Globe, ShoppingCart, ChevronDown, Building2, Store, Newspaper, LogOut, LayoutDashboard, User, Smartphone, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, cart, language, setLanguage, currency, setCurrency, currentTenant, switchTenant, wallet, t } = useStore();
  const location = useLocation();
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  
  const tenantRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5';

  const toggleLanguage = () => setLanguage(language === 'en' ? 'fa' : 'en');
  const toggleCurrency = () => setCurrency(currency === 'USD' ? 'AFN' : 'USD');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tenantRef.current && !tenantRef.current.contains(event.target as Node)) {
        setIsTenantOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTenantSwitch = (tenantId: string) => {
    switchTenant(tenantId);
    setIsTenantOpen(false);
  };

  // Mobile Bottom Nav Item Component
  const MobileNavItem = ({ to, icon: Icon, label, count }: { to: string, icon: any, label: string, count?: number }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'} transition-colors duration-200`}>
        <div className="relative p-1">
          <Icon className={`w-6 h-6 ${active ? 'fill-current/20' : ''}`} strokeWidth={active ? 2.5 : 2} />
          {count !== undefined && count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white border-2 border-dark-900">
              {count}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
      </Link>
    );
  };

  const displayBalance = wallet ? wallet.balance : (currentTenant?.balance || 0);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-dark-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Name */}
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
              <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                 <img 
                   src="https://i.ibb.co/Wpq1jgG/image.png" 
                   alt="Rahat Pay Logo" 
                   className="w-8 h-8 object-contain brightness-0 invert"
                 />
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                Rahat<span className="text-brand-400">Pay</span>
              </span>
            </Link>

            {/* Desktop Nav - Centered & Clean */}
            <div className="hidden md:flex items-center bg-dark-800/50 rounded-full p-1 border border-dark-700/50">
              <Link to="/" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive('/')}`}>
                 <span className="mr-2">🛍️</span> {t('nav_store')}
              </Link>
              <Link to="/mobile-topup" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive('/mobile-topup')}`}>
                 <span className="mr-2">📱</span> {t('nav_mobile')}
              </Link>
              <Link to="/blog" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive('/blog')}`}>
                   <span className="mr-2">📰</span> {t('nav_blog')}
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              
              {/* Wallet Pill */}
              <div className="hidden sm:flex items-center bg-dark-800 rounded-full border border-dark-700 p-1 pr-4 rtl:pl-4 rtl:pr-1">
                 <div className="flex items-center space-x-2 pl-2 rtl:pr-2 rtl:pl-0 text-emerald-400">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold font-mono">
                      {currency === 'USD' ? `$${displayBalance.toLocaleString()}` : `${Math.floor(displayBalance * 75).toLocaleString()} ؋`}
                    </span>
                 </div>
              </div>

              {/* Utilities */}
              <div className="flex items-center space-x-1 bg-dark-800 rounded-full p-1 border border-dark-700">
                 <button onClick={toggleCurrency} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-700 text-gray-400 hover:text-white transition-colors text-xs font-bold">
                    {currency === 'USD' ? '💵' : '🇦🇫'}
                 </button>
                 <button onClick={toggleLanguage} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-700 text-gray-400 hover:text-white transition-colors text-xs font-bold">
                    {language === 'en' ? '🇬🇧' : '🇮🇷'}
                 </button>
              </div>

              {/* Desktop Cart (Hidden on Mobile) */}
              <Link to="/checkout" className="hidden md:flex relative w-10 h-10 items-center justify-center bg-dark-800 hover:bg-brand-500 hover:text-white rounded-full border border-dark-700 transition-all group">
                <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 group-hover:bg-white group-hover:text-brand-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-dark-900">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              {/* User Avatar Dropdown */}
              <div className="relative" ref={userRef}>
                <button 
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="w-10 h-10 rounded-full border-2 border-dark-700 hover:border-brand-500 transition-colors overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <div className={`w-full h-full flex items-center justify-center bg-dark-800 ${user.emailVerified ? 'text-brand-400' : 'text-gray-400'}`}>
                     <UserCircle className="w-full h-full p-0.5" />
                  </div>
                </button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                     {/* User Header */}
                     <div className="p-5 border-b border-dark-700 bg-dark-800/50">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm truncate max-w-[140px]">{user.name}</p>
                             <p className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs">
                          <span className={`flex items-center px-2 py-0.5 rounded-md ${user.emailVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                             {user.emailVerified ? '✅ Verified' : '⚠️ Unverified'}
                          </span>
                        </div>
                     </div>
                     
                     {/* Menu Items */}
                     <div className="p-2 space-y-1">
                        {user.isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-yellow-400 hover:bg-dark-700 hover:text-yellow-300 transition-colors bg-yellow-500/5"
                          >
                             <span className="p-1.5 bg-yellow-500/10 rounded-lg"><ShieldCheck className="w-4 h-4" /></span>
                             <span>{t('nav_admin')} 🛠️</span>
                          </Link>
                        )}
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsUserOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                        >
                           <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><LayoutDashboard className="w-4 h-4" /></span>
                           <span>{t('nav_dashboard')} 📊</span>
                        </Link>
                        
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                        >
                           <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><UserCircle className="w-4 h-4" /></span>
                           <span>{t('profile_title')} 👤</span>
                        </Link>
                     </div>

                     {/* Footer Actions */}
                     <div className="p-2 border-t border-dark-700">
                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                           <LogOut className="w-4 h-4" />
                           <span>{t('sign_out')} 🚪</span>
                        </button>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - App-like Experience */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-t border-dark-800 pb-safe">
        <div className="flex justify-around items-center h-16 px-1">
          <MobileNavItem to="/" icon={Store} label={t('nav_store')} />
          <MobileNavItem to="/mobile-topup" icon={Smartphone} label={t('nav_mobile')} />
          <MobileNavItem to="/checkout" icon={ShoppingCart} label={t('nav_cart')} count={cart.length} />
          <MobileNavItem to="/blog" icon={Newspaper} label={t('nav_blog')} />
          <MobileNavItem to="/dashboard" icon={LayoutDashboard} label={t('my_app')} />
        </div>
      </div>
    </>
  );
};
