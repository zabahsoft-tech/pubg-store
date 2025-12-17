
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getStorageUrl } from '../services/api';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Calendar, Share2, Loader2, AlertCircle } from 'lucide-react';
import { RichTextRenderer } from '../components/ui/RichTextRenderer';

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // This captures 'id_or_slug' from the route
  const navigate = useNavigate();
  const { t, language } = useStore();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => api.getBlogPost(id || ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
            <p className="text-gray-400">{t('loading')}</p>
        </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
         <div className="flex justify-center mb-4"><AlertCircle className="w-16 h-16 text-gray-600" /></div>
        <h2 className="text-2xl font-bold text-white mb-4">{t('post_not_found')}</h2>
        <button onClick={() => navigate('/')} className="text-brand-400 hover:text-brand-300">{t('back_home')}</button>
      </div>
    );
  }

  const title = language === 'fa' ? post.fa_title : post.en_title;
  const description = language === 'fa' ? post.fa_description : post.en_description;

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
        <img src={getStorageUrl(post.thumbnail)} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full rtl:right-0 rtl:left-auto">
          <div className="flex items-center space-x-4 mb-3 text-gray-300 text-sm">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {post.created_at}</span>
            {post.is_featured && <span className="bg-brand-500 text-white px-2 py-0.5 rounded text-xs font-bold">{t('featured_tag')}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h1>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-lg">
         {/* Use Rich Text Renderer here to handle HTML tags */}
         <div className="min-h-[200px]">
            <RichTextRenderer content={description} />
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
