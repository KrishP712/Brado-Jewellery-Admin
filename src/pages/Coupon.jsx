import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit2, Trash2 } from 'lucide-react';
import { createCoupon, getCoupons, updateCoupon, deleteCoupon, toggleCouponActive, clearMessages } from '../Redux/slice/coupon';

const Coupon = () => {
  const dispatch = useDispatch();
  const { coupons, loading, isError, successMessage, totalPages, currentPage } = useSelector((state) => state.coupon);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    code: "",
    discountType: 'percentage',
    discountpercentageValue: 0,
    discountfixedValue: 0,
    minorderamount: 0,
    startdate: '',
    enddate: '',
    usageLimit: 0,
    isactive: true,
  });

  // Fetch coupons on component mount
  useEffect(() => {
    dispatch(getCoupons(page));
  }, [dispatch, page]);

  // Clear messages after displaying
  useEffect(() => {
    if (isError || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isError, successMessage, dispatch]);

  // Calculate dashboard stats from Redux store
  const couponStats = {
    totalCoupons: coupons.length,
    fixedCoupons: coupons.filter((c) => c.discountType === 'fixed').length,
    percentageCoupons: coupons.filter((c) => c.discountType === 'percentage').length,
    activeCoupons: coupons.filter((c) => c.isactive).length,
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setIsEditMode(true);
      setEditCouponId(coupon._id);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountpercentageValue: coupon.discountpercentageValue,
        discountfixedValue: coupon.discountfixedValue,
        minorderamount: coupon.minorderamount,
        startdate: coupon.startdate.split('T')[0],
        enddate: coupon.enddate.split('T')[0],
        usageLimit: coupon.usageLimit,
        isactive: coupon.isactive,
      });
    } else {
      setIsEditMode(false);
      setEditCouponId(null);
      setFormData({
        code: "",
        discountType: 'percentage',
        discountpercentageValue: 0,
        discountfixedValue: 0,
        minorderamount: 0,
        startdate: '',
        enddate: '',
        usageLimit: 0,
        isactive: true,
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsEditMode(false);
    setEditCouponId(null);
    setFormData({
      code: "",
      discountType: 'percentage',
      discountpercentageValue: 0,
      discountfixedValue: 0,
      minorderamount: 0,
      startdate: '',
      enddate: '',
      usageLimit: 0,
      isactive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isactive' ? !prev.isactive : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(updateCoupon({ id: editCouponId, data: formData })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          closeModal();
        }
      });
    } else {
      dispatch(createCoupon(formData)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          closeModal();
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCouponActive(id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Add Coupon Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          Add New Coupon
        </button>
      </div>

      {/* Error and Success Messages */}
      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {isError}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Dashboard Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Coupons</h2>
          <p className="text-2xl font-bold text-blue-600">{couponStats.totalCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Fixed Coupons</h2>
          <p className="text-2xl font-bold text-blue-600">{couponStats.fixedCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Percentage Coupons</h2>
          <p className="text-2xl font-bold text-blue-600">{couponStats.percentageCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Active Coupons</h2>
          <p className="text-2xl font-bold text-blue-600">{couponStats.activeCoupons}</p>
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">Loading coupons...</div>
        )}
        {!loading && coupons.length === 0 && (
          <div className="p-4 text-center text-gray-500">No coupons available</div>
        )}
        {!loading && coupons.length > 0 && (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-900">Code</th>
                <th className="px-4 py-3 font-medium text-gray-900">Discount Type</th>
                <th className="px-4 py-3 font-medium text-gray-900">Discount Value</th>
                <th className="px-4 py-3 font-medium text-gray-900">Min Order</th>
                <th className="px-4 py-3 font-medium text-gray-900">Start Date</th>
                <th className="px-4 py-3 font-medium text-gray-900">End Date</th>
                <th className="px-4 py-3 font-medium text-gray-900">Usage Limit</th>
                <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className={`border-t ${!coupon.isactive ? 'opacity-40' : ''}`}>
                  <td className="px-4 py-3">{coupon.code}</td>
                  <td className="px-4 py-3 capitalize">{coupon.discountType}</td>
                  <td className="px-4 py-3">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountpercentageValue}%`
                      : `${coupon.discountfixedValue}%`}
                  </td>
                  <td className="px-4 py-3">{coupon.minorderamount}%</td>
                  <td className="px-4 py-3">{new Date(coupon.startdate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(coupon.enddate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{coupon.usageLimit}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(coupon._id)}
                      disabled={loading}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${coupon.isactive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${coupon.isactive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(coupon)}
                        className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                        disabled={loading}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        disabled={loading}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Scrollable Modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4 mt-10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{isEditMode ? 'Edit Coupon' : 'Add New Coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom code (optional)"
                />
                <p className="text-xs text-gray-500">Leave blank to auto-generate</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              {formData.discountType === 'percentage' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                  <input
                    type="number"
                    name="discountpercentageValue"
                    value={formData.discountpercentageValue}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Fixed Value</label>
                  <input
                    type="number"
                    name="discountfixedValue"
                    value={formData.discountfixedValue}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minorderamount"
                  value={formData.minorderamount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startdate"
                  value={formData.startdate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="enddate"
                  value={formData.enddate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 mr-4">Status</label>
                <button
                  type="button"
                  onClick={handleInputChange}
                  name="isactive"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${formData.isactive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${formData.isactive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Coupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
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
};

export default Coupon;