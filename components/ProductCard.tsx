import React from 'react';
import { Product } from '../types';
import { Button } from './ui/Button';
import { Sparkles, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/10 group flex flex-col h-full">
      <div className="relative h-32 overflow-hidden bg-dark-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
        {product.bonus && (
          <div className="absolute top-2 right-2 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            {product.bonus}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{product.name}</h3>
        <div className="text-2xl font-bold text-white mb-4">{product.amount}</div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-brand-400">${product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={() => onSelect(product)}
            className="!py-2 !px-3"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
};