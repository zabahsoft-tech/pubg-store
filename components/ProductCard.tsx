import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Button } from './ui/Button';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { convertPrice } = useStore();

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/10 group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="relative h-40 overflow-hidden bg-dark-900 cursor-pointer block">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
        
        {product.bonus && (
          <div className="absolute top-2 right-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            {product.bonus}
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="flex justify-between items-start mb-1 hover:text-brand-400 transition-colors">
          <h3 className="text-white font-bold text-sm leading-tight">{product.name}</h3>
        </Link>
        
        {product.category === 'PHYSICAL' ? (
             <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        ) : (
             <div className="text-brand-400 font-mono text-lg font-bold mb-3">{product.amount}</div>
        )}
        
        <div className="mt-auto pt-3 border-t border-dark-700 flex items-center justify-between">
          <span className="text-lg font-bold text-white">{convertPrice(product.price)}</span>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onSelect(product)}
            className="!py-1.5 !px-3 hover:bg-brand-600 hover:text-white transition-colors"
          >
            {product.category === 'PHYSICAL' ? <Package className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};