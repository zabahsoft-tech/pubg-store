import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Newspaper, Package, Settings, Users, ArrowRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();

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

  const AdminCard = ({ title, desc, icon: Icon, onClick, colorClass }: any) => (
    <button 
      onClick={onClick}
      className="bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-brand-500/50 transition-all text-left group hover:shadow-xl hover:-translate-y-1"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{desc}</p>
      <div className="flex items-center text-sm font-bold text-gray-500 group-hover:text-brand-400">
        Manage <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="text-center space-y-2 py-8">
        <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Administrator Area
        </span>
        <h1 className="text-4xl font-bold text-white">System Dashboard</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Welcome back, {user.name}. Manage your store content, products, and system settings from one central hub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <AdminCard 
          title="Product Manager" 
          desc="Add, edit, or remove digital and physical products from the store catalog."
          icon={Package}
          colorClass="bg-blue-500/10 text-blue-400"
          onClick={() => navigate('/admin/products')}
        />
        
        <AdminCard 
          title="Blog & News" 
          desc="Write articles, updates, and manage the homepage slider content."
          icon={Newspaper}
          colorClass="bg-purple-500/10 text-purple-400"
          onClick={() => navigate('/admin/blogs')}
        />

        <AdminCard 
          title="User Management" 
          desc="View registered users, manage roles, and handle account requests."
          icon={Users}
          colorClass="bg-green-500/10 text-green-400"
          onClick={() => alert('User management coming soon!')}
        />
      </div>
    </div>
  );
};