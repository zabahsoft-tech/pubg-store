import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogPosts, t } = useStore();
  
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">{t('post_not_found')}</h2>
        <button onClick={() => navigate('/')} className="text-brand-400 hover:text-brand-300">{t('back_home')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {t('back_store')}
      </button>

      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-dark-700">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full rtl:right-0 rtl:left-auto">
          <div className="flex items-center space-x-4 mb-3 text-gray-300 text-sm">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {post.date}</span>
            {post.isFeatured && <span className="bg-brand-500 text-white px-2 py-0.5 rounded text-xs font-bold">{t('featured_tag')}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-lg">
         <div className="prose prose-invert prose-lg max-w-none">
           <p className="text-xl text-brand-100 font-medium mb-8 leading-relaxed border-l-4 border-brand-500 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-4">{post.excerpt}</p>
           <div className="whitespace-pre-wrap text-gray-300 leading-8">
             {post.content}
           </div>
         </div>
         
         <div className="mt-12 pt-6 border-t border-dark-700 flex justify-between items-center">
            <span className="text-gray-500 text-sm">{t('written_by')} Admin</span>
            <button className="flex items-center text-gray-400 hover:text-brand-400 transition-colors">
              <Share2 className="w-4 h-4 mr-2" /> {t('share')}
            </button>
         </div>
      </div>
    </div>
  );
};