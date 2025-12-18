import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/auth/user";

// GET ALL USERS
export const getAllUsers = createAsyncThunk(
  "user/all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userslice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isError: null,
    userList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.users || [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
      });
  },
});

export default userslice.reducer;