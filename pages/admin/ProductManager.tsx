import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, ShieldAlert, Package, Search } from 'lucide-react';

export const ProductManager: React.FC = () => {
  const { user, products, categories, deleteProduct, convertPrice, language } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
         <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
         <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Helper to get category name
  const getCategoryName = (catId: number) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (language === 'fa' ? cat.fa_name : cat.en_name) : 'Unknown';
  };

  const filteredProducts = products.filter(prod => {
    const query = searchQuery.toLowerCase();
    return (
      prod.en_name.toLowerCase().includes(query) ||
      prod.fa_name.toLowerCase().includes(query) ||
      prod.id.toString().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-3 bg-brand-500/10 rounded-xl">
               <Package className="w-8 h-8 text-brand-500" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white">Product Manager</h1>
               <p className="text-gray-400">Manage digital top-ups and physical inventory</p>
            </div>
         </div>
         <Button onClick={() => navigate('/admin/products/new')}>
           <Plus className="w-5 h-5 mr-2" /> Add Product
         </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
         <Input 
           placeholder="Search by English Name, Farsi Name, or ID..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           icon={<Search className="w-5 h-5 text-gray-400" />}
           className="bg-dark-800 border-dark-700 focus:bg-dark-900"
         />
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-dark-900/50 text-gray-400 text-sm uppercase tracking-wider border-b border-dark-700">
                <tr>
                   <th className="px-6 py-4">Item</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Price</th>
                   <th className="px-6 py-4">Details</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-dark-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No matching products found.' : 'No products found. Start selling by adding one!'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src={prod.thumbnail || 'https://picsum.photos/50'} alt="" className="w-12 h-12 object-cover rounded-lg border border-dark-600 bg-dark-900" />
                            <div>
                                <div className="font-bold text-white text-sm">{prod.en_name}</div>
                                <div className="text-xs text-gray-500">ID: {prod.id}</div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 rounded text-xs font-bold border bg-gray-500/10 text-gray-300 border-gray-500/20">
                            {getCategoryName(prod.product_category_id)}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-white font-mono">
                         {convertPrice(prod.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs">
                         {prod.en_description}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 rtl:space-x-reverse">
                         <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => navigate(`/admin/products/${prod.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                         </Button>
                         <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => handleDelete(prod.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};