  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "axios";

  const API_BASE = "http://localhost:4000/admin/media";

  // CREATE MEDIA
  export const createMedia = createAsyncThunk(
    "media/create",
    async (formData, { dispatch, rejectWithValue }) => {
      try {
        const res = await axios.post(`${API_BASE}/create`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(getMedia());
        return res.data.mediaData;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const getMedia = createAsyncThunk(
    "media/get",
    async (page=1, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${API_BASE}/all?page=${page}&limit=10`);
        return res.data; 
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );


  // DELETE MEDIA
  export const deleteMedia = createAsyncThunk(
    "media/delete",
    async (id, { dispatch, rejectWithValue }) => {
      try {
        const res = await axios.delete(`${API_BASE}/delete/${id}`);
        dispatch(getMedia());
        return res.data.media?._id;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const mediaSlice = createSlice({
    name: "media",
    initialState: {
      loading: false,
      isError: null,
      mediaCreated: [],
      mediaList: [],   
      totalPages: 1,
      currentPage: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // CREATE MEDIA
        .addCase(createMedia.pending, (state) => { state.loading = true; state.isError = null; })
        .addCase(createMedia.fulfilled, (state, action) => { 
          state.loading = false; 
          state.mediaCreated = Array.isArray(action.payload) ? action.payload : [action.payload]; 
          
        })
        .addCase(createMedia.rejected, (state, action) => { state.loading = false; state.isError = action.payload; })

        // GET MEDIA
        .addCase(getMedia.pending, (state) => { state.loading = true; state.isError = null; })
        .addCase(getMedia.fulfilled, (state, action) => {
          state.loading = false;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.mediaList = action.payload.media || [];
        })
        .addCase(getMedia.rejected, (state, action) => { state.loading = false; state.isError = action.payload; })


        // DELETE MEDIA
        .addCase(deleteMedia.pending, (state) => { state.loading = true; state.isError = null; })
        .addCase(deleteMedia.fulfilled, (state, action) => {
          state.loading = false;
          if (action.payload) {
            state.mediaList = state.mediaList.filter(m => m._id !== action.payload);
          }
        })
        .addCase(deleteMedia.rejected, (state, action) => { state.loading = false; state.isError = action.payload; });
    },
  });

  export default mediaSlice.reducer;
