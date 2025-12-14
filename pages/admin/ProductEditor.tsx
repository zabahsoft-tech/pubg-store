import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, ArrowLeft, Save, Image as ImageIcon, DollarSign, Tag } from 'lucide-react';
import { Product, ProductType } from '../../types';

export const ProductEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { user, products, addProduct, updateProduct } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'PUBG',
    price: 0,
    amount: '',
    description: '',
    longDescription: '',
    features: [],
    image: 'https://picsum.photos/200',
    bonus: '',
    isFeatured: false
  });

  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(product);
        setFeaturesInput(product.features ? product.features.join('\n') : '');
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
    if (!formData.name || !formData.price) return;

    const processedData = {
        ...formData,
        features: featuresInput.split('\n').filter(f => f.trim() !== '')
    };

    if (isEditing && id) {
      await updateProduct(id, processedData);
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
                 label="Product Name" 
                 value={formData.name} 
                 onChange={e => setFormData({ ...formData, name: e.target.value })}
                 required
                 placeholder="e.g., 60 UC Pack"
               />
               
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                 <select 
                    className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductType })}
                 >
                    <option value="PUBG">PUBG Mobile</option>
                    <option value="IMO">IMO Chat</option>
                    <option value="PHYSICAL">Physical Merch</option>
                 </select>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Price (USD)" 
                 type="number"
                 step="0.01"
                 value={formData.price} 
                 onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                 required
                 icon={<DollarSign className="w-4 h-4" />}
               />
               
               <Input 
                 label="Amount / Size" 
                 value={formData.amount || ''} 
                 onChange={e => setFormData({ ...formData, amount: e.target.value })}
                 placeholder="e.g. 600 UC or 'Large'"
                 icon={<Tag className="w-4 h-4" />}
               />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Description</label>
             <input 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500"
               value={formData.description || ''}
               onChange={e => setFormData({ ...formData, description: e.target.value })}
               placeholder="Brief subtitle for the card view"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Detailed Description</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[120px]"
               value={formData.longDescription || ''}
               onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
               placeholder="Full details about the product..."
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Features (One per line)</label>
             <textarea 
               className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 min-h-[120px] font-mono text-sm"
               value={featuresInput}
               onChange={e => setFeaturesInput(e.target.value)}
               placeholder="Instant Delivery&#10;Global Region&#10;Secure Payment"
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
                    value={formData.image} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    icon={<ImageIcon className="w-4 h-4" />}
                  />
                </div>
                {formData.image && (
                  <div className="mt-3 aspect-square rounded-lg overflow-hidden border border-dark-600 bg-dark-900">
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <Input 
                 label="Bonus Label" 
                 value={formData.bonus || ''} 
                 onChange={e => setFormData({ ...formData, bonus: e.target.value })}
                 placeholder="e.g. +10% FREE"
              />
              
              <div className="flex items-center space-x-3 bg-dark-900 p-3 rounded-lg border border-dark-700">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800"
                />
                <label htmlFor="featured" className="text-sm text-gray-300 select-none cursor-pointer">
                  Featured Product
                </label>
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