import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/admin/authAdmin";
axios.defaults.withCredentials = true;

export const adminlogin = createAsyncThunk(
  "admin/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Save token from response
      if (res.data.success && res.data.user && res.data.user.token) {
        localStorage.setItem("token", res.data.user.token);
      }

      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const adminlogout = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem("token");
      return res.data;
    } catch (error) {
      // Remove token even if request fails
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const changepassword = createAsyncThunk(
  "admin/changepassword",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/changepassword`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password change failed");
    }
  }
);

const adminslice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    isError: null,
    admin: null,
    isAuthenticated: !!localStorage.getItem("token"),
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.isError = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      state.isAuthenticated = !!token;
      if (!token) {
        state.admin = null;
      }
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.successMessage = null;
      state.isError = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(adminlogin.pending, (state) => {
        state.loading = true;
        state.isError = null;
        state.successMessage = null;
      })
      .addCase(adminlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || "Login successful!";
      })
      .addCase(adminlogin.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.admin = null;
      })

      // Logout cases
      .addCase(adminlogout.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(adminlogout.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.successMessage = action.payload.message || "Logout successful!";
      })
      .addCase(adminlogout.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.isError = action.payload || "Logout failed";
      })

      // Change password cases
      .addCase(changepassword.pending, (state) => {
        state.loading = true;
        state.isError = null;
        state.successMessage = null;
      })
      .addCase(changepassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Password changed successfully!";
      })
      .addCase(changepassword.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload || "Password change failed";
      });
  }
});

export const { clearError, clearSuccess, checkAuth, logout } = adminslice.actions;
export default adminslice.reducer;