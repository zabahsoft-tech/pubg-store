import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, convertPrice, t } = useStore();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call by ID
    const found = PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
    } else {
      // Handle not found
      navigate('/');
    }
  }, [id, navigate]);

  if (!product) return <div className="p-20 text-center text-white">Loading...</div>;

  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Breadcrumb / Back */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {t('back_store')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image */}
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700 shadow-2xl relative group overflow-hidden">
           <div className="aspect-square rounded-xl overflow-hidden bg-dark-900 relative">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
             />
             {product.bonus && (
                <div className="absolute top-4 right-4 bg-brand-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  {product.bonus}
                </div>
             )}
           </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{product.name}</h1>
            {product.amount && <p className="text-2xl text-brand-300 font-mono">{product.amount}</p>}
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <span className="text-3xl font-bold text-white">{convertPrice(product.price)}</span>
             {product.category === 'PHYSICAL' && (
               <span className="text-sm text-green-400 flex items-center bg-green-900/20 px-2 py-1 rounded">
                 <Check className="w-3 h-3 mr-1" /> In Stock
               </span>
             )}
          </div>

          <div className="prose prose-invert">
            <h3 className="text-white font-semibold mb-2">{t('description')}</h3>
            <p className="text-gray-400 leading-relaxed">
              {product.longDescription || product.description || "No description available."}
            </p>
          </div>

          {product.features && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t('features')}</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300 text-sm">
                    <Star className="w-4 h-4 text-brand-500 mr-2 rtl:ml-2 rtl:mr-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-6 border-t border-dark-700 flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => addToCart(product)} className="flex-1">
              <ShoppingCart className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('add_to_cart')}
            </Button>
            <div className="flex items-center justify-center px-4 text-gray-500 text-xs">
              <ShieldCheck className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> Secure Transaction
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-dark-700">
          <h2 className="text-2xl font-bold text-white mb-6">{t('related_products')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onSelect={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};