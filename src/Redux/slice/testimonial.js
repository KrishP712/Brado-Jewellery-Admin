import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/admin/testimonial";

// CREATE TESTIMONIAL
export const createTestimonial = createAsyncThunk(
  "testimonial/create",
  async (testimonialData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/create`, testimonialData);
      dispatch(getAllTestimonials());
      return res.data.testimonial;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET ALL TESTIMONIALS
export const getAllTestimonials = createAsyncThunk(
  "testimonial/getAll",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/all?page=${page}&limit=12`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE TESTIMONIAL
export const deleteTestimonial = createAsyncThunk(
  "testimonial/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete/${id}`);
      dispatch(getAllTestimonials());
      return res.data.testimonial?._id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// TOGGLE TESTIMONIAL FEATURE
export const toggleTestimonial = createAsyncThunk(
  "testimonial/toggle",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_BASE}/toggle/${id}`);
      dispatch(getAllTestimonials());
      return res.data.test;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const testimonialslice = createSlice({
  name: "testimonial",
  initialState: {
    loading: false,
    isError: null,
    testimonialCreated: [],
    testimonialList: [],
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE TESTIMONIAL
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonialCreated = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
      })

      // GET ALL TESTIMONIALS
      .addCase(getAllTestimonials.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonialList = action.payload.testimonials || [];
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(getAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
      })

      // DELETE TESTIMONIAL
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.testimonialList = state.testimonialList.filter(
            (t) => t._id !== action.payload
          );
        }
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
      })

      // TOGGLE TESTIMONIAL
      .addCase(toggleTestimonial.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(toggleTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.testimonialList.findIndex(
            (t) => t._id === action.payload._id
          );
          if (index !== -1) {
            state.testimonialList[index] = action.payload;
          }
        }
      })
      .addCase(toggleTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
      });
  },
});

export default testimonialslice.reducer;