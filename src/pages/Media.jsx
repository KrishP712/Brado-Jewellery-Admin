import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMedia, getMedia, deleteMedia } from "../Redux/slice/media";
import { Plus, X, Trash2, Image, Video, FileImage, Eye, Calendar, Tag } from "lucide-react";

function Media() {
    const dispatch = useDispatch();
    const { mediaList, loading: loading ,totalPages } = useSelector((state) => state.media);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [page, setPage] = useState(1);
    const [mediaType, setMediaType] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        dispatch(getMedia(page));
    }, [dispatch, page]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setPreviewImages(files.map(file => URL.createObjectURL(file)));
    };

    const handleUpload = async () => {
        if (!selectedFiles.length || !mediaType) {
            alert("Please select type and files!");
            return;
        }
        const formData = new FormData();
        formData.append("type", mediaType);
        selectedFiles.forEach(file => formData.append("media", file));
        await dispatch(createMedia(formData));
        setSelectedFiles([]);
        setPreviewImages([]);
        setMediaType("");
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this media?")) {
            await dispatch(deleteMedia(id));
        }
    };

    const handleViewMedia = (media) => {
        setSelectedMedia(media);
        setIsViewModalOpen(true);
    };

    const filteredMedia = mediaList.filter((media) => {
        const matchesSearch = media.type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || media.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const getMediaTypeIcon = (type) => {
        switch (type) {
            case "bannervideo":
                return <Video className="h-5 w-5 text-purple-500" />;
            case "sliderimage":
            case "productimage":
            case "carouselimage":
                return <Image className="h-5 w-5 text-blue-500" />;
            case "categoryicone":
                return <Tag className="h-5 w-5 text-green-500" />;
            case "categorybanner":
                return <FileImage className="h-5 w-5 text-orange-500" />;
            default:
                return <FileImage className="h-5 w-5 text-gray-500" />;
        }
    };

    const getMediaTypeBadge = (type) => {
        const badges = {
            "sliderimage": "bg-blue-100 text-blue-700",
            "categoryicone": "bg-green-100 text-green-700",
            "categorybanner": "bg-orange-100 text-orange-700",
            "bannervideo": "bg-purple-100 text-purple-700",
            "productimage": "bg-indigo-100 text-indigo-700",
            "carouselimage": "bg-pink-100 text-pink-700"
        };
        return badges[type] || "bg-gray-100 text-gray-700";
    };

    const formatMediaType = (type) => {
        const typeMap = {
            "sliderimage": "Slider Image",
            "categoryicone": "Category Icon",
            "categorybanner": "Category Banner",
            "bannervideo": "Banner Video",
            "productimage": "Product Image",
            "carouselimage": "Carousel Image"
        };
        return typeMap[type] || type;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Media Gallery
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center gap-2">
                                <FileImage className="h-4 w-4" />
                                Manage all your media files efficiently
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                            <Plus className="h-5 w-5" />
                            Add Media
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-white font-medium text-gray-700"
                        >
                            <option value="all">All Types</option>
                            <option value="sliderimage">Slider Image</option>
                            <option value="categoryicone">Category Icon</option>
                            <option value="categorybanner">Category Banner</option>
                            <option value="bannervideo">Banner Video</option>
                            <option value="productimage">Product Image</option>
                            <option value="carouselimage">Carousel Image</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                            <p className="text-gray-600 mt-4 font-medium">Loading media...</p>
                        </div>
                    ) : filteredMedia.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Preview
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Created Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Updated Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredMedia.map((media, index) => (
                                        <tr
                                            key={media._id}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <div
                                                    className="relative group cursor-pointer"
                                                    onClick={() => handleViewMedia(media)}
                                                >
                                                    <img
                                                        src={media.media}
                                                        alt={media.type}
                                                        className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200 shadow-md transition-transform hover:scale-105"
                                                    />
                                                    <div className=" w-20 absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                                        <Eye className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {getMediaTypeIcon(media.type)}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMediaTypeBadge(media.type)}`}>
                                                        {formatMediaType(media.type)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    <span className="text-sm">
                                                        {new Date(media.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(media.createdAt).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                                    <span className="text-sm">
                                                        {new Date(media.updatedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(media.updatedAt).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewMedia(media)}
                                                        className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(media._id)}
                                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <FileImage className="h-14 w-14 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">No media files yet</h3>
                            <p className="text-gray-500 mb-6">Upload your first media file to get started</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
                            >
                                Add Media
                            </button>
                        </div>
                    )}
                </div>

                {/* Total Count */}
                {filteredMedia.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-100">
                        <p className="text-center text-gray-600 font-medium">
                            Showing <span className="font-bold text-blue-600">{filteredMedia.length}</span> of <span className="font-bold text-blue-600">{mediaList.length}</span> media files
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col border border-blue-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Add Media
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedFiles([]);
                                    setPreviewImages([]);
                                    setMediaType("");
                                }}
                                className="text-gray-400 hover:text-gray-700 transition p-2 hover:bg-white rounded-lg"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Type Select */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Media Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={mediaType}
                                    onChange={e => setMediaType(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-white"
                                >
                                    <option value="">Select type...</option>
                                    <option value="sliderimage">Slider Image</option>
                                    <option value="categoryicone">Category Icon</option>
                                    <option value="categorybanner">Category Banner</option>
                                    <option value="bannervideo">Banner Video</option>
                                    <option value="productimage">Product Image</option>
                                    <option value="carouselimage">Carousel Image</option>
                                </select>
                            </div>

                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Upload Files <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <FileImage className="h-16 w-16 mx-auto text-blue-500 mb-3" />
                                    <p className="text-gray-700 mb-2 font-medium">Drop files here or click to browse</p>
                                    <p className="text-sm text-gray-500 mb-4">Supports images and videos</p>
                                    <label className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all font-semibold shadow-md inline-block">
                                        Choose Files
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Preview */}
                            {previewImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        Preview ({previewImages.length} {previewImages.length === 1 ? 'file' : 'files'})
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {previewImages.map((src, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={src}
                                                    alt="preview"
                                                    className="w-full h-32 object-cover rounded-xl border-2 border-blue-200 shadow-md"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setPreviewImages(prev => prev.filter((_, i) => i !== idx));
                                                        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedFiles([]);
                                    setPreviewImages([]);
                                    setMediaType("");
                                }}
                                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFiles.length || !mediaType}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload Media
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedMedia && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-blue-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Media Details
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsViewModalOpen(false);
                                        setSelectedMedia(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-700 transition p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 flex items-center justify-center min-h-[200px]">
                                    <img
                                        src={selectedMedia.media}
                                        alt={selectedMedia.type}
                                        className="max-h-[500px] max-w-full h-auto w-auto object-contain rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Media Type</p>
                                        <div className="flex items-center gap-2">
                                            {getMediaTypeIcon(selectedMedia.type)}
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMediaTypeBadge(selectedMedia.type)}`}>
                                                {formatMediaType(selectedMedia.type)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Created Date</p>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {new Date(selectedMedia.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Updated Date</p>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {new Date(selectedMedia.updatedAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.open(selectedMedia.media, '_blank')}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg"
                                    >
                                        Open in New Tab
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedMedia._id);
                                            setIsViewModalOpen(false);
                                            setSelectedMedia(null);
                                        }}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-semibold shadow-lg"
                                    >
                                        Delete Media
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
    );
}

export default Media;