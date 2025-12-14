import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, ArrowLeft, Save, Image as ImageIcon, DollarSign, Tag, Globe } from 'lucide-react';
import { Product } from '../../types';

export const ProductEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { user, products, categories, addProduct, updateProduct, language } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Product>>({
    en_name: '',
    fa_name: '',
    product_category_id: 1,
    price: 0,
    en_description: '',
    fa_description: '',
    thumbnail: 'https://picsum.photos/200',
    is_featured: false,
    is_active: true,
    slug: ''
  });

  const [imageUrl, setImageUrl] = useState<string>('https://picsum.photos/200');

  useEffect(() => {
    if (isEditing && id) {
      const prod = products.find(p => p.id === Number(id));
      if (prod) {
        setFormData(prod);
        setImageUrl(prod.thumbnail || '');
      } else {
        navigate('/admin/products');
      }
    }
  }, [id, isEditing, products, navigate]);

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
         <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
         <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.en_name || !formData.price) return;

    const processedData = {
        ...formData,
        thumbnail: imageUrl,
        slug: formData.slug || formData.en_name?.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
        // Fill farsi fields with english if empty for now
        fa_name: formData.fa_name || formData.en_name,
        fa_description: formData.fa_description || formData.en_description
    };

    if (isEditing && id) {
      await updateProduct(Number(id), processedData);
    } else {
      await addProduct(processedData as Omit<Product, 'id'>);
    }
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button variant="secondary" onClick={() => navigate('/admin/products')} className="p-2">
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6 bg-dark-800 p-6 rounded-xl border border-dark-700">
           <h3 className="font-bold text-white border-b border-dark-700 pb-2">Basic Information</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="English Name" 
                 value={formData.en_name} 
                 onChange={e => setFormData({ ...formData, en_name: e.target.value })}
                 required
                 placeholder="e.g., 60 UC Pack"
               />
               
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                 <select 
                    className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500"
                    value={formData.product_category_id}
                    onChange={e => setFormData({ ...formData, product_category_id: Number(e.target.value) })}
                 >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {language === 'fa' ? cat.fa_name : cat.en_name}
                        </option>
                    ))}
                 </select>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Farsi Name" 
                 value={formData.fa_name} 
                 onChange={e => setFormData({ ...formData, fa_name: e.target.value })}
                 placeholder="Persian translation"
                 dir="rtl"
                 icon={<Globe className="w-4 h-4" />}
               />
               
               <Input 
                 label="Price (USD)" 
                 type="number"
                 step="0.01"
                 value={formData.price} 
                 onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                 required
                 icon={<DollarSign className="w-4 h-4" />}
               />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Description (EN)</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[120px]"
               value={formData.en_description || ''}
               onChange={e => setFormData({ ...formData, en_description: e.target.value })}
               placeholder="Full details about the product..."
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Description (FA)</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[120px]"
               value={formData.fa_description || ''}
               onChange={e => setFormData({ ...formData, fa_description: e.target.value })}
               placeholder="توضیحات محصول..."
               dir="rtl"
             />
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-6">
              <h3 className="font-bold text-white border-b border-dark-700 pb-2">Media & Extras</h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL</label>
                <div className="relative">
                  <Input 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)}
                    icon={<ImageIcon className="w-4 h-4" />}
                  />
                </div>
                {imageUrl && (
                  <div className="mt-3 aspect-square rounded-lg overflow-hidden border border-dark-600 bg-dark-900">
                     <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <Input 
                 label="Slug (URL)" 
                 value={formData.slug || ''} 
                 onChange={e => setFormData({ ...formData, slug: e.target.value })}
                 placeholder="Auto-generated if empty"
                 icon={<Tag className="w-4 h-4" />}
              />
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700">
                  <label htmlFor="active" className="text-sm text-gray-300 select-none cursor-pointer">
                    Active
                  </label>
                  <input 
                    type="checkbox" 
                    id="active"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800"
                  />
                </div>

                <div className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700">
                  <label htmlFor="featured" className="text-sm text-gray-300 select-none cursor-pointer">
                    Featured
                  </label>
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
                  {isEditing ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};