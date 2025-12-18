import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/admin/filter";

export const createfilter = createAsyncThunk(
    "filter/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/create`, data);
            dispatch(getfilter());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getfilter = createAsyncThunk(
    "filter/get",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/all?page=${page}&limit=12`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const editfilter = createAsyncThunk(
    "filter/edit",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/edit/${id}`, data);
            dispatch(getfilter());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deletefilter = createAsyncThunk(
    "filter/delete",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/delete/${id}`);
            dispatch(getfilter());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const filterslice = createSlice({
    name: "filter",
    initialState: {
        loading: false,
        isError: null,
        filterget: [],
        successMessage: null,
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
    },
    reducers: {
        clearMessages: (state) => {
            state.isError = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Filter
            .addCase(getfilter.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getfilter.fulfilled, (state, action) => {
                state.loading = false;
                state.filterget = action.payload.data || [];
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(getfilter.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.message || action.error.message;
            })

            // Create Filter
            .addCase(createfilter.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(createfilter.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(createfilter.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.message || action.error.message;
            })

            // Edit Filter
            .addCase(editfilter.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(editfilter.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(editfilter.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.message || action.error.message;
            })

            // Delete Filter
            .addCase(deletefilter.pending, (state) => {
                state.loading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(deletefilter.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deletefilter.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload?.message || action.error.message;
            });
    },
});

export const { clearMessages } = filterslice.actions;
export default filterslice.reducer;