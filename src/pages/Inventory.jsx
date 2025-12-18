import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Package, TrendingDown, Plus, Download } from 'lucide-react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const inventory = [
    {
      id: 1,
      name: 'Diamond Solitaire Ring',
      sku: 'DSR-001',
      category: 'Rings',
      currentStock: 15,
      minStock: 5,
      maxStock: 50,
      unitCost: 1200,
      retailPrice: 2999,
      supplier: 'Premium Diamonds Ltd',
      lastRestocked: '2024-01-10',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Gold Chain Necklace',
      sku: 'GCN-002',
      category: 'Necklaces',
      currentStock: 8,
      minStock: 10,
      maxStock: 30,
      unitCost: 350,
      retailPrice: 899,
      supplier: 'Gold Masters Inc',
      lastRestocked: '2024-01-05',
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Pearl Stud Earrings',
      sku: 'PSE-003',
      category: 'Earrings',
      currentStock: 25,
      minStock: 15,
      maxStock: 40,
      unitCost: 120,
      retailPrice: 299,
      supplier: 'Ocean Pearls Co',
      lastRestocked: '2024-01-12',
      status: 'In Stock'
    },
    {
      id: 4,
      name: 'Silver Tennis Bracelet',
      sku: 'STB-004',
      category: 'Bracelets',
      currentStock: 0,
      minStock: 8,
      maxStock: 25,
      unitCost: 200,
      retailPrice: 599,
      supplier: 'Silver Craft Studio',
      lastRestocked: '2023-12-28',
      status: 'Out of Stock'
    },
    {
      id: 5,
      name: 'Emerald Pendant',
      sku: 'EP-005',
      category: 'Necklaces',
      currentStock: 3,
      minStock: 5,
      maxStock: 20,
      unitCost: 550,
      retailPrice: 1299,
      supplier: 'Emerald Emporium',
      lastRestocked: '2024-01-08',
      status: 'Critical'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-orange-100 text-orange-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockPercentage = (current, max) => (current / max) * 100;

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === 'low-stock') {
      matchesFilter = item.status === 'Low Stock' || item.status === 'Critical';
    } else if (selectedFilter === 'out-of-stock') {
      matchesFilter = item.status === 'Out of Stock';
    } else if (selectedFilter === 'in-stock') {
      matchesFilter = item.status === 'In Stock';
    }

    return matchesSearch && matchesFilter;
  });

  const lowStockCount = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;
  const outOfStockCount = inventory.filter(item => item.status === 'Out of Stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your jewelry stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.sku} • {item.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{item.currentStock}</span>
                        <span className="text-sm text-gray-500">/ {item.maxStock}</span>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            item.currentStock <= item.minStock 
                              ? 'bg-red-500' 
                              : item.currentStock <= item.minStock * 2 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(getStockPercentage(item.currentStock, item.maxStock), 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Min: {item.minStock}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${item.retailPrice}</div>
                      <div className="text-sm text-gray-500">Cost: ${item.unitCost}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{item.supplier}</div>
                      <div className="text-sm text-gray-500">Last: {item.lastRestocked}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="bg-amber-600 text-white px-3 py-1 rounded text-xs hover:bg-amber-700">
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Alerts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Restock Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {inventory
              .filter(item => item.currentStock <= item.minStock)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Current: {item.currentStock} | Minimum: {item.minStock}
                      </p>
                    </div>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                    Order Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
