import React from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

export const Dashboard: React.FC = () => {
  const { user, t, convertPrice } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'FAILED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'PENDING': return <Clock className="w-4 h-4 mr-1" />;
      case 'FAILED': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-500/30 transition-all shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">
            {order.type === 'DIGITAL_BUNDLE' ? t('type_digital') : t('type_physical')}
          </span>
          <h3 className="text-white font-bold">{t('order_id')} {order.id.slice(-6)}</h3>
          <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          {t(`status_${order.status.toLowerCase()}`)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 bg-dark-900/50 p-2 rounded">
            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.amount || item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-dark-700 flex justify-between items-center">
        <span className="text-gray-400 text-sm">Total Cost</span>
        <span className="text-white font-bold text-lg">{convertPrice(order.totalAmount)}</span>
      </div>
    </div>
  );

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
        
        {user.orders.length === 0 ? (
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