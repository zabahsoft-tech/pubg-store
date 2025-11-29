import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { ProductType } from '../types';
import { Search, Filter } from 'lucide-react';

export const Home: React.FC = () => {
  const [filter, setFilter] = useState<ProductType | 'ALL'>('ALL');
  const navigate = useNavigate();
  const { setCartItem } = useStore();

  const filteredProducts = PRODUCTS.filter(p => filter === 'ALL' || p.type === filter);

  const handleBuy = (product: any) => {
    setCartItem(product);
    navigate('/checkout');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative bg-dark-800 rounded-2xl p-8 md:p-12 overflow-hidden border border-dark-700">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-900/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Instant Top-Up for <span className="text-brand-400">Legends</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Securely purchase UC, Gems, and credits. Delivered instantly to your game account. 
            Accepting Wallet & Stripe.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setFilter('PUBG')}
              className="px-6 py-2 rounded-full bg-dark-700 border border-dark-600 hover:border-brand-500 text-white transition-all"
            >
              PUBG Mobile
            </button>
            <button 
              onClick={() => setFilter('IMO')}
              className="px-6 py-2 rounded-full bg-dark-700 border border-dark-600 hover:border-brand-500 text-white transition-all"
            >
              IMO Gems
            </button>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Filter className="w-5 h-5 mr-2 text-brand-500" />
            Available Packages
          </h2>
          
          <div className="flex bg-dark-800 p-1 rounded-lg border border-dark-700">
            {(['ALL', 'PUBG', 'IMO'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === type 
                    ? 'bg-brand-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type === 'ALL' ? 'All Games' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelect={handleBuy} 
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found for this category.
          </div>
        )}
      </section>
    </div>
  );
};