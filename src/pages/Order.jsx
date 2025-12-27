import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Calendar, DollarSign, User, CheckCircle, Truck, PackageCheck, X, AlertCircle } from 'lucide-react';
import { getallorder, updateorder } from '../Redux/slice/order';

function Order() {
  const dispatch = useDispatch();
  const { loading, isError, orderget, totalPages } = useSelector((state) => state.order);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getallorder(page));
  }, [dispatch, page]);

  // Extract orders array from API response
  const orders = Array.isArray(orderget?.orders)
    ? orderget.orders
    : Array.isArray(orderget)
      ? orderget
      : [];

  // Debug: Log first order to see structure

  const handleStatusUpdate = async (order, newStatus) => {
    try {
      const updatedOrder = { orderId: order.orderId, status: newStatus };
      await dispatch(updateorder(updatedOrder)).unwrap();
      // Re-fetch orders to reflect the update
      dispatch(getallorder(page));
    } catch (error) {
      console.error(`Failed to update order to ${newStatus}:`, error);
      alert(`Failed to update order to ${newStatus}. Please try again.`);
    }
  };

  const handleCancelOrder = async (order) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const updatedOrder = { orderId: order.orderId, status: 'Cancelled' };
        await dispatch(updateorder(updatedOrder)).unwrap();
        // Re-fetch orders to reflect the cancellation
        dispatch(getallorder());
      } catch (error) {
        console.error('Failed to cancel order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Packed':
      case 'Order Confirmed':
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Order Placed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
      case 'Returned and Refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLatestStatus = (order) => {
    return (
      order.statusTimeline
        .filter((item) => item.status === 'completed')
        .slice(-1)[0]?.title ||
      order.statusTimeline.slice(-1)[0]?.title ||
      'Order Placed'
    );
  };

  const getActionButtons = (order) => {
    const latestStatus = getLatestStatus(order);
    if (['Cancelled', 'Delivered', 'Returned and Refunded'].includes(latestStatus)) {
      return null;
    }

    const statusFlow = [
      'Order Placed',
      'Order Confirmed',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];
    const currentIndex = statusFlow.indexOf(latestStatus);
    const nextStatus = statusFlow[currentIndex + 1];

    if (!nextStatus) return null;

    let buttonConfig = {};
    switch (nextStatus) {
      case 'Order Confirmed':
        buttonConfig = {
          label: 'Confirm',
          icon: <CheckCircle size={14} />,
          color: 'bg-blue-600 hover:bg-blue-700',
        };
        break;
      case 'Packed':
        buttonConfig = {
          label: 'Pack',
          icon: <Package size={14} />,
          color: 'bg-yellow-600 hover:bg-yellow-700',
        };
        break;
      case 'Shipped':
        buttonConfig = {
          label: 'Ship',
          icon: <Truck size={14} />,
          color: 'bg-indigo-600 hover:bg-indigo-700',
        };
        break;
      case 'Out for Delivery':
        buttonConfig = {
          label: 'Out for Delivery',
          icon: <Truck size={14} />,
          color: 'bg-blue-600 hover:bg-blue-700',
        };
        break;
      case 'Delivered':
        buttonConfig = {
          label: 'Deliver',
          icon: <PackageCheck size={14} />,
          color: 'bg-green-600 hover:bg-green-700',
        };
        break;
      default:
        return null;
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusUpdate(order, nextStatus)}
          className={`flex items-center gap-1 ${buttonConfig.color} text-white px-3 py-1.5 rounded text-sm font-medium transition-colors`}
          title={buttonConfig.label}
        >
          {buttonConfig.icon}
          <span>{buttonConfig.label}</span>
        </button>
        <button
          onClick={() => handleCancelOrder(order)}
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors"
          title="Cancel Order"
        >
          <X size={14} />
          <span>Cancel</span>
        </button>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={24} />
            <h2 className="text-red-800 text-xl font-bold">Error Loading Orders</h2>
          </div>
          <p className="text-red-600 mb-4">
            {typeof isError === 'string'
              ? isError
              : isError?.message || 'Please try refreshing the page.'}
          </p>
          <button
            onClick={() => dispatch(getallorder())}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <Package className="text-white" size={32} />
              <h1 className="text-3xl font-bold text-white">Order Management</h1>
            </div>
            <p className="text-indigo-100 mt-2">Efficiently manage and track customer orders</p>
          </div>

          {/* Empty State */}
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const latestStatus = getLatestStatus(order);
                      return (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          {/* Order ID */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Package size={16} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900" title={order.orderId}>
                                {order.orderId.slice(-8)}
                              </span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {order?.user?.name}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {order.orderDate
                                  ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                  : 'N/A'}
                              </span>
                            </div>
                          </td>

                          {/* Items */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {(() => {
                                const items = order.items || [];
                                if (Array.isArray(items) && items.length > 0) {
                                  return (
                                    <div className="space-y-1">
                                      {items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="text-xs flex items-center gap-1">
                                          <span className="font-medium">
                                            {item.productId?.name || item.sku || 'Product'}
                                          </span>
                                          <span className="text-gray-500">× {item.quantity || 1}</span>
                                        </div>
                                      ))}
                                      {items.length > 3 && (
                                        <div className="text-xs text-gray-400">+{items.length - 3} more</div>
                                      )}
                                    </div>
                                  );
                                }
                                return <span className="text-gray-400 text-xs">No items</span>;
                              })()}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              ₹
                              <span className="text-sm font-semibold text-gray-900">
                                {(order.totalAmount || 0).toFixed(2)}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              onClick={() => setSelectedOrder(order)}
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${getStatusColor(
                                latestStatus
                              )}`}
                            >
                              {latestStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getActionButtons(order)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary */}
              <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{orders.length}</span>{' '}
                    {orders.length === 1 ? 'order' : 'orders'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="text-sm text-gray-600">
                      Total Items:{' '}
                      <span className="font-bold text-gray-900">
                        {orders.reduce((sum, order) => sum + (order.items?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Revenue:{' '}
                      <span className="font-bold text-green-700 text-base">
                        ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Status Timeline</h2>
            <div className="space-y-6">
              {selectedOrder.statusTimeline.map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Timeline Line */}
                  {index < selectedOrder.statusTimeline.length - 1 && (
                    <div className="absolute left-[0.875rem] top-8 h-[calc(100%-1rem)] w-0.5 bg-gray-200"></div>
                  )}
                  {/* Step Circle */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-white border-2 border-gray-300">
                    <div
                      className={`w-4 h-4 rounded-full ${item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    ></div>
                  </div>
                  {/* Step Content */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.title || 'Unknown Step'}</h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className="capitalize">{item.status || 'N/A'}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : 'Timestamp not available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-center space-x-4 mt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default Order;