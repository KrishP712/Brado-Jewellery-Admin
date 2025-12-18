import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Edit2, Trash2, Upload, Image, Settings } from 'lucide-react';
import { createCarousel, getAllCarousels, updateCarousel, deleteCarousel, clearError, clearMessage } from '../Redux/slice/carousel';
import { getMedia, createMedia } from '../Redux/slice/media';

function Carousel() {
    const dispatch = useDispatch();
    const { carousels, loading, error, message, totalPages } = useSelector(state => state.carousel);
    const { mediaList, loading: mediaLoading } = useSelector(state => state.media);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectingFor, setSelectingFor] = useState(null);
    const [formData, setFormData] = useState({
        slug: '',
        desktop: '',
        mobile: ''
    });

    useEffect(() => {
        dispatch(getAllCarousels(page));
        dispatch(getMedia());
    }, [dispatch, page]);

    useEffect(() => {
        if (message) {
            setTimeout(() => dispatch(clearMessage()), 3000);
        }
        if (error) {
            setTimeout(() => dispatch(clearError()), 3000);
        }
    }, [message, error, dispatch]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!formData.slug || !formData.desktop || !formData.mobile) {
            alert('Please fill all required fields and select both desktop and mobile images');
            return;
        }


        try {
            if (editingId) {
                await dispatch(updateCarousel({ id: editingId, carouselData: formData })).unwrap();
                setEditingId(null);
            } else {
                await dispatch(createCarousel(formData)).unwrap();
            }

            // Reset form and refresh data
            setFormData({ slug: '', desktop: '', mobile: '' });
            setShowForm(false);
            dispatch(getAllCarousels());
        } catch (err) {
            console.error('Error submitting carousel:', err);
            alert(`Error: ${err?.message || 'Failed to save carousel'}`);
        }
    };

    const handleEdit = (carousel) => {
        console.log('Editing carousel:', carousel);

        // Find the media IDs from URLs
        const desktopMediaId = mediaList.find(m => m.media === carousel.desktopimage)?._id || '';
        const mobileMediaId = mediaList.find(m => m.media === carousel.mobileimage)?._id || '';


        setFormData({
            slug: carousel.slug,
            desktop: desktopMediaId,
            mobile: mobileMediaId
        });
        setEditingId(carousel._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this carousel?')) {
            try {
                await dispatch(deleteCarousel(id)).unwrap();
                dispatch(getAllCarousels());
            } catch (err) {
                console.error('Error deleting carousel:', err);
                alert(`Error: ${err?.message || 'Failed to delete carousel'}`);
            }
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('media', file);

        try {
            await dispatch(createMedia(uploadFormData)).unwrap();
            await dispatch(getMedia()).unwrap();
        } catch (err) {
            console.error('Error uploading media:', err);
            alert(`Error: ${err?.message || 'Failed to upload image'}`);
        }
    };

    const selectMedia = (mediaId) => {
        console.log(`Selecting ${selectingFor} image:`, mediaId);
        setFormData(prev => ({
            ...prev,
            [selectingFor]: mediaId
        }));
        setShowMediaModal(false);
        setSelectingFor(null);
    };

    const openMediaSelector = (type) => {
        setSelectingFor(type);
        setShowMediaModal(true);
    };

    const getMediaUrl = (mediaId) => {
        const media = mediaList.find(m => m._id === mediaId);
        return media?.media || '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-l-4 border-cyan-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Carousel Manager</h1>
                            <p className="text-gray-600">Create and organize your promotional carousels</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingId(null);
                                    setFormData({ slug: '', desktop: '', mobile: '' });
                                }}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center gap-2 font-semibold"
                                title="Add Carousel"
                            >
                                <Plus size={20} />
                                Add Carousel
                            </button>
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-200 hover:shadow-md"
                                title="Settings"
                            >
                                <Settings size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {message && (
                    <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        {typeof error === 'string' ? error : error?.message || 'An error occurred'}
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white">
                                    {editingId ? 'Edit Carousel' : 'Create New Carousel'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setFormData({ slug: '', desktop: '', mobile: '' });
                                    }}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[calc(90vh-88px)]">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Carousel Slug *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="e.g., home-banner"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Desktop Image */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Desktop Image *
                                            </label>
                                            {formData.desktop ? (
                                                <div className="relative border-2 border-cyan-300 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getMediaUrl(formData.desktop)}
                                                        alt="Desktop"
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, desktop: '' })}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => openMediaSelector('desktop')}
                                                    className="w-full border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors bg-cyan-50"
                                                >
                                                    <Image className="mx-auto mb-3 text-cyan-400" size={40} />
                                                    <p className="text-gray-600 font-medium">Select Desktop Image</p>
                                                </button>
                                            )}
                                        </div>

                                        {/* Mobile Image */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Mobile Image *
                                            </label>
                                            {formData.mobile ? (
                                                <div className="relative border-2 border-blue-300 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getMediaUrl(formData.mobile)}
                                                        alt="Mobile"
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, mobile: '' })}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => openMediaSelector('mobile')}
                                                    className="w-full border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-blue-50"
                                                >
                                                    <Image className="mx-auto mb-3 text-blue-400" size={40} />
                                                    <p className="text-gray-600 font-medium">Select Mobile Image</p>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingId(null);
                                                setFormData({ slug: '', desktop: '', mobile: '' });
                                            }}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Saving...' : (editingId ? 'Update Carousel' : 'Create Carousel')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Carousel List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
                        <h2 className="text-2xl font-bold text-white">Carousel List</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Slug</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Desktop Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Mobile Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading && carousels.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Loading carousels...
                                        </td>
                                    </tr>
                                ) : carousels.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No carousels found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    carousels.map((carousel) => (
                                        <tr key={carousel._id} className="hover:bg-cyan-50 transition-colors">
                                            <td className="px-6 py-4 text-sm">
                                                <code className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                                                    {carousel.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                {carousel.desktopimage ? (
                                                    <img src={carousel.desktopimage} alt="Desktop" className="h-16 w-24 object-cover rounded" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {carousel.mobileimage ? (
                                                    <img src={carousel.mobileimage} alt="Mobile" className="h-16 w-24 object-cover rounded" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(carousel)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(carousel._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                {/* Media Selector Modal */}
                {showMediaModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white">
                                    Select {selectingFor === 'desktop' ? 'Desktop' : 'Mobile'} Image
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowMediaModal(false);
                                        setSelectingFor(null);
                                    }}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:shadow-lg transition-all">
                                        <Upload size={20} />
                                        Upload New Image
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                                    {mediaLoading ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">Loading media...</div>
                                    ) : mediaList.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">No media available. Upload some images!</div>
                                    ) : (
                                        mediaList.map((media) => (
                                            <div
                                                key={media._id}
                                                onClick={() => selectMedia(media._id)}
                                                className="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-cyan-500 hover:shadow-lg transition-all"
                                            >
                                                <img
                                                    src={media.media}
                                                    alt="Media"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Modal */}
                {showSettingsModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Settings size={28} />
                                    Settings
                                </h3>
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                                <div className="space-y-6">
                                    {/* General Settings Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                                            General Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-700">Auto-refresh carousels</p>
                                                    <p className="text-sm text-gray-500">Automatically reload carousel list after changes</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Display Settings Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                                            Display Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-700">Show image thumbnails</p>
                                                    <p className="text-sm text-gray-500">Display image previews in the carousel list</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                                </label>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <label className="block font-medium text-gray-700 mb-2">
                                                    Items per page
                                                </label>
                                                <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none">
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Settings Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                                            Notification Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-700">Success notifications</p>
                                                    <p className="text-sm text-gray-500">Show notifications for successful operations</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-700">Error notifications</p>
                                                    <p className="text-sm text-gray-500">Show notifications for errors</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
                                        <button
                                            onClick={() => setShowSettingsModal(false)}
                                            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert('Settings saved successfully!');
                                                setShowSettingsModal(false);
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                        >
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
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

export default Carousel;