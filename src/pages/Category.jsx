import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X, Upload, Image, Trash2 } from "lucide-react";
import {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} from "../Redux/slice/category";
import {
  createMedia,
  getMedia,
  deleteMedia,
} from "../Redux/slice/media";

function Categories() {
  const dispatch = useDispatch();

  // Get data from Redux store with fallback
  const categoryState = useSelector((state) => state.category);
  const mediaState = useSelector((state) => state.media);

  const categories = categoryState?.Categoryget || [];
  const [page, setPage] = useState(1);
  const totalPages = categoryState?.totalPages || 1;
  const categoryLoading = categoryState?.loading || false;
  const mediaList = mediaState?.mediaList || [];
  const mediaLoading = mediaState?.loading || false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [currentUploadField, setCurrentUploadField] = useState(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    categorySlug: "",
    icons: "",
    sliderImage: [],
    bannerImage: [],
    video: "",
  });

  useEffect(() => {
    dispatch(getCategory(page));
    dispatch(getMedia());
  }, [dispatch, page]);

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const categoryName = e.target.value;
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    setFormData({ ...formData, categoryName, categorySlug });
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();

    if (!formData.categoryName || !formData.categorySlug) {
      alert("Please fill in required fields");
      return;
    }

    // Validate required fields match backend
    if (!formData.icons || !formData.sliderImage.length || !formData.bannerImage.length || !formData.video) {
      alert("Please fill in all required fields: icon, slider images, banner images, and video");
      return;
    }

    try {
      if (isUpdateMode && currentCategoryId) {
        await dispatch(updateCategory({
          id: currentCategoryId,
          data: formData
        })).unwrap();
        alert("Category updated successfully!");
      } else {
        await dispatch(createCategory(formData)).unwrap();
        alert("Category created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category: " + (error.message || "Unknown error"));
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: "",
      categorySlug: "",
      icons: "",
      sliderImage: [],
      bannerImage: [],
      video: "",
    });
    setIsModalOpen(false);
    setIsUpdateMode(false);
    setCurrentCategoryId(null);
  };

  const openMediaGallery = (field) => {
    setCurrentUploadField(field);
    setIsMediaGalleryOpen(true);
  };

  // Handle selecting media - store the _id, not the URL
  const handleSelectMedia = (media) => {
    // Handle array fields (sliderImage, bannerImage)
    if (currentUploadField === "sliderImage" || currentUploadField === "bannerImage") {
      setFormData({
        ...formData,
        [currentUploadField]: [...formData[currentUploadField], media._id]
      });
    } else {
      // Handle string fields (icons, video)
      setFormData({ ...formData, [currentUploadField]: media._id });
    }
    setIsMediaGalleryOpen(false);
    setCurrentUploadField(null);
  };

  const handleRemoveImage = (field, index) => {
    if (Array.isArray(formData[field])) {
      const updated = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: updated });
    } else {
      setFormData({ ...formData, [field]: "" });
    }
  };

 
  const getMediaUrl = (mediaId) => {
    const media = mediaList.find(m => m._id === mediaId);
    return media ? media.media : null;
  };

  const extractImageUrl = (imgData) => {
    if (!imgData) return null;

    if (typeof imgData === 'string') {
      return imgData;
    }

    if (typeof imgData === 'object' && imgData.media) {
      return imgData.media;
    }
    if (typeof imgData === 'object' && imgData._id) {
      const media = mediaList.find(m => m._id === imgData._id);
      return media ? media.media : null;
    }

    return null;
  };

  const handleUpdateClick = (category) => {
    setFormData({
      categoryName: category.categoryName || "",
      categorySlug: category.categorySlug || "",
      icons: category.icons?._id || category.icons || "",
      sliderImage: Array.isArray(category.sliderImage)
        ? category.sliderImage.map(img => typeof img === 'object' ? img._id : img)
        : [],
      bannerImage: Array.isArray(category.bannerImage)
        ? category.bannerImage.map(img => typeof img === 'object' ? img._id : img)
        : [],
      video: category.video?._id || category.video || "",
    });
    setIsUpdateMode(true);
    setCurrentCategoryId(category._id);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        alert("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadFormData = new FormData();

    Array.from(files).forEach((file) => {
      uploadFormData.append("media", file);

      const type = file.type.startsWith("video")
        ? "video"
        : "image";

      uploadFormData.append("type", type);
    });

    try {
      await dispatch(createMedia(uploadFormData)).unwrap();
      dispatch(getMedia()); 
      alert("Media uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload media");
    }
  };

  const handleDeleteMedia = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this media?")) {
      try {
        await dispatch(deleteMedia(id)).unwrap();
        alert("Media deleted successfully!");
      } catch (error) {
        console.error("Error deleting media:", error);
        alert("Failed to delete media");
      }
    }
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsUpdateMode(false);
              setFormData({
                categoryName: "",
                categorySlug: "",
                icons: "",
                sliderImage: [],
                bannerImage: [],
                video: "",
              });
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categoryLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : !Array.isArray(categories) || categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No categories found. Click "Add Category" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slider Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => {
                    // Extract URLs for display
                    const iconUrl = extractImageUrl(category.icons);

                    return (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={category.categoryName}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load icon:', iconUrl);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                            style={{ display: iconUrl ? 'none' : 'flex' }}
                          >
                            <Image className="h-5 w-5 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.categoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{category.categorySlug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.sliderImage && category.sliderImage.length > 0 ? (
                            <div className="flex gap-1">
                              {category.sliderImage.slice(0, 3).map((img, idx) => {
                                const imgUrl = extractImageUrl(img);
                                return imgUrl ? (
                                  <img
                                    key={idx}
                                    src={imgUrl}
                                    alt="Slide"
                                    className="h-12 w-16 rounded object-cover"
                                    onError={(e) => {
                                      console.error('Failed to load slider image:', imgUrl);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : null;
                              })}
                              {category.sliderImage.length > 3 && (
                                <div className="h-12 w-16 rounded bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+{category.sliderImage.length - 3}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-12 w-16 rounded bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No images</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.bannerImage && category.bannerImage.length > 0 ? (
                            <div className="flex gap-1">
                              {category.bannerImage.slice(0, 2).map((img, idx) => {
                                const imgUrl = extractImageUrl(img);
                                return imgUrl ? (
                                  <img
                                    key={idx}
                                    src={imgUrl}
                                    alt="Banner"
                                    className="h-12 w-20 rounded object-cover"
                                    onError={(e) => {
                                      console.error('Failed to load banner image:', imgUrl);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : null;
                              })}
                              {category.bannerImage.length > 2 && (
                                <div className="h-12 w-20 rounded bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+{category.bannerImage.length - 2}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-12 w-20 rounded bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No banners</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUpdateClick(category)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Update Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative max-h-[90vh] overflow-y-auto m-4">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
              onClick={resetForm}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isUpdateMode ? "Update Category" : "Add New Category"}
            </h2>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={handleNameChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Slug Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.categorySlug}
                  onChange={(e) =>
                    setFormData({ ...formData, categorySlug: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., rings, necklaces"
                  required
                />
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Upload *
                </label>
                <div className="flex items-center space-x-3">
                  {formData.icons && (
                    <img
                      src={getMediaUrl(formData.icons)}
                      alt="Icon preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => openMediaGallery("icons")}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Select Icon</span>
                  </button>
                  {formData.icons && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, icons: "" })}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slider Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slider Images Upload *
                </label>
                <div className="space-y-2">
                  {formData.sliderImage.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.sliderImage.map((imgId, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={getMediaUrl(imgId)}
                            alt={`Slide ${idx + 1}`}
                            className="h-20 w-32 rounded object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("sliderImage", idx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => openMediaGallery("sliderImage")}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Image className="h-4 w-4" />
                    <span>Add Slider Image</span>
                  </button>
                </div>
              </div>

              {/* Banner Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Images Upload *
                </label>
                <div className="space-y-2">
                  {formData.bannerImage.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.bannerImage.map((imgId, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={getMediaUrl(imgId)}
                            alt={`Banner ${idx + 1}`}
                            className="h-20 w-40 rounded object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("bannerImage", idx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => openMediaGallery("bannerImage")}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Add Banner Image</span>
                  </button>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Upload *
                </label>
                <div className="flex items-center space-x-3">
                  {formData.video && (
                    <video
                      src={getMediaUrl(formData.video)}
                      className="h-20 w-40 rounded object-cover border-2 border-gray-200"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => openMediaGallery("video")}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Select Video</span>
                  </button>
                  {formData.video && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, video: "" })}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateCategory}
                  disabled={categoryLoading}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {categoryLoading ? "Saving..." : isUpdateMode ? "Update Category" : "Save Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery Modal */}
      {isMediaGalleryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          style={{ zIndex: 10000 }}
        >
          <div className="bg-white w-full max-w-4xl p-6 rounded-lg relative max-h-[90vh] overflow-y-auto m-4">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
              onClick={() => {
                setIsMediaGalleryOpen(false);
                setCurrentUploadField(null);
              }}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Media</h2>
              <label className="px-4 py-2 bg-amber-600 text-white rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-amber-700 transition">
                <Plus className="h-4 w-4" />
                <span>Upload Media</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {mediaLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <p className="mt-2 text-gray-600">Loading media...</p>
              </div>
            ) : !Array.isArray(mediaList) || mediaList.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No media found. Upload some images or videos to get started.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {mediaList.map((media) => (
                  <div
                    key={media._id}
                    className="relative border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-600 transition group"
                    onClick={() => handleSelectMedia(media)}
                  >
                    <img
                      src={media.media}
                      alt="Media"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => handleDeleteMedia(media._id, e)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setIsMediaGalleryOpen(false);
                  setCurrentUploadField(null);
                }}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
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
    </>
  );
}

export default Categories;