
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Button } from './ui/Button';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShoppingCart, Package as PackageIcon } from 'lucide-react';
import { stripHtml } from './ui/RichTextRenderer';
import { getStorageUrl } from '../services/api';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { convertPrice, language, categories } = useStore();

  const name = language === 'fa' ? product.fa_name : product.en_name;
  const description = language === 'fa' ? product.fa_description : product.en_description;
  const image = getStorageUrl(product.thumbnail);
  
  // Find category name for logic/display
  const category = categories.find(c => c.id === product.product_category_id);
  const isPhysical = category?.slug === 'gaming-merch' || category?.slug.includes('physical');

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/10 group flex flex-col h-full">
      <Link to={`/product/${product.slug}`} className="relative h-40 overflow-hidden bg-dark-900 cursor-pointer block">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
        
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            {product.discount}% OFF
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`} className="flex justify-between items-start mb-1 hover:text-brand-400 transition-colors">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{name}</h3>
        </Link>
        
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{stripHtml(description)}</p>
        
        <div className="mt-auto pt-3 border-t border-dark-700 flex items-center justify-between">
          <span className="text-lg font-bold text-white">{convertPrice(product.price)}</span>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onSelect(product)}
            className="!py-1.5 !px-3 hover:bg-brand-600 hover:text-white transition-colors"
          >
            {isPhysical ? <PackageIcon className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
