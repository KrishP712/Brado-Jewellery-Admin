import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/admin/carousel';

// Async thunks
export const createCarousel = createAsyncThunk(
    'carousel/create',
    async (carouselData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/create`, carouselData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllCarousels = createAsyncThunk(
    'carousel/getAll',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/all?page=${page}&limit=12`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCarouselById = createAsyncThunk(
    'carousel/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/all/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCarousel = createAsyncThunk(
    'carousel/update',
    async ({ id, carouselData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update/${id}`, carouselData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCarousel = createAsyncThunk(
    'carousel/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    carousels: [],
    selectedCarousel: null,
    loading: false,
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
    error: null,
    message: null,
};

// Slice
const carouselslice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearSelectedCarousel: (state) => {
            state.selectedCarousel = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create carousel
            .addCase(createCarousel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCarousel.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.carousels.push(action.payload.carousel);
            })
            .addCase(createCarousel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create carousel';
            })

            // Get all carousels
            .addCase(getAllCarousels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCarousels.fulfilled, (state, action) => {
                state.loading = false;
                state.carousels = action.payload.carousel || [];
                state.message = action.payload.message;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(getAllCarousels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch carousels';
            })

            // Get carousel by ID
            .addCase(getCarouselById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCarouselById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCarousel = action.payload.carousel?.[0] || null;
                state.message = action.payload.message;
            })
            .addCase(getCarouselById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch carousel';
            })

            // Update carousel
            .addCase(updateCarousel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarousel.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                const index = state.carousels.findIndex(
                    (c) => c._id === action.payload.carousel._id
                );
                if (index !== -1) {
                    state.carousels[index] = action.payload.carousel;
                }
            })
            .addCase(updateCarousel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update carousel';
            })

            // Delete carousel
            .addCase(deleteCarousel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCarousel.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.carousels = state.carousels.filter(
                    (c) => c._id !== action.payload.carousel._id
                );
            })
            .addCase(deleteCarousel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete carousel';
            });
    },
});

export const { clearError, clearMessage, clearSelectedCarousel } = carouselslice.actions;
export default carouselslice.reducer;