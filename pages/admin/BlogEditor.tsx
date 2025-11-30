import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { BlogPost } from '../../types';

export const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { user, blogPosts, addBlogPost, updateBlogPost } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    isFeatured: false
  });

  useEffect(() => {
    if (isEditing && id) {
      const post = blogPosts.find(p => p.id === id);
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
    if (!formData.title || !formData.content) return;

    if (isEditing && id) {
      updateBlogPost(id, formData);
    } else {
      addBlogPost(formData as Omit<BlogPost, 'id' | 'date'>);
    }
    navigate('/admin/blogs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
        <div className="lg:col-span-2 space-y-6 bg-dark-800 p-6 rounded-xl border border-dark-700">
           <Input 
             label="Post Title" 
             value={formData.title} 
             onChange={e => setFormData({ ...formData, title: e.target.value })}
             required
             placeholder="Enter an engaging title"
           />
           
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Excerpt</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[80px]"
               value={formData.excerpt}
               onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
               placeholder="Brief summary for the homepage slider..."
               required
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Content</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[300px] font-mono text-sm"
               value={formData.content}
               onChange={e => setFormData({ ...formData, content: e.target.value })}
               placeholder="Write your article here..."
               required
             />
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-6">
              <h3 className="font-bold text-white">Publishing Settings</h3>
              
              <div className="flex items-center space-x-3 bg-dark-900 p-3 rounded-lg border border-dark-700">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800"
                />
                <label htmlFor="featured" className="text-sm text-gray-300 select-none cursor-pointer">
                  Feature on Homepage Slider
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image URL</label>
                <div className="relative">
                  <Input 
                    value={formData.image} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    icon={<ImageIcon className="w-4 h-4" />}
                  />
                </div>
                {formData.image && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-dark-600 bg-dark-900">
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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