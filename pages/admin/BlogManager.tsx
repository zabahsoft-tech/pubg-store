import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, ShieldAlert, CheckCircle, XCircle, LayoutDashboard } from 'lucide-react';

export const BlogManager: React.FC = () => {
  const { user, blogPosts, deleteBlogPost } = useStore();
  const navigate = useNavigate();

  // Security Check
  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
         <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
         <p className="text-gray-400 mb-6">You do not have permission to view this page.</p>
         <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteBlogPost(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-3 bg-brand-500/10 rounded-xl">
               <LayoutDashboard className="w-8 h-8 text-brand-500" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white">Blog Manager</h1>
               <p className="text-gray-400">Manage your news and articles</p>
            </div>
         </div>
         <Button onClick={() => navigate('/admin/blogs/new')}>
           <Plus className="w-5 h-5 mr-2" /> Create New Post
         </Button>
      </div>

      {/* Blog List Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-dark-900/50 text-gray-400 text-sm uppercase tracking-wider border-b border-dark-700">
                <tr>
                   <th className="px-6 py-4">Image</th>
                   <th className="px-6 py-4">Title</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-center">Featured</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-dark-700">
                {blogPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No blog posts found. Create your first one!
                    </td>
                  </tr>
                ) : (
                  blogPosts.map(post => (
                    <tr key={post.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <img src={post.image} alt="" className="w-16 h-10 object-cover rounded-lg border border-dark-600" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white mb-1 truncate max-w-xs">{post.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{post.date}</td>
                      <td className="px-6 py-4 text-center">
                        {post.isFeatured ? 
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : 
                          <XCircle className="w-5 h-5 text-dark-600 mx-auto" />
                        }
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 rtl:space-x-reverse">
                         <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => navigate(`/admin/blogs/${post.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                         </Button>
                         <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => handleDelete(post.id)}
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