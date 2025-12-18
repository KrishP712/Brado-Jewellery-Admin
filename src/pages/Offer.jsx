import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, X } from "lucide-react";
import {
    createOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    toggleOfferActive,
} from "../Redux/slice/offer";

export default function OffersManagement() {
    const dispatch = useDispatch();
    const { offers, loading, totalPages, currentPage, totalItems } = useSelector((state) => state?.offer);
    const offersData = offers?.data;
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState(null);
    const [offerType, setOfferType] = useState("percentage");
    const [formData, setFormData] = useState({
        value: "",
        minQuantity: "1",
        startDate: "",
        endDate: "",
        active: true,
    });

    // ✅ Fetch all offers on mount
    useEffect(() => {
        dispatch(getOffers(page));
    }, [dispatch, page]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = (id) => {
        dispatch(toggleOfferActive(id));
    };

    const handleDeleteOffer = (id) => {
        if (window.confirm("Are you sure you want to delete this offer?")) {
            dispatch(deleteOffer(id));
        }
    };

    const handleEditOffer = (offer) => {
        setIsEditMode(true);
        setEditingOfferId(offer._id);
        setOfferType(offer.offerType);
        setFormData({
            value: offer.value,
            minQuantity: offer.minQuantity.toString(),
            startDate: offer.startDate
                ? new Date(offer.startDate).toISOString().split("T")[0]
                : "",
            endDate: offer.endDate
                ? new Date(offer.endDate).toISOString().split("T")[0]
                : "",
            active: offer.active,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            value: "",
            minQuantity: "1",
            startDate: "",
            endDate: "",
            active: true,
        });
        setOfferType("percentage");
        setIsEditMode(false);
        setEditingOfferId(null);
    };

    // ✅ “Buy & Get” Title Auto-Generation
    const generateTitle = () => {
        if (!formData.value || !formData.minQuantity) return "Enter details to preview";
        if (offerType === "percentage") {
            return `Buy ${formData.minQuantity} & Get ${formData.value}% OFF`;
        } else {
            return `Buy ${formData.minQuantity} & Get ₹${formData.value} OFF`;
        }
    };

    const handleSubmit = () => {
        const autoTitle = generateTitle();

        const offerData = {
            title: autoTitle,
            offerType,
            value: Number(formData.value),
            minQuantity: Number(formData.minQuantity),
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
            active: formData.active,
        };

        if (isEditMode) {
            dispatch(updateOffer({ id: editingOfferId, data: offerData }));
        } else {
            dispatch(createOffer(offerData));
        }

        setShowModal(false);
        resetForm();
    };

    const formatValue = (offer) =>
        offer.offerType === "percentage"
            ? `${offer.value}% OFF`
            : `₹${offer.value} OFF`;

    const formatDate = (date) =>
        !date
            ? "No expiry"
            : new Date(date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Offers Management
                        </h1>
                        <p className="text-blue-100">Manage special offers and discounts</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        Add Offer
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Offers Table */}
            {!loading && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-700 to-cyan-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Title
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Value
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Min Qty
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Valid Until
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-100">
                                {offersData?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-slate-500"
                                        >
                                            No offers available. Create your first offer!
                                        </td>
                                    </tr>
                                ) : (
                                    offersData?.map((offer) => (
                                        <tr
                                            key={offer._id}
                                            className={`hover:bg-blue-50 transition-colors ${offer.active ? "opacity-100" : "opacity-60"
                                                }`}
                                        >
                                            <td className="px-6 py-4 text-slate-700 font-medium">
                                                {offer.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-blue-600 font-bold">
                                                    {formatValue(offer)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {offer.minQuantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={
                                                        offer.active ? "text-slate-600" : "text-red-400"
                                                    }
                                                >
                                                    {formatDate(offer.endDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${offer.active
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {offer.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditOffer(offer)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActive(offer._id)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${offer.active ? "bg-emerald-500" : "bg-slate-300"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offer.active
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOffer(offer._id)}
                                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
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
            )
            }

            {/* Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl">
                                <h2 className="text-xl font-bold text-white">
                                    {isEditMode ? "Edit Offer" : "Create New Offer"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {/* Info Banner */}
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-semibold">Offer Preview:</span>
                                        <br />
                                        {generateTitle()}
                                    </p>
                                </div>

                                {/* Offer Type */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Offer Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setOfferType("percentage")}
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${offerType === "percentage"
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                }`}
                                        >
                                            <span className="text-lg">%</span>
                                            Percentage
                                        </button>
                                        <button
                                            onClick={() => setOfferType("fixed")}
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${offerType === "fixed"
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                }`}
                                        >
                                            <span className="text-lg">₹</span>
                                            Fixed Amount
                                        </button>
                                    </div>
                                </div>

                                {/* Discount Value */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {offerType === "percentage"
                                            ? "Discount Percentage (%)"
                                            : "Fixed Amount (₹)"}
                                    </label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Minimum Quantity */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Minimum Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="minQuantity"
                                        value={formData.minQuantity}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Start Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                active: !prev.active,
                                            }))
                                        }
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.active ? "bg-emerald-500" : "bg-slate-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.active ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm font-semibold text-slate-700">
                                        Active Offer
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.value || !formData.minQuantity}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEditMode ? "Update Offer" : "Create Offer"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
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
        </div >
    );
}
