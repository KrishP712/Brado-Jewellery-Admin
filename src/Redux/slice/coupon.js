import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/admin/coupon"; // Updated to match coupon API endpoint

export const createCoupon = createAsyncThunk(
    "coupon/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log(data);
            const res = await axios.post(`${API_BASE_URL}/create`, data);
            dispatch(getCoupons());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCoupons = createAsyncThunk(
    "coupon/get",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/all?page=${page}&limit=12`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCouponById = createAsyncThunk(
    "coupon/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/all/${id}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCoupon = createAsyncThunk(
    "coupon/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/update/${id}`, data);
            dispatch(getCoupons());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    "coupon/delete",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/delete/${id}`);
            dispatch(getCoupons());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const toggleCouponActive = createAsyncThunk(
    "coupon/toggleActive",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/toggle/${id}`);
            dispatch(getCoupons());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const couponslice = createSlice({
    name: "coupon",
    initialState: {
        loading: false,
        isError: null,
        coupons: [],
        selectedCoupon: null,
        successMessage: null,
        totalPages: 1,
        currentPage: 1,
        totalCoupons: 0
    },
    reducers: {
        clearMessages: (state) => {
            state.isError = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Coupons
            .addCase(getCoupons.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.coupons || [];
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalCoupons = action.payload.totalCoupons;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Get Coupon by ID
            .addCase(getCouponById.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getCouponById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCoupon = action.payload.coupon || null;
            })
            .addCase(getCouponById.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Create Coupon
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Update Coupon
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Delete Coupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            })

            // Toggle Coupon Active
            .addCase(toggleCouponActive.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(toggleCouponActive.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(toggleCouponActive.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.error || action.error.message;
            });
    },
});

export const { clearMessages } = couponslice.actions;
export default couponslice.reducer;