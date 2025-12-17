
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Gamepad2, ShoppingBag, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../components/ui/RichTextRenderer';
import { getStorageUrl } from '../services/api';

export const Home: React.FC = () => {
  const { addToCart, t, blogPosts, products, categories, language } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const featuredBlogs = blogPosts.filter(b => b.is_featured && b.is_active);

  useEffect(() => {
    if (featuredBlogs.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredBlogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBlogs.length]);

  const ProductSwiper = ({ items }: { items: Product[] }) => (
    <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 rtl:space-x-reverse snap-x snap-mandatory scrollbar-hide">
      {items.map(p => (
        <div key={p.id} className="min-w-[200px] md:min-w-[240px] snap-center">
          <ProductCard product={p} onSelect={addToCart} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-16 pb-12">
      
      {/* CMS Driven Slider */}
      {featuredBlogs.length > 0 && (
        <section className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-dark-700 group">
          {featuredBlogs.map((blog, index) => (
            <div 
              key={blog.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent z-10"></div>
              <img src={getStorageUrl(blog.thumbnail)} alt={language === 'fa' ? blog.fa_title : blog.en_title} className="w-full h-full object-cover" />
              
              <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 max-w-2xl rtl:right-0 rtl:left-auto">
                <span className="inline-block px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full mb-3">{t('featured_tag')}</span>
                <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg leading-tight line-clamp-2">
                    {language === 'fa' ? blog.fa_title : blog.en_title}
                </h2>
                <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 line-clamp-2 hidden md:block">
                    {stripHtml(language === 'fa' ? blog.fa_description : blog.en_description)}
                </p>
                <Link to={`/blog/${blog.slug}`} className="flex items-center space-x-2 text-brand-400 font-bold hover:text-brand-300 transition-colors">
                  <span>{t('hero_read_more')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-6 right-6 z-30 flex space-x-2 rtl:left-6 rtl:right-auto">
            {featuredBlogs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? 'w-6 md:w-8 bg-brand-500' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Category Sections */}
      {categories.map(category => {
          const categoryProducts = products.filter(p => p.product_category_id === category.id);
          
          if (categoryProducts.length === 0) return null;

          const catName = language === 'fa' ? category.fa_name : category.en_name;
          // Just a simple visual distinction for Physical vs Digital
          const isPhysical = category.slug.includes('merch') || category.slug.includes('physical');
          const Icon = isPhysical ? ShoppingBag : Gamepad2;
          const iconColor = isPhysical ? 'text-purple-500' : 'text-brand-500';
          const borderColor = isPhysical ? 'border-purple-500' : 'border-brand-500';

          return (
             <section key={category.id} className="space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-dark-700 pb-4">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                    <h2 className="text-2xl font-bold text-white">{catName}</h2>
                </div>
                
                <div className="space-y-4">
                    <h3 className={`text-lg font-semibold text-gray-400 pl-2 border-l-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-2 ${borderColor}`}>
                       Best Sellers
                    </h3>
                    <ProductSwiper items={categoryProducts} />
                </div>
             </section>
          );
      })}
    </div>
  );
};
