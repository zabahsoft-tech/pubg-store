
import React from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { OrderProduct } from '../types';
import { getStorageUrl } from '../services/api';

export const Dashboard: React.FC = () => {
  const { user, t, convertPrice, language } = useStore();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending': return <Clock className="w-4 h-4 mr-1" />;
      case 'failed': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const OrderCard: React.FC<{ order: OrderProduct }> = ({ order }) => {
     // If order has a product relation loaded, use it.
     const prod = order.product;
     const prodName = prod ? (language === 'fa' ? prod.fa_name : prod.en_name) : `Product #${order.product_id}`;
     const prodImg = getStorageUrl(prod?.thumbnail);

     return (
        <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-500/30 transition-all shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
            <h3 className="text-white font-bold">{t('order_id')} {order.id}</h3>
            <p className="text-xs text-gray-400">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status || 'Pending'}</span>
            </div>
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-3 bg-dark-900/50 p-2 rounded">
                <img src={prodImg} alt={prodName} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{prodName}</p>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 uppercase">{order.pm_type}</span>
                    <span className="text-gray-400">Qty: {order.quantity}</span>
                </div>
                </div>
            </div>
        </div>

        <div className="pt-3 border-t border-dark-700 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-white font-bold text-lg">{convertPrice(order.total_price)}</span>
        </div>
        </div>
     );
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-brand-500/20 rounded-full">
           <User className="w-8 h-8 text-brand-500" />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-white">{user.name}</h1>
           <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Order Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Package className="w-5 h-5 mr-2 text-brand-500" /> 
          Order History
        </h2>
        
        {(!user.orders || user.orders.length === 0) ? (
          <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700 border-dashed">
            <p className="text-gray-500">No orders found. Start shopping!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
