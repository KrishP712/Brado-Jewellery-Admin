import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    createTestimonial,
    getAllTestimonials,
    deleteTestimonial,
    toggleTestimonial
} from '../Redux/slice/testimonial';
import { getAllUsers } from '../Redux/slice/user';

function Testimonial() {
    const dispatch = useDispatch();
    const { testimonialList, loading, isError, totalPages, currentPage, totalItems } = useSelector(state => state.testimonial);
    console.log(totalPages, currentPage, totalItems);
    const { userList, loading: loadingUsers } = useSelector(state => state.user);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        feature: false,
        submittedAt: new Date().toISOString().slice(0, 16),
        testimonialText: '',
        rating: 5
    });

    useEffect(() => {
        dispatch(getAllTestimonials(page));
        dispatch(getAllUsers());
    }, [dispatch, page]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const resetForm = () => {
        setFormData({
            userId: '',
            feature: false,
            submittedAt: new Date().toISOString().slice(0, 16),
            testimonialText: '',
            rating: 5
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = () => {
        if (!formData.userId || !formData.testimonialText) {
            alert('Please fill in all required fields');
            return;
        }

        dispatch(createTestimonial(formData));
        resetForm();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            dispatch(deleteTestimonial(id));
        }
    };

    const handleToggle = (id) => {
        dispatch(toggleTestimonial(id));
    };

    const StarRating = ({ rating, size = 32, interactive = false, onChange }) => {
        const renderStar = (index) => {
            const starValue = index + 1;
            const isFilled = rating >= starValue;
            const isHalfFilled = rating >= starValue - 0.5 && rating < starValue;

            if (!interactive) {
                if (isFilled) {
                    return (
                        <Star
                            key={index}
                            size={size}
                            className="fill-yellow-400 text-yellow-400"
                        />
                    );
                } else if (isHalfFilled) {
                    return (
                        <div key={index} className="relative inline-block" style={{ width: size, height: size }}>
                            <Star size={size} className="text-gray-300 absolute" />
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${size / 2}px` }}>
                                <Star size={size} className="fill-yellow-400 text-yellow-400" />
                            </div>
                        </div>
                    );
                } else {
                    return <Star key={index} size={size} className="text-gray-300" />;
                }
            }

            return (
                <div key={index} className="relative inline-block" style={{ width: size, height: size }}>
                    <Star size={size} className="text-gray-300 absolute pointer-events-none" />
                    {(isFilled || isHalfFilled) && (
                        <div
                            className="absolute inset-0 overflow-hidden pointer-events-none"
                            style={{ width: isFilled ? '100%' : '50%' }}
                        >
                            <Star size={size} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 flex">
                        <div
                            className="w-1/2 h-full cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => onChange(starValue - 0.5)}
                        />
                        <div
                            className="w-1/2 h-full cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => onChange(starValue)}
                        />
                    </div>
                </div>
            );
        };

        return (
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(renderStar)}
            </div>
        );
    };

    const getUserEmail = (testimonial) => {
        // If email is directly in testimonial (populated from backend)
        if (testimonial.email) {
            return testimonial.email;
        }

        // If userId is populated as an object
        if (testimonial.userId && typeof testimonial.userId === 'object') {
            return testimonial.userId.email || 'Unknown User';
        }

        // Fallback: search in userList
        const user = userList.find(u => u._id === testimonial.userId);
        return user?.email || 'Unknown User';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Testimonial Management</h1>
                        <p className="text-gray-600 mt-2">Manage and organize customer testimonials</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
                            disabled={loading}
                        >
                            <Plus size={20} />
                            Add Testimonial
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {isError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        Error: {isError.message || 'Something went wrong'}
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select User *
                                    </label>
                                    <select
                                        id="userId"
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        disabled={loadingUsers}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingUsers ? 'Loading users...' : 'Choose a user...'}
                                        </option>
                                        {userList.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.email}
                                            </option>
                                        ))}
                                    </select>
                                    {userList.length === 0 && !loadingUsers && (
                                        <p className="mt-2 text-sm text-red-500">
                                            No users found. Please add users first.
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="feature"
                                        name="feature"
                                        type="checkbox"
                                        checked={formData.feature}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="feature" className="ml-3 text-sm font-medium text-gray-700">
                                        Mark as Featured Testimonial
                                    </label>
                                </div>

                                <div>
                                    <label htmlFor="submittedAt" className="block text-sm font-medium text-gray-700 mb-2">
                                        Submission Date & Time *
                                    </label>
                                    <input
                                        id="submittedAt"
                                        name="submittedAt"
                                        type="datetime-local"
                                        value={formData.submittedAt}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                    </label>
                                    <div className="flex gap-3 items-center">
                                        <StarRating
                                            rating={formData.rating}
                                            interactive={true}
                                            onChange={handleRatingClick}
                                        />
                                        <span className="text-lg font-medium text-gray-700">
                                            {formData.rating} / 5
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="testimonialText" className="block text-sm font-medium text-gray-700 mb-2">
                                        Testimonial *
                                    </label>
                                    <textarea
                                        id="testimonialText"
                                        name="testimonialText"
                                        value={formData.testimonialText}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Share your experience..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        {formData.testimonialText.length} characters
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : editingId ? 'Update Testimonial' : 'Add Testimonial'}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        disabled={loading}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">{testimonialList.length}</div>
                        <div className="text-gray-600">Total Testimonials</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-yellow-600 mb-1">
                            {testimonialList.filter(t => t.feature).length}
                        </div>
                        <div className="text-gray-600">Featured</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {testimonialList.length > 0
                                ? (testimonialList.reduce((acc, t) => acc + t.rating, 0) / testimonialList.length).toFixed(1)
                                : '0.0'
                            }
                        </div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">Loading testimonials...</p>
                    </div>
                )}

                {/* Table */}
                {!loading && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Testimonial</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Featured</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {testimonialList.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No testimonials yet. Click "Add Testimonial" to get started!
                                            </td>
                                        </tr>
                                    ) : (
                                        testimonialList.map((testimonial, index) => (
                                            <tr
                                                key={testimonial._id}
                                                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${!testimonial.feature ? 'opacity-40' : ''}`}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {getUserEmail(testimonial)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <StarRating rating={testimonial.rating} size={16} interactive={false} />
                                                        <span className="text-sm font-medium text-gray-700">{testimonial.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                                                    <div className="line-clamp-2" title={testimonial.testimonialText}>
                                                        {testimonial.testimonialText}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggle(testimonial._id)}
                                                        className="flex items-center gap-2"
                                                        disabled={loading}
                                                    >
                                                        {testimonial.feature ? (
                                                            <>
                                                                <ToggleRight size={32} className="text-green-500" />
                                                                <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                                    Featured
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleLeft size={32} className="text-gray-400" />
                                                                <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                                                    Regular
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(testimonial.submittedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDelete(testimonial._id)}
                                                            disabled={loading}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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
        </div>
    );
}

export default Testimonial;