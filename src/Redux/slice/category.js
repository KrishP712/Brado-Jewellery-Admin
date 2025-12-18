import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/admin/category";

// Create category
export const createCategory = createAsyncThunk(
  "category/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/create`, formData);
      dispatch(getCategory());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all categories
export const getCategory = createAsyncThunk(
  "category/getAll",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/all?page=${page}&limit=12`);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get category by ID
export const getCategoryById = createAsyncThunk(
  "category/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/all/${id}`);
      return res.data; // { success, message, data }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete/${id}`);
      dispatch(getCategory());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_BASE}/update/${id}`, data);
      dispatch(getCategory()); // Fixed: was getcategorys()
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categoryslice = createSlice({
  name: "category",
  initialState: {
    loading: false,
    isError: null,
    Categoryget: [],
    selectedCategory: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    totalPages: 1,
    currentPage: 1,
    totalCategories: 0
  },
  reducers: {
    resetSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearError: (state) => {
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.Categoryget = action.payload.data || [];
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCategories = action.payload.totalCategories;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })
      
      // Get category by ID
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload.data;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.isError = null;
        state.createSuccess = false;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.isError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.isError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      });
  },
});

export const { resetSuccess, clearError } = categoryslice.actions;
export default categoryslice.reducer;