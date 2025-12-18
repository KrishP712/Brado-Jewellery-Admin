import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Star, Eye, ShoppingCart } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChart from '../components/charts/ProfessionalLineChart';
import BarChart from '../components/charts/ProfessionalBarChart';

const Dashboard = () => {
  const salesData = [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 },
  ];

  const categoryData = [
    { label: 'Rings', value: 35, color: 'bg-amber-500' },
    { label: 'Necklaces', value: 28, color: 'bg-blue-500' },
    { label: 'Earrings', value: 22, color: 'bg-green-500' },
    { label: 'Bracelets', value: 15, color: 'bg-purple-500' },
  ];

  const recentOrders = [
    { id: '#1234', customer: 'Sarah Johnson', product: 'Diamond Engagement Ring', amount: '$2,999', status: 'Completed', date: '2024-01-15' },
    { id: '#1235', customer: 'Michael Chen', product: 'Gold Necklace Set', amount: '$1,299', status: 'Processing', date: '2024-01-15' },
    { id: '#1236', customer: 'Emily Davis', product: 'Pearl Earrings', amount: '$599', status: 'Shipped', date: '2024-01-14' },
    { id: '#1237', customer: 'James Wilson', product: 'Silver Bracelet', amount: '$399', status: 'Completed', date: '2024-01-14' },
  ];

  const topProducts = [
    { name: 'Diamond Solitaire Ring', sales: 234, revenue: '$156,780' },
    { name: 'Gold Chain Necklace', sales: 189, revenue: '$98,450' },
    { name: 'Pearl Stud Earrings', sales: 167, revenue: '$67,300' },
    { name: 'Tennis Bracelet', sales: 143, revenue: '$89,250' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your jewelry store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$127,540"
          change={{ value: 12.5, type: 'increase' }}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Orders"
          value="1,284"
          change={{ value: 8.2, type: 'increase' }}
          icon={ShoppingBag}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Customers"
          value="2,847"
          change={{ value: 15.3, type: 'increase' }}
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Products Sold"
          value="3,947"
          change={{ value: 5.7, type: 'decrease' }}
          icon={Package}
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={salesData}
          title="Sales Overview"
          color="rgb(245, 158, 11)"
        />
        <BarChart
          data={categoryData}
          title="Sales by Category"
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.date}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.product}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <Package className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <ShoppingCart className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">New Order</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <Users className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Customer</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
