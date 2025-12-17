
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { RichTextRenderer } from '../components/ui/RichTextRenderer';

export const PageViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useStore();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => api.getPage(slug || ''),
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <p className="text-gray-400">{t('loading')}</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6 max-w-md">The page you are looking for does not exist or has been moved.</p>
        <Button onClick={() => navigate('/')}>{t('back_home')}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-lg bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 transition-colors border border-dark-700"
        >
           <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">{page.title}</h1>
      </div>

      {/* Content */}
      <div className="bg-dark-800 rounded-2xl p-8 md:p-12 border border-dark-700 shadow-xl">
        {/* Render HTML Content safely */}
        <RichTextRenderer content={page.content} />
      </div>
    </div>
  );
};
