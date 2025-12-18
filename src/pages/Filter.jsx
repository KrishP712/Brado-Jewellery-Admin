import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Filter, X, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { createfilter, getfilter, deletefilter, clearMessages as clearFilterMessages } from '../Redux/slice/filter';
import { createFilterOption, getFilterOption, deleteFilterOption, clearMessages as clearOptionMessages } from '../Redux/slice/filterOption';

function FilterFun() {
    const dispatch = useDispatch();
    const { filterget = [], loading: filterLoading, isError: filterError, successMessage: filterSuccess, totalPages, currentPage, totalItems } = useSelector((state) => state.filter || {});

    const { FilterOptionget: filteroptionget = [], loading: optionLoading, isError: optionError, successMessage: optionSuccess } = useSelector((state) => state.filteroption);
    const [page, setPage] = useState(1);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [slug, setSlug] = useState('');
    const [expandedFilters, setExpandedFilters] = useState({});

    // Option form states
    const [selectedFilterId, setSelectedFilterId] = useState('');
    const [optionName, setOptionName] = useState('');
    const [optionSlug, setOptionSlug] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch filters and options on component mount
    useEffect(() => {
        dispatch(getfilter(page));
        dispatch(getFilterOption());
    }, [dispatch, page]);

    // Handle success/error messages for filters
    useEffect(() => {
        if (filterSuccess) {
            console.log(filterSuccess);
            setTimeout(() => {
                dispatch(clearFilterMessages());
            }, 3000);
        }
        if (filterError) {
            console.error(filterError);
            setTimeout(() => {
                dispatch(clearFilterMessages());
            }, 3000);
        }
    }, [filterSuccess, filterError, dispatch]);

    // Handle success/error messages for options
    useEffect(() => {
        if (optionSuccess) {
            console.log(optionSuccess);
            setTimeout(() => {
                dispatch(clearOptionMessages());
            }, 3000);
        }
        if (optionError) {
            console.error(optionError);
            setTimeout(() => {
                dispatch(clearOptionMessages());
            }, 3000);
        }
    }, [optionSuccess, optionError, dispatch]);

    const showFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const showOptionModal = (filterId) => {
        setSelectedFilterId(filterId);
        setIsOptionModalOpen(true);
    };

    const handleCreateFilter = async () => {
        if (filterName.trim() && slug.trim()) {
            const data = {
                filterName: filterName.trim(),
                filterSlug: slug.trim()
            };

            await dispatch(createfilter(data));

            // Refetch the filters to update the UI
            await dispatch(getfilter());

            setFilterName('');
            setSlug('');
            setIsFilterModalOpen(false);
        }
    };

    const handleCreateOption = async () => {
        if (selectedFilterId && optionName.trim() && optionSlug.trim()) {
            const data = {
                filterId: selectedFilterId,
                name: optionName.trim(),
                slug: optionSlug.trim()
            };

            const result = await dispatch(createFilterOption(data));

            // Refetch the filter options to update the UI
            await dispatch(getFilterOption());

            // Force re-render
            setRefreshKey(prev => prev + 1);

            // Small delay to ensure state updates
            setTimeout(() => {
                // Automatically expand the filter to show the new option
                setExpandedFilters(prev => ({
                    ...prev,
                    [selectedFilterId]: true
                }));
            }, 100);

            setOptionName('');
            setOptionSlug('');
            setSelectedFilterId('');
            setIsOptionModalOpen(false);
        }
    };

    const handleCancelFilter = () => {
        setIsFilterModalOpen(false);
        setFilterName('');
        setSlug('');
    };

    const handleCancelOption = () => {
        setIsOptionModalOpen(false);
        setOptionName('');
        setOptionSlug('');
        setSelectedFilterId('');
    };

    const handleDeleteFilter = async (id) => {
        if (window.confirm('Are you sure you want to delete this filter? All associated options will also be deleted.')) {
            await dispatch(deletefilter(id));
            // Refetch data after deletion
            await dispatch(getfilter());
            await dispatch(getFilterOption());
        }
    };

    const handleDeleteOption = async (id) => {
        if (window.confirm('Are you sure you want to delete this option?')) {
            await dispatch(deleteFilterOption(id));
            // Refetch options after deletion
            await dispatch(getFilterOption());
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleFilterNameChange = (e) => {
        const name = e.target.value;
        setFilterName(name);
        if (name) {
            setSlug(generateSlug(name));
        }
    };

    const handleOptionNameChange = (e) => {
        const name = e.target.value;
        setOptionName(name);
        if (name) {
            setOptionSlug(generateSlug(name));
        }
    };

    const toggleFilter = (filterId) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
    };

    const getOptionsForFilter = (filterId) => {
        if (!Array.isArray(filteroptionget) || !filterId) return [];

        // Handle multiple possible field names and data structures
        const options = filteroptionget.filter(option => {
            // Direct comparison
            if (option.filterId === filterId) return true;

            // If filterId is an object with _id
            if (option.filterId?._id === filterId) return true;

            // String comparison (handles ObjectId vs string)
            if (String(option.filterId) === String(filterId)) return true;

            // Alternative field name 'filter'
            if (option.filter === filterId) return true;
            if (option.filter?._id === filterId) return true;
            if (String(option.filter) === String(filterId)) return true;

            return false;
        });

        return options;
    };

    const loading = filterLoading || optionLoading;
    const error = filterError || optionError;
    const success = filterSuccess || optionSuccess;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-5">
            <div className="max-w-7xl mx-auto">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-800">Filter Management</h2>
                    <button
                        onClick={showFilterModal}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Filter size={20} />
                        Add New Filter
                    </button>
                </div>

                {/* Active Filters Summary */}
                {Array.isArray(filterget) && filterget.length > 0 && (
                    <div className="mb-5 p-4 bg-gray-100 rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-semibold text-gray-700">
                                Total Filters: {filterget.length} | Total Options: {Array.isArray(filteroptionget) ? filteroptionget.length : 0}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (!Array.isArray(filterget) || filterget.length === 0) && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                    </div>
                )}

                {/* Accordion or Empty State */}
                {(!loading || (Array.isArray(filterget) && filterget.length > 0)) ? (
                    <>
                        {Array.isArray(filterget) && filterget.length > 0 ? (
                            <div className="space-y-3" key={refreshKey}>
                                {filterget.map((filter, index) => {
                                    const options = getOptionsForFilter(filter._id);
                                    const isExpanded = expandedFilters[filter._id];

                                    return (
                                        <div key={filter._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                            {/* Accordion Header */}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <button
                                                        onClick={() => toggleFilter(filter._id)}
                                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                                    >
                                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                    </button>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-gray-800">
                                                            {index + 1}. {filter.filterName}
                                                        </h3>
                                                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            {filter.filterSlug}
                                                        </code>
                                                    </div>
                                                    <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                                                        {options.length} options
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => showOptionModal(filter._id)}
                                                        disabled={loading}
                                                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus size={16} />
                                                        Add Option
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFilter(filter._id)}
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-800 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete filter"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Accordion Content */}
                                            {isExpanded && (
                                                <div className="p-4">
                                                    {options.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {options.map((option, optIndex) => (
                                                                <div
                                                                    key={option._id}
                                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-gray-500 font-medium">
                                                                            {optIndex + 1}.
                                                                        </span>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-800">
                                                                                {option.name}
                                                                            </p>
                                                                            <code className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
                                                                                {option.slug}
                                                                            </code>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteOption(option._id)}
                                                                        disabled={loading}
                                                                        className="text-red-600 hover:text-red-800 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        title="Delete option"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-6 text-gray-500">
                                                            <p className="text-sm">No options available for this filter.</p>
                                                            <button
                                                                onClick={() => showOptionModal(filter._id)}
                                                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                Add your first option
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-gray-500 text-base">No filters available. Click "Add New Filter" to create one!</p>
                            </div>
                        )}
                    </>
                ) : null}

                {/* Filter Modal */}
                {isFilterModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Add New Filter</h3>
                                <button
                                    onClick={handleCancelFilter}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-6 py-6 space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Filter Name
                                    </label>
                                    <input
                                        type="text"
                                        value={filterName}
                                        onChange={handleFilterNameChange}
                                        placeholder="Enter filter name"
                                        disabled={loading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="filter-slug"
                                        disabled={loading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={handleCancelFilter}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateFilter}
                                    disabled={loading || !filterName.trim() || !slug.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <Loader2 className="animate-spin" size={16} />}
                                    Add Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Option Modal */}
                {isOptionModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Add Filter Option</h3>
                                <button
                                    onClick={handleCancelOption}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-6 py-6 space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Option Name
                                    </label>
                                    <input
                                        type="text"
                                        value={optionName}
                                        onChange={handleOptionNameChange}
                                        placeholder="Enter option name"
                                        disabled={loading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={optionSlug}
                                        onChange={(e) => setOptionSlug(e.target.value)}
                                        placeholder="option-slug"
                                        disabled={loading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={handleCancelOption}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateOption}
                                    disabled={loading || !optionName.trim() || !optionSlug.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <Loader2 className="animate-spin" size={16} />}
                                    Add Option
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
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

export default FilterFun;