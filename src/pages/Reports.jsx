import React, { useState } from 'react';
import { Download, Calendar, FileText, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import LineChart from '../components/charts/ProfessionalLineChart.jsx';
import BarChart from '../components/charts/ProfessionalBarChart.jsx';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('sales');

  const salesReportData = [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 },
  ];

  const customerAcquisition = [
    { label: 'Jan', value: 124 },
    { label: 'Feb', value: 156 },
    { label: 'Mar', value: 142 },
    { label: 'Apr', value: 189 },
    { label: 'May', value: 178 },
    { label: 'Jun', value: 203 },
  ];

  const topSellingProducts = [
    { label: 'Diamond Ring', value: 234, color: 'bg-amber-500' },
    { label: 'Gold Necklace', value: 189, color: 'bg-blue-500' },
    { label: 'Pearl Earrings', value: 167, color: 'bg-green-500' },
    { label: 'Silver Bracelet', value: 143, color: 'bg-purple-500' },
    { label: 'Emerald Pendant', value: 98, color: 'bg-pink-500' },
  ];

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: DollarSign, description: 'Revenue and sales performance' },
    { id: 'products', name: 'Product Report', icon: Package, description: 'Product performance and inventory' },
    { id: 'customers', name: 'Customer Report', icon: Users, description: 'Customer analytics and behavior' },
    { id: 'inventory', name: 'Inventory Report', icon: FileText, description: 'Stock levels and movements' },
  ];

  const recentReports = [
    {
      name: 'Monthly Sales Summary',
      type: 'Sales',
      date: '2024-01-15',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      name: 'Customer Demographics',
      type: 'Customer',
      date: '2024-01-14',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      name: 'Inventory Valuation',
      type: 'Inventory',
      date: '2024-01-13',
      size: '3.1 MB',
      format: 'PDF'
    },
    {
      name: 'Product Performance Q4',
      type: 'Product',
      date: '2024-01-12',
      size: '2.7 MB',
      format: 'Excel'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive business reports</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$328,500</p>
              <p className="text-xs text-green-600">+12.5% from last period</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">1,831</p>
              <p className="text-xs text-blue-600">+8.2% from last period</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">287</p>
              <p className="text-xs text-purple-600">+15.3% from last period</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">$1,247</p>
              <p className="text-xs text-amber-600">+5.7% from last period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report Types</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-amber-500 hover:bg-amber-50 transition-colors ${
                    selectedReport === report.id ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
                  }`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={salesReportData}
          title="Sales Performance"
          color="rgb(34, 197, 94)"
        />
        <LineChart
          data={customerAcquisition}
          title="Customer Acquisition"
          color="rgb(59, 130, 246)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={topSellingProducts}
          title="Top Selling Products"
        />
        
        {/* Report Summary */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Report Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reports Generated</span>
              <span className="font-medium text-gray-900">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Points Analyzed</span>
              <span className="font-medium text-gray-900">156,892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Insights Generated</span>
              <span className="font-medium text-gray-900">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Export Formats</span>
              <span className="font-medium text-gray-900">PDF, Excel, CSV</span>
            </div>
            <div className="pt-4 border-t">
              <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700">
                Generate Custom Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.format}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-amber-600 hover:text-amber-900 mr-4">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
