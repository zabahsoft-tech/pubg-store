import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, ArrowLeft, Save, Image as ImageIcon, Globe, Type } from 'lucide-react';
import { BlogPost } from '../../types';

export const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { user, blogPosts, addBlogPost, updateBlogPost } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    en_title: '',
    fa_title: '',
    slug: '',
    en_description: '',
    fa_description: '',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (isEditing && id) {
      const post = blogPosts.find(p => p.id === Number(id));
      if (post) {
        setFormData(post);
      } else {
        navigate('/admin/blogs');
      }
    }
  }, [id, isEditing, blogPosts, navigate]);

  // Security Check
  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
         <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
         <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.en_title || !formData.slug) return;

    if (isEditing && id) {
      updateBlogPost(Number(id), formData);
    } else {
      addBlogPost(formData as Omit<BlogPost, 'id' | 'created_at'>);
    }
    navigate('/admin/blogs');
  };

  const handleSlugGen = () => {
     if (formData.en_title) {
        setFormData(prev => ({ 
           ...prev, 
           slug: prev.en_title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') 
        }));
     }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/admin/blogs')} className="p-2">
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? 'Edit Blog Post' : 'Create New Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-8 bg-dark-800 p-6 rounded-xl border border-dark-700">
           
           {/* English Section */}
           <div className="space-y-4">
              <div className="flex items-center space-x-2 text-brand-400 font-bold border-b border-dark-700 pb-2">
                 <Globe className="w-4 h-4" /> <span>English Content</span>
              </div>
              
              <Input 
                label="English Title" 
                value={formData.en_title} 
                onChange={e => setFormData({ ...formData, en_title: e.target.value })}
                required
                placeholder="Article Title"
                onBlur={() => !formData.slug && handleSlugGen()}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">English Content</label>
                <textarea 
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[200px]"
                  value={formData.en_description}
                  onChange={e => setFormData({ ...formData, en_description: e.target.value })}
                  placeholder="Write in English..."
                  required
                />
              </div>
           </div>

           {/* Farsi Section */}
           <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-400 font-bold border-b border-dark-700 pb-2">
                 <Globe className="w-4 h-4" /> <span>Farsi Content</span>
              </div>
              
              <Input 
                label="Farsi Title" 
                value={formData.fa_title} 
                onChange={e => setFormData({ ...formData, fa_title: e.target.value })}
                required
                dir="rtl"
                placeholder="عنوان مقاله"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Farsi Content</label>
                <textarea 
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[200px]"
                  value={formData.fa_description}
                  onChange={e => setFormData({ ...formData, fa_description: e.target.value })}
                  dir="rtl"
                  placeholder="متن مقاله..."
                  required
                />
              </div>
           </div>

        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-6 sticky top-24">
              <h3 className="font-bold text-white border-b border-dark-700 pb-2">Settings</h3>

              <Input 
                label="URL Slug" 
                value={formData.slug} 
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                required
                icon={<Type className="w-4 h-4" />}
                className="font-mono text-sm"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Thumbnail URL</label>
                <div className="relative">
                  <Input 
                    value={formData.thumbnail} 
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    icon={<ImageIcon className="w-4 h-4" />}
                  />
                </div>
                {formData.thumbnail && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-dark-600 bg-dark-900">
                     <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700">
                   <label htmlFor="active" className="text-sm text-gray-300 select-none cursor-pointer">Active</label>
                   <input 
                     type="checkbox" 
                     id="active"
                     checked={formData.is_active}
                     onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                     className="w-5 h-5 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800"
                   />
                </div>

                <div className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700">
                   <label htmlFor="featured" className="text-sm text-gray-300 select-none cursor-pointer">Featured (Slider)</label>
                   <input 
                     type="checkbox" 
                     id="featured"
                     checked={formData.is_featured}
                     onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                     className="w-5 h-5 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800"
                   />
                </div>
              </div>

              <div className="pt-4 border-t border-dark-700">
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Post' : 'Publish Post'}
                </Button>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};