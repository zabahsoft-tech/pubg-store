import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Wallet, Menu, Gamepad2, UserCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-brand-400' : 'text-gray-400 hover:text-white';

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Apex<span className="text-brand-400">TopUp</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>Store</Link>
            <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard')}`}>Transaction History</Link>
          </div>

          {/* Wallet / Profile */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 px-3 py-1.5 rounded-full border border-dark-700 transition-colors">
              <Wallet className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-bold text-white">${user.balance.toFixed(2)}</span>
            </Link>
            
            <button className="md:hidden text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:block">
               <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};