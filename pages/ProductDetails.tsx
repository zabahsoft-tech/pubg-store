import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, ShoppingCart, Star, ShieldCheck, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, convertPrice, t, products, language, categories } = useStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug || ''),
    enabled: !!slug
  });

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        </div>
    );
  }

  if (!product) {
      return (
          <div className="p-20 text-center text-white">
              <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
              <Button onClick={() => navigate('/')}>{t('back_store')}</Button>
          </div>
      );
  }

  const relatedProducts = products
    .filter(p => p.product_category_id === product.product_category_id && p.id !== product.id)
    .slice(0, 3);

  const name = language === 'fa' ? product.fa_name : product.en_name;
  const description = language === 'fa' ? product.fa_description : product.en_description;
  const image = product.thumbnail || 'https://picsum.photos/200';
  
  const category = categories.find(c => c.id === product.product_category_id);
  const isPhysical = category?.slug.includes('merch');

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
               src={image} 
               alt={name} 
               className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
             />
             {product.discount && product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-brand-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  {product.discount}% OFF
                </div>
             )}
           </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <span className="text-3xl font-bold text-white">{convertPrice(product.price)}</span>
             {isPhysical && (
               <span className="text-sm text-green-400 flex items-center bg-green-900/20 px-2 py-1 rounded">
                 <Check className="w-3 h-3 mr-1" /> {t('in_stock')}
               </span>
             )}
          </div>

          <div className="prose prose-invert">
            <h3 className="text-white font-semibold mb-2">{t('description')}</h3>
            <p className="text-gray-400 leading-relaxed">
              {description || "No description available."}
            </p>
          </div>

          <div className="pt-6 border-t border-dark-700 flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => addToCart(product)} className="flex-1">
              <ShoppingCart className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('add_to_cart')}
            </Button>
            <div className="flex items-center justify-center px-4 text-gray-500 text-xs">
              <ShieldCheck className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t('secure_transaction')}
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