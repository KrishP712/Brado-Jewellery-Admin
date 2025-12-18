import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/admin/filteroption";

// Create filter option
export const createFilterOption = createAsyncThunk(
    "filteroption/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/create`, data);
            dispatch(getFilterOption());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get all filter options
export const getFilterOption  = createAsyncThunk(
    "filteroption/get",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/all`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update filter option
export const updateFilterOption  = createAsyncThunk(
    "filteroption/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.put(`${BASE_URL}/update/${id}`, data);
            dispatch(getFilterOption());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete filter option
export const deleteFilterOption = createAsyncThunk(
    "filteroption/delete",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const res = await axios.delete(`${BASE_URL}/delete/${id}`);
            dispatch(getFilterOption());
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const filteroptionslice = createSlice({
    name: "filteroption",
    initialState: {
        loading: false,
        isError: null,
        ilteroptionget: [],
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
            // Get filter options
            .addCase(getFilterOption.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(getFilterOption.fulfilled, (state, action) => {
                state.loading = false;
                state.FilterOptionget = action.payload.data || [];
            })
            .addCase(getFilterOption.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || "Failed to fetch filter options";
            })
            
            // Create filter option
            .addCase(createFilterOption.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(createFilterOption.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(createFilterOption.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || "Failed to create filter option";
            })
            
            // Update filter option
            .addCase(updateFilterOption.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(updateFilterOption.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateFilterOption.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || "Failed to update filter option";
            })
            
            // Delete filter option
            .addCase(deleteFilterOption.pending, (state) => {
                state.loading = true;
                state.isError = null;
            })
            .addCase(deleteFilterOption.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteFilterOption.rejected, (state, action) => {
                state.loading = false;
                state.isError = action.payload || "Failed to delete filter option";
            });
    },
});

export const { clearMessages } = filteroptionslice.actions;
export default filteroptionslice.reducer;