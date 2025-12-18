import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  productcreate,
  getproduct,
  deleteproduct,
  updateproduct,
  clearError,
  clearMessage,
} from "../Redux/slice/product";
import { getMedia, createMedia } from "../Redux/slice/media";
import { getCategory } from "../Redux/slice/category";
import { getFilterOption } from "../Redux/slice/filterOption";
import { getOffers } from "../Redux/slice/offer";

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mediaList, loading: mediaLoading } = useSelector(
    (state) => state.media
  );
  const {
    productget,
    loading: productLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    isError,
    message: successMessage,
  } = useSelector((state) => state.product);
  const products = productget.products || [];

  const { Categoryget: categories = [] } = useSelector(
    (state) => state.category
  );
  const { FilterOptionget: filterOptions = [] } = useSelector(
    (state) => state.filteroption
  );
  // FIXED: Proper selector for offers
  const { offers: offers = [] } = useSelector((state) => state.offer);
  const offerList = offers?.data || [];
  /* ----------------------------------------------------- STATE ----------------------------------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCategory, setImageCategory] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [openAccordions, setOpenAccordions] = useState({});
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [isMediaFetched, setIsMediaFetched] = useState(false);
  const [isCategoriesFetched, setIsCategoriesFetched] = useState(false);
  const [isFilterOptionsFetched, setIsFilterOptionsFetched] = useState(false);
  const [isOffersFetched, setIsOffersFetched] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    name: "",
    sku: "",
    category: "",
    offer: "",
    price: "",
    originalPrice: "",
    discount: "",
    description: "",
    stock: "",
    newproduct: false,
    special: false,
    specification: [],
    image: [],
    filters: [],
    // rating: 0,
  });


  /* ----------------------------------------------------- EFFECTS ----------------------------------------------------- */
  useEffect(() => {
    dispatch(getproduct({ page: currentPage, limit }));
    dispatch(getMedia());
    dispatch(getCategory()).then(() => setIsCategoriesFetched(true));
    dispatch(getFilterOption()).then(() => setIsFilterOptionsFetched(true));
    dispatch(getOffers()).then(() => setIsOffersFetched(true));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (isModalOpen && !isMediaFetched) {
      dispatch(getMedia()).then(() => setIsMediaFetched(true));
    }
  }, [isModalOpen, isMediaFetched, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(isError, { position: "top-right", autoClose: 3000 });
      dispatch(clearError());
    }
  }, [isError, dispatch]);


  /* ----------------------------------------------------- FIXED: OFFER MAPPING ----------------------------------------------------- */
  const offerIdToName = useMemo(() => {
    return offerList?.reduce((acc, offer) => {
      acc[offer._id] = offer.title;
      return acc;
    }, {});
  }, [offers]);

  const categoryIdToName = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat._id] = cat.categoryName;
      return acc;
    }, {});
  }, [categories]);

  const filterNamesMap = useMemo(() => {
    return filterOptions.reduce((acc, option) => {
      const filterName = option.type || option.filterName;
      const filterId = option.filter || option.filterId;
      if (filterName && filterId && !acc[filterName]) {
        acc[filterName] = filterId;
      }
      return acc;
    }, {});
  }, [filterOptions]);

  const filterNames = useMemo(() => Object.keys(filterNamesMap), [filterNamesMap]);

  /* ----------------------------------------------------- AUTO-CALCULATE PRICE ----------------------------------------------------- */
  const calculatePrice = useCallback(() => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discount = parseFloat(formData.discount) || 0;
    if (original > 0 && discount >= 0 && discount <= 100) {
      const price = original * (1 - discount / 100);
      setFormData((prev) => ({
        ...prev,
        price: price.toFixed(2),
      }));
    }
  }, [formData.originalPrice, formData.discount]);

  useEffect(() => {
    if (!isUpdateMode || (!formData.price && formData.originalPrice && formData.discount)) {
      calculatePrice();
    }
  }, [formData.originalPrice, formData.discount, isUpdateMode, calculatePrice]);

  /* ----------------------------------------------------- HELPERS ----------------------------------------------------- */
  const toggleAccordion = (filterName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const toggleFilterOption = (filterName, optionId) => {
    const filterId = filterNamesMap[filterName];
    if (!filterId) {
      toast.error(`Filter ID for ${filterName} not found`);
      return;
    }
    setFormData((prev) => {
      const currentFilters = prev.filters || [];
      const existingFilterIndex = currentFilters.findIndex(
        (f) => f.filter === filterId
      );
      if (existingFilterIndex >= 0) {
        const existingFilter = currentFilters[existingFilterIndex];
        const isSelected = existingFilter.filterOption.includes(optionId);
        if (isSelected) {
          const newFilterOption = existingFilter.filterOption.filter(
            (id) => id !== optionId
          );
          if (newFilterOption.length === 0) {
            return {
              ...prev,
              filters: currentFilters.filter(
                (_, i) => i !== existingFilterIndex
              ),
            };
          } else {
            const newFilters = [...currentFilters];
            newFilters[existingFilterIndex] = {
              ...existingFilter,
              filterOption: newFilterOption,
            };
            return { ...prev, filters: newFilters };
          }
        } else {
          const newFilters = [...currentFilters];
          newFilters[existingFilterIndex] = {
            ...existingFilter,
            filterOption: [...existingFilter.filterOption, optionId],
          };
          return { ...prev, filters: newFilters };
        }
      } else {
        return {
          ...prev,
          filters: [
            ...currentFilters,
            { filter: filterId, filterOption: [optionId] },
          ],
        };
      }
    });
  };

  const isOptionSelected = (filterName, optionId) => {
    const filterId = filterNamesMap[filterName];
    const filter = formData.filters.find((f) => f.filter === filterId);
    return filter ? filter.filterOption.includes(optionId) : false;
  };

  const getSelectedOptions = (filterName) => {
    const filterId = filterNamesMap[filterName];
    const filter = formData.filters.find((f) => f.filter === filterId);
    if (!filter) return [];
    return filter.filterOption
      .map((optionId) => {
        const option = filterOptions.find((opt) => opt._id === optionId);
        return option ? { id: optionId, name: option.name } : null;
      })
      .filter(Boolean);
  };

  const removeFilterOption = (filterName, optionId) => {
    const filterId = filterNamesMap[filterName];
    setFormData((prev) => {
      const currentFilters = prev.filters || [];
      const filterIndex = currentFilters.findIndex(
        (f) => f.filter === filterId
      );
      if (filterIndex >= 0) {
        const filter = currentFilters[filterIndex];
        const newFilterOption = filter.filterOption.filter(
          (id) => id !== optionId
        );
        if (newFilterOption.length === 0) {
          return {
            ...prev,
            filters: currentFilters.filter((_, i) => i !== filterIndex),
          };
        } else {
          const newFilters = [...currentFilters];
          newFilters[filterIndex] = {
            ...filter,
            filterOption: newFilterOption,
          };
          return { ...prev, filters: newFilters };
        }
      }
      return prev;
    });
  };

  const getSelectedCount = (filterName) => {
    const filterId = filterNamesMap[filterName];
    const filter = formData.filters.find((f) => f.filter === filterId);
    return filter ? filter.filterOption.length : 0;
  };

  const getFilterName = (filterId) => {
    const entry = Object.entries(filterNamesMap).find(
      ([, id]) => id === filterId
    );
    return entry ? entry[0] : filterId;
  };

  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      toast.error("Please enter both key and value for the specification");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      specification: [
        ...prev.specification,
        { key: newSpecKey.trim(), value: newSpecValue.trim() },
      ],
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleRemoveSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specification: prev.specification.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveImage = (imgId) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((id) => id !== imgId),
    }));
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      name: "",
      sku: "",
      category: "",
      offer: "",
      price: "",
      originalPrice: "",
      discount: "",
      description: "",
      stock: "",
      newproduct: false,
      special: false,
      specification: [],
      image: [],
      filters: [],
      // rating: 0,
    });
    setOpenAccordions({});
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock),
        // rating: parseFloat(formData.rating),
      };
      if (isUpdateMode) {
        await dispatch(
          updateproduct({ id: currentProductId, data: { product: payload } })
        );
        toast.success("Product updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await dispatch(productcreate(payload));
        toast.success("Product created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      await dispatch(getproduct());
      resetForm();
      setIsModalOpen(false);
      setIsUpdateMode(false);
      setCurrentProductId(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        err.message ||
        "Failed to save product. Please check the data and try again."
      );
    }
  };

  const handleSelectImage = (id) => {
    setFormData((prev) => {
      const isSelected = prev.image.includes(id);
      return {
        ...prev,
        image: isSelected
          ? prev.image.filter((imgId) => imgId !== id)
          : [...prev.image, id],
      };
    });
  };

  const handleUpdateClick = (product) => {
    console.log(product)
    const selectedCategory = categories.find(
      (cat) => cat.categoryName === product.categoryName
    );
    const selectedOffer = offerList.find((o) => o.title === product?.offers[0]?.title);
    console.log(selectedOffer);
    const filters = Array.isArray(product.filters)
      ? product.filters
      : product.filName && product.filOpt
        ? product.filName.map((name, index) => {
          const filterId = filterNamesMap[name] || name;
          const optValue = Array.isArray(product.filOpt)
            ? product.filOpt[index]
            : product.filOpt;
          const option = filterOptions.find(
            (opt) =>
              (opt.name === optValue || opt._id === optValue) &&
              (opt.type === name ||
                opt.filterName === name ||
                opt.filter === filterId)
          );
          return {
            filter: filterId,
            filterOption: [option?._id || optValue],
          };
        })
        : [];
    const images = Array.isArray(product.image)
      ? product.image.map((img) => {
        if (typeof img === "string") {
          const media = mediaList.find((m) => m.media === img);
          return media ? media._id : img;
        }
        if (img?._id) return img._id;
        if (img?.url) {
          const media = mediaList.find((m) => m.media === img.url);
          return media ? media._id : img.url;
        }
        return img;
      })
      : [];
    setFormData({
      slug: product.slug || "",
      title: product.title || "",
      name: product.name || "",
      sku: product.sku || "",
      category: selectedCategory?._id || "",
      offer: selectedOffer?._id || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      discount: product.discount || "",
      description: product.description || "",
      stock: product.stock || "",
      newproduct: product.newproduct || false,
      special: product.special || false,
      specification: Array.isArray(product.specification)
        ? product.specification.map((spec) => ({
          key: spec.key || "",
          value: spec.value || "",
        }))
        : Array.isArray(product.spicification)
          ? product.spicification.map((spec) => ({
            key: spec.key || "",
            value: spec.value || "",
          }))
          : [{ key: "", value: "" }],
      image: images,
      filters,
      // rating: product.rating || 0,
    });
    const newOpenAccordions = {};
    filterNames.forEach((filterName) => {
      if (getSelectedCount(filterName) > 0)
        newOpenAccordions[filterName] = true;
    });
    setOpenAccordions(newOpenAccordions);
    setIsUpdateMode(true);
    setCurrentProductId(product._id);
    setIsModalOpen(true);
  };

  const handleCardClick = (product) => {
    setSelectedProduct({ ...product, currentImageIndex: 0 });
  };

  const handleImageChange = (direction) => {
    setSelectedProduct((prev) => {
      const images = Array.isArray(prev.image) ? prev.image : [];
      const totalImages = images.length;
      let newIndex = prev.currentImageIndex + direction;
      if (newIndex < 0) newIndex = totalImages - 1;
      if (newIndex >= totalImages) newIndex = 0;
      return { ...prev, currentImageIndex: newIndex };
    });
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleImageUpload = async () => {
    let newMediaIds = [];
    if (imageFiles.length > 0) {
      const formDataUpload = new FormData();
      imageFiles.forEach((file) => {
        formDataUpload.append("media", file);
      });
      formDataUpload.append("type", "image");
      if (imageCategory) formDataUpload.append("category", imageCategory);
      if (filterOption) formDataUpload.append("filterOption", filterOption);
      try {
        const response = await dispatch(createMedia(formDataUpload)).unwrap();
        newMediaIds = response.map((media) => media._id);
        toast.success("Images uploaded successfully!");
      } catch (err) {
        toast.error(err.message || "Failed to upload images");
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...newMediaIds],
    }));
    await dispatch(getMedia());
    setImageFiles([]);
    setImagePreviews((prev) => {
      prev.forEach((preview) => URL.revokeObjectURL(preview));
      return [];
    });
    setImageCategory("");
    setFilterOption("");
    setIsImageModalOpen(false);
  };

  const filteredProducts = products || [];

  const handleSearch = () => setActiveSearchTerm(searchTerm);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteproduct(id));
        toast.success("Product deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        await dispatch(getproduct());
      } catch (err) {
        toast.error(err.message || "Failed to delete product.");
      }
    }
  };

  const categoryOptions = useMemo(() => [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat.categoryName,
      label: cat.categoryName,
    })),
  ], [categories]);

  const getFilterOptionNames = (filters, filName, filOpt) => {
    if (Array.isArray(filName) && Array.isArray(filOpt)) {
      return filName.map((name, index) => ({
        filterName: name,
        options: filOpt[index] ? [filOpt[index]] : [],
      }));
    }
    return filters.map((filter) => {
      const filterName = getFilterName(filter.filter);
      const options = filter.filterOption
        .map((optionId) => {
          const option = filterOptions.find((opt) => opt._id === optionId);
          return option ? option.name : null;
        })
        .filter(Boolean);
      return { filterName, options };
    });
  };

  const getImageSrc = (img) => {
    const placeholder =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E";
    if (typeof img === "object" && img !== null) {
      return img.media || placeholder;
    }
    if (typeof img === "string") {
      if (/^[0-9a-fA-F]{24}$/.test(img)) {
        const media = mediaList.find((m) => m._id === img);
        return media ? media.media : placeholder;
      } else {
        return img;
      }
    }
    return placeholder;
  };

  /* ----------------------------------------------------- RENDER ----------------------------------------------------- */
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your inventory with ease</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsUpdateMode(false);
            resetForm();
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search + Category */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-1 flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, title, slug, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        >
          {isCategoriesFetched && categories.length === 0 ? (
            <option value="">Loading categories...</option>
          ) : (
            categoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))
          )}
        </select>
      </div>

      {/* --------------------------- MODAL (CREATE / UPDATE) --------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl relative max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">
                {isUpdateMode ? "Update Product" : "Create Product"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsUpdateMode(false);
                  setCurrentProductId(null);
                  resetForm();
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form
              id="product-form"
              onSubmit={handleAddOrUpdateProduct}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* SKU + Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="Enter SKU"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>

              {/* Title + Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>

              {/* Category + OFFER (FIXED) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white shadow-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer
                  </label>
                  <select
                    value={formData.offer}
                    onChange={(e) =>
                      setFormData({ ...formData, offer: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white shadow-sm"
                  >
                    <option value="">No Offer</option>

                    {/* ✅ Show loading, empty, or list states */}
                    {!isOffersFetched ? (
                      <option disabled>Loading offers...</option>
                    ) : offerList.length === 0 ? (
                      <option disabled>No offers available</option>
                    ) : (
                      offerList.map((offer) => (
                        <option key={offer._id} value={offer._id}>
                          {offer.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Price + Original Price + Discount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="Auto-calculated"
                    required
                  />
                </div>
              </div>

              {/* Stock + Rating */}
              <div className="w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                    placeholder="0.0"
                    required
                  />
                </div> */}
              </div>

              {/* Trending / Special */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="inline-block text-sm font-medium text-gray-700 mb-2">
                    Trending
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newproduct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newproduct: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Toggle Trending
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-block text-sm font-medium text-gray-700 mb-2">
                    Special Deal
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.special}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          special: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Toggle Special Deal
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="inline-block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none shadow-sm"
                  placeholder="Enter description"
                  rows={4}
                  required
                />
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    + Add Image
                  </button>
                </div>
                {mediaLoading ? (
                  <p className="text-sm text-gray-500">Loading media...</p>
                ) : formData.image.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600">No images selected</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.image.map((imgId) => {
                      const media = mediaList.find((m) => m._id === imgId);
                      return (
                        <div key={imgId} className="relative group">
                          <img
                            src={
                              media?.media ||
                              imgId ||
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                            }
                            alt="Selected"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            onClick={() => handleRemoveImage(imgId)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                        placeholder="Key (e.g., Material)"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                        placeholder="Value (e.g., Cotton)"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
                  >
                    Add Specification
                  </button>
                  {formData.specification.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                      {formData.specification.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b last:border-b-0"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-gray-700">
                              {spec.key}:{" "}
                            </span>
                            <span className="text-gray-600">{spec.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecification(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filter Options
                </label>
                {isFilterOptionsFetched && filterNames.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    Loading filter options...
                  </p>
                ) : filterNames.length > 0 ? (
                  <div className="space-y-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {filterNames.map((filterName) => {
                      const selectedCount = getSelectedCount(filterName);
                      const isOpen = openAccordions[filterName];
                      return (
                        <div
                          key={filterName}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={() => toggleAccordion(filterName)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">
                                {filterName}
                              </span>
                              <div className="flex items-center gap-2">
                                {selectedCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {selectedCount}
                                  </span>
                                )}
                                <ChevronDown
                                  className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""
                                    }`}
                                />
                              </div>
                            </div>
                          </button>
                          {isOpen && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="flex flex-wrap gap-2">
                                {filterOptions
                                  .filter(
                                    (opt) =>
                                      (opt.type === filterName ||
                                        opt.filterName === filterName) &&
                                      (opt.filter ===
                                        filterNamesMap[filterName] ||
                                        opt.filterId ===
                                        filterNamesMap[filterName])
                                  )
                                  .map((opt) => {
                                    const selected = isOptionSelected(
                                      filterName,
                                      opt._id
                                    );
                                    return (
                                      <button
                                        key={opt._id}
                                        type="button"
                                        onClick={() =>
                                          toggleFilterOption(filterName, opt._id)
                                        }
                                        className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${selected
                                          ? "bg-blue-500 border-blue-600 text-white"
                                          : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                                          }`}
                                      >
                                        {opt.name}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    No filter options available
                  </p>
                )}
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsUpdateMode(false);
                  setCurrentProductId(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={createLoading || updateLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading || updateLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isUpdateMode ? "Updating..." : "Saving..."}
                  </span>
                ) : isUpdateMode ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- IMAGE SELECTION MODAL --------------------------- */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl relative max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                Select Images
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 transition p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setImageFiles([]);
                  setImagePreviews([]);
                  setImageCategory("");
                  setFilterOption("");
                  imagePreviews.forEach((p) =>
                    URL.revokeObjectURL(p)
                  );
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Category & Filter for upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Category
                </label>
                <select
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                >
                  <option value="">Select category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Option
                </label>
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                >
                  <option value="">Select filter option (optional)</option>
                  {filterOptions.map((opt) => (
                    <option key={opt._id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg file:bg-blue-50 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 shadow-sm"
                  onChange={handleImageFileChange}
                />
              </div>
              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Previews
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${i}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          onClick={() => {
                            setImageFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                            setImagePreviews((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from Gallery
                </label>
                {mediaLoading ? (
                  <p className="text-sm text-gray-500">Loading media...</p>
                ) : mediaList.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No media available
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm">
                    {mediaList.map((media) => {
                      const isSelected = formData.image.includes(media._id);
                      return (
                        <div
                          key={media._id}
                          onClick={() => handleSelectImage(media._id)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition group ${isSelected
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-400"
                            }`}
                        >
                          <img
                            src={media.media}
                            alt="Media"
                            className="w-full h-20 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3C/svg%3E";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition" />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setImageFiles([]);
                  setImagePreviews([]);
                  setImageCategory("");
                  setFilterOption("");
                  imagePreviews.forEach((p) => URL.revokeObjectURL(p));
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={imageFiles.length === 0 && formData.image.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- PRODUCT DETAIL MODAL --------------------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl p-8 rounded-xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Carousel */}
              <div>
                <div className="relative">
                  {(() => {
                    const images = Array.isArray(selectedProduct.image)
                      ? selectedProduct.image
                      : [];
                    const currentImg =
                      images[selectedProduct.currentImageIndex] ||
                      selectedProduct.image;
                    const src = getImageSrc(currentImg);
                    return (
                      <img
                        src={src}
                        alt={selectedProduct.name}
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    );
                  })()}
                  {Array.isArray(selectedProduct.image) &&
                    selectedProduct.image.length > 1 && (
                      <>
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <button
                            onClick={() => handleImageChange(-1)}
                            className="p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <button
                            onClick={() => handleImageChange(1)}
                            className="p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </div>
                      </>
                    )}
                </div>
                {Array.isArray(selectedProduct.image) &&
                  selectedProduct.image.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {selectedProduct.image.map((img, i) => {
                        const src = getImageSrc(img);
                        return (
                          <img
                            key={i}
                            src={src}
                            alt={`Thumb ${i}`}
                            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 shadow-sm ${selectedProduct.currentImageIndex === i
                              ? "border-blue-600"
                              : "border-gray-300"
                              }`}
                            onClick={() =>
                              setSelectedProduct((p) => ({
                                ...p,
                                currentImageIndex: i,
                              }))
                            }
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23e5e7eb'/%3E%3C/svg%3E";
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
              </div>
              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    SKU
                  </h3>
                  <p className="text-gray-600">
                    {selectedProduct.sku || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Slug
                  </h3>
                  <p className="text-gray-600">{selectedProduct.slug}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Title
                  </h3>
                  <p className="text-gray-600">{selectedProduct.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Product Name
                  </h3>
                  <p className="text-gray-600">{selectedProduct.name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Category
                  </h3>
                  <p className="text-gray-600">
                    {categoryIdToName[selectedProduct.category] ||
                      selectedProduct.category ||
                      selectedProduct.categories}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Offer
                  </h3>
                  <p className="text-gray-600">
                    {offerIdToName[selectedProduct.offer] || // FIXED: Now works with 'title'
                      selectedProduct.offer ||
                      "No Offer"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Price
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Original Price
                    </h3>
                    <p className="text-xl font-bold text-green-600">
                      ₹{selectedProduct.originalPrice}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Discount
                  </h3>
                  <p className="text-gray-600">{selectedProduct.discount}%</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Stock
                  </h3>
                  <p className="text-gray-600">{selectedProduct.stock}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 ">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>
                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Rating
                  </h3>
                  <p className="text-gray-600">
                    Rating {selectedProduct.rating}/5
                  </p>
                </div> */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Filters
                  </h3>
                  {(selectedProduct.filters && selectedProduct.filters.length > 0) ||
                    (selectedProduct.filName && selectedProduct.filName.length > 0) ? (
                    <div className="space-y-2">
                      {getFilterOptionNames(
                        selectedProduct.filters || [],
                        selectedProduct.filName || [],
                        selectedProduct.filOpt || []
                      ).map((filter) => (
                        <div key={filter.filterName}>
                          <h4 className="text-sm font-medium text-gray-700">
                            {filter.filterName}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {filter.options.map((opt, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No filters applied</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Specifications
                  </h3>
                  {selectedProduct.specification &&
                    Array.isArray(selectedProduct.specification) &&
                    selectedProduct.specification.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProduct.specification.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-700">
                            {spec.key}:{" "}
                          </span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : selectedProduct.spicification &&
                    Array.isArray(selectedProduct.spicification) &&
                    selectedProduct.spicification.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProduct.spicification.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-700">
                            {spec.key}:{" "}
                          </span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No specifications available
                    </p>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      handleUpdateClick(selectedProduct);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteProduct(selectedProduct._id);
                      setSelectedProduct(null);
                    }}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 shadow-sm"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- PRODUCT LIST --------------------------- */}
      {productLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      ) : (
        <>
          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts?.map((product) => {
              const cardImageSrc = Array.isArray(product.image)
                ? getImageSrc(product.image[0])
                : getImageSrc(product.image);
              const productCategory =
                categoryIdToName[product.category] || product.category;
              const productOffer = offerIdToName[product.offer];

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-gray-100"
                  onClick={() => handleCardClick(product)}
                >
                  <div className="relative group">
                    <img
                      src={cardImageSrc}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      {product.newproduct && (
                        <span className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full shadow-md">
                          New
                        </span>
                      )}
                      {product.special && (
                        <span className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full shadow-md">
                          Special
                        </span>
                      )}
                      {productOffer && (
                        <span className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full shadow-md">
                          {productOffer}
                        </span>
                      )}
                    </div>

                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs bg-red-500 text-white rounded-full shadow-md">
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500">{productCategory}</p>

                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold text-blue-600">
                        ₹{product.price}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <p>Stock: {product.stock}</p>
                    </div>

                    <div className="flex space-x-3 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product._id);
                        }}
                        disabled={deleteLoading}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm shadow-sm"
                      >
                        Delete
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateClick(product);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm shadow-sm"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {productget.currentPage} of {productget.totalPages}
            </span>

            <button
              disabled={currentPage >= productget.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default Products;