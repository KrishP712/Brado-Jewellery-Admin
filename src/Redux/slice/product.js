import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/admin/products";

// Create Product
export const productcreate = createAsyncThunk(
  "product/create",
  async (data, { dispatch, rejectWithValue }) => {
    console.log(data);
    try {
      const res = await axios.post(`${API_BASE}/create`, data, {
        withCredentials: true,
      });
      dispatch(getproduct());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to create product");
    }
  }
);

// Get All Products
export const getproduct = createAsyncThunk(
  "product/get",
  async (query = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/all`, {
        params: query,  // ✅ send page, limit to backend
        withCredentials: true,
      });
      console.log(res.data);
      return res.data.data; // backend returns {products, totalPages, currentPage}
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);
// Get Product By ID
export const getproductById = createAsyncThunk(
  "product/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/${id}`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch product");
    }
  }
);

// Delete Product
export const deleteproduct = createAsyncThunk(
  "product/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete/${id}`, {
        withCredentials: true,
      });
      dispatch(getproduct());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete product");
    }
  }
);

// Update Product
export const updateproduct = createAsyncThunk(
  "product/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    console.log(data);
    try {
      const res = await axios.put(`${API_BASE}/update/${id}`, data.product, {
        withCredentials: true,
      });
      dispatch(getproduct());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update product");
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    isError: null,
    productget: [],
    selectedProduct: null,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.isError = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getproduct.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productget = {
          products: action.payload.products || [],
          totalPages: action.payload.totalPages || 1,
          currentPage: action.payload.currentPage || 1,
        };
      })
      .addCase(getproduct.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })

      // Get Product By ID
      .addCase(getproductById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getproductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product;
        state.message = action.payload.message;
      })
      .addCase(getproductById.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || action.error.message;
      })

      // Create Product
      .addCase(productcreate.pending, (state) => {
        state.createLoading = true;
        state.isError = null;
      })
      .addCase(productcreate.fulfilled, (state, action) => {
        state.createLoading = false;
        state.message = action.payload.message;
      })
      .addCase(productcreate.rejected, (state, action) => {
        state.createLoading = false;
        state.isError = action.payload || action.error.message;
      })

      // Update Product
      .addCase(updateproduct.pending, (state) => {
        state.updateLoading = true;
        state.isError = null;
      })
      .addCase(updateproduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.message = action.payload.message;
      })
      .addCase(updateproduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.isError = action.payload || action.error.message;
      })

      // Delete Product
      .addCase(deleteproduct.pending, (state) => {
        state.deleteLoading = true;
        state.isError = null;
      })
      .addCase(deleteproduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteproduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.isError = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearMessage, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;