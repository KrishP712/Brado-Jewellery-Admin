import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/admin/order";

export const getallorder = createAsyncThunk(
    "order/getallorder",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE}/allorder?page=${page}&limit=10`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateorder = createAsyncThunk(
    "order/updateorder",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log(data);
            const res = await axios.post(`${API_BASE}/updateorder`, data);
            dispatch(getallorder());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const orderslice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        isError: null,
        orderget: [],
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All Orders
            .addCase(getallorder.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getallorder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderget = action.payload.data;
                state.isError = null;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(getallorder.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || action.error.message;
                state.orderget = []; // Keep as empty array, not error object
            })

            // Update Order
            .addCase(updateorder.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(updateorder.fulfilled, (state) => {
                state.loading = false;
                state.isError = null;
            })
            .addCase(updateorder.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || action.error.message;
            });
    },
});

export default orderslice.reducer;