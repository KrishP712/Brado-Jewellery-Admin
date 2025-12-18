import React, { useState } from 'react';
import { Search, Filter, Eye, CreditCard as Edit, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2023-12-15',
      totalOrders: 8,
      totalSpent: 12450,
      status: 'VIP',
      lastOrder: '2024-01-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      joinDate: '2024-01-10',
      totalOrders: 3,
      totalSpent: 3850,
      status: 'Regular',
      lastOrder: '2024-01-15'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      joinDate: '2023-11-20',
      totalOrders: 15,
      totalSpent: 18920,
      status: 'VIP',
      lastOrder: '2024-01-14'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.w@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      joinDate: '2023-10-05',
      totalOrders: 6,
      totalSpent: 7650,
      status: 'Regular',
      lastOrder: '2024-01-14'
    },
    {
      id: 5,
      name: 'Lisa Brown',
      email: 'lisa.b@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      joinDate: '2024-01-08',
      totalOrders: 2,
      totalSpent: 2100,
      status: 'New',
      lastOrder: '2024-01-13'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP':
        return 'bg-amber-100 text-amber-800';
      case 'Regular':
        return 'bg-blue-100 text-blue-800';
      case 'New':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer relationships</p>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">VIP Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'VIP').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'New').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">$1,287</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full lg:w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-amber-600">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{customer.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Joined: {customer.joinDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{customer.lastOrder}</p>
                  <p className="text-xs text-gray-600">Last Order</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-amber-50 text-amber-700 py-2 px-4 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
