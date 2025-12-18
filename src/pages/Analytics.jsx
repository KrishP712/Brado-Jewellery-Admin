import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

const Analytics = () => {
  const revenueData = [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 },
    { label: 'Jul', value: 72000 },
    { label: 'Aug', value: 68000 },
    { label: 'Sep', value: 75000 },
    { label: 'Oct', value: 82000 },
    { label: 'Nov', value: 78000 },
    { label: 'Dec', value: 85000 },
  ];

  const categoryPerformance = [
    { label: 'Rings', value: 45, color: 'bg-amber-500' },
    { label: 'Necklaces', value: 32, color: 'bg-blue-500' },
    { label: 'Earrings', value: 28, color: 'bg-green-500' },
    { label: 'Bracelets', value: 22, color: 'bg-purple-500' },
    { label: 'Watches', value: 18, color: 'bg-pink-500' },
    { label: 'Brooches', value: 12, color: 'bg-indigo-500' },
  ];

  const monthlyVisitors = [
    { label: 'Jan', value: 15000 },
    { label: 'Feb', value: 18000 },
    { label: 'Mar', value: 16000 },
    { label: 'Apr', value: 22000 },
    { label: 'May', value: 24000 },
    { label: 'Jun', value: 28000 },
  ];

  const conversionData = [
    { label: 'Jan', value: 3.2 },
    { label: 'Feb', value: 3.8 },
    { label: 'Mar', value: 3.1 },
    { label: 'Apr', value: 4.2 },
    { label: 'May', value: 4.6 },
    { label: 'Jun', value: 5.1 },
  ];

  const insights = [
    {
      title: 'Revenue Growth',
      value: '+23.5%',
      description: 'Compared to last quarter',
      trend: 'positive',
      color: 'text-green-600'
    },
    {
      title: 'Customer Retention',
      value: '87.2%',
      description: 'Customer retention rate',
      trend: 'positive',
      color: 'text-blue-600'
    },
    {
      title: 'Average Order Value',
      value: '$1,247',
      description: 'Up 12% from last month',
      trend: 'positive',
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '5.1%',
      description: 'Website conversion rate',
      trend: 'positive',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your jewelry business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                <p className={`text-2xl font-bold mt-1 ${insight.color}`}>{insight.value}</p>
                <p className="text-xs text-gray-500 mt-1">{insight.description}</p>
              </div>
              <div className={`p-2 rounded-lg ${insight.trend === 'positive' ? 'bg-green-100' : 'bg-red-100'}`}>
                {insight.trend === 'positive' ? (
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Visitors Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={revenueData}
          title="Revenue Trend (12 Months)"
          color="rgb(34, 197, 94)"
          height={300}
        />
        <LineChart
          data={monthlyVisitors}
          title="Website Visitors"
          color="rgb(59, 130, 246)"
          height={300}
        />
      </div>

      {/* Category Performance and Conversion Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={categoryPerformance}
          title="Category Performance (% of Total Sales)"
          height={300}
        />
        <LineChart
          data={conversionData}
          title="Conversion Rate (%)"
          color="rgb(168, 85, 247)"
          height={300}
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Revenue Highlights</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Month</span>
                  <span className="font-medium">December ($85,000)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="font-medium text-green-600">+23.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">YTD Revenue</span>
                  <span className="font-medium">$768,000</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Product Insights</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Category</span>
                  <span className="font-medium">Rings (45%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest Growing</span>
                  <span className="font-medium text-blue-600">Necklaces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium">247 SKUs</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Customer Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Customers</span>
                  <span className="font-medium">+156 this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Purchase</span>
                  <span className="font-medium text-purple-600">64%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-medium">$1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Targets */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Goals & Progress</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue Goal</span>
                <span className="text-sm text-gray-600">$85,000 / $90,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '94.4%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">New Customers</span>
                <span className="text-sm text-gray-600">156 / 200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Orders Processed</span>
                <span className="text-sm text-gray-600">1,284 / 1,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '85.6%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
