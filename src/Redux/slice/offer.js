import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/admin/offer";

// ==================== CREATE OFFER ====================
export const createOffer = createAsyncThunk(
    "offer/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log(data);
            const res = await axios.post(`${API_BASE_URL}/create`, data);
            dispatch(getOffers());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== GET ALL OFFERS ====================
export const getOffers = createAsyncThunk(
    "offer/get",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/all?page=${page}&limit=12`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== GET OFFER BY ID ====================
export const getOfferById = createAsyncThunk(
    "offer/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/all/${id}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== UPDATE OFFER ====================
export const updateOffer = createAsyncThunk(
    "offer/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/update/${id}`, data);
            dispatch(getOffers());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== DELETE OFFER ====================
export const deleteOffer = createAsyncThunk(
    "offer/delete",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/delete/${id}`);
            dispatch(getOffers());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== TOGGLE OFFER ACTIVE ====================
export const toggleOfferActive = createAsyncThunk(
    "offer/toggleActive",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/toggle/${id}`);
            dispatch(getOffers());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==================== SLICE ====================
const offerslice = createSlice({
    name: "offer",
    initialState: {
        loading: false,
        isError: null,
        offers: [],
        selectedOffer: null,
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.isError = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Offers
            .addCase(getOffers.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.offers = action.payload || [];
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(getOffers.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Get Offer by ID
            .addCase(getOfferById.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getOfferById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOffer = action.payload.data || null;
            })
            .addCase(getOfferById.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Create Offer
            .addCase(createOffer.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(createOffer.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Update Offer
            .addCase(updateOffer.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(updateOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateOffer.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Delete Offer
            .addCase(deleteOffer.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteOffer.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Toggle Offer Active
            .addCase(toggleOfferActive.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(toggleOfferActive.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(toggleOfferActive.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            });
    },
});

export const { clearMessages } = offerslice.actions;
export default offerslice.reducer;