import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { BlogPost, Product } from '../types';
import { Sparkles, Gamepad2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { addToCart, t, blogPosts } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter products for sections
  const pubgProducts = PRODUCTS.filter(p => p.category === 'PUBG');
  const imoProducts = PRODUCTS.filter(p => p.category === 'IMO');
  const physicalProducts = PRODUCTS.filter(p => p.category === 'PHYSICAL');

  const featuredBlogs = blogPosts.filter(b => b.isFeatured);

  // Auto-rotate slider
  useEffect(() => {
    if (featuredBlogs.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredBlogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBlogs.length]);

  return (
    <div className="space-y-16 pb-12">
      
      {/* CMS Driven Slider */}
      {featuredBlogs.length > 0 && (
        <section className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-dark-700 group">
          {featuredBlogs.map((blog, index) => (
            <div 
              key={blog.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent z-10"></div>
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-2xl rtl:right-0 rtl:left-auto">
                <span className="inline-block px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full mb-3">Featured</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight">{blog.title}</h2>
                <p className="text-gray-300 text-lg mb-6 line-clamp-2">{blog.excerpt}</p>
                <Link to={`/blog/${blog.id}`} className="flex items-center space-x-2 text-brand-400 font-bold hover:text-brand-300 transition-colors">
                  <span>{t('hero_read_more')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
          
          {/* Slider Dots */}
          <div className="absolute bottom-6 right-6 z-30 flex space-x-2 rtl:left-6 rtl:right-auto">
            {featuredBlogs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? 'w-8 bg-brand-500' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Module 1: Digital Services */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-dark-700 pb-4">
          <Gamepad2 className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-white">{t('digital_section')}</h2>
        </div>

        {/* PUBG Subsection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-400 pl-2 border-l-4 border-brand-500 rtl:border-l-0 rtl:border-r-4 rtl:pr-2">{t('pubg_section')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pubgProducts.map(p => <ProductCard key={p.id} product={p} onSelect={addToCart} />)}
          </div>
        </div>

        {/* IMO Subsection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-400 pl-2 border-l-4 border-blue-500 rtl:border-l-0 rtl:border-r-4 rtl:pr-2">{t('imo_section')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {imoProducts.map(p => <ProductCard key={p.id} product={p} onSelect={addToCart} />)}
          </div>
        </div>
      </section>

      {/* Module 2: Physical Products */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-dark-700 pb-4">
          <ShoppingBag className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">{t('physical_section')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {physicalProducts.map(p => <ProductCard key={p.id} product={p} onSelect={addToCart} />)}
        </div>
      </section>

    </div>
  );
};