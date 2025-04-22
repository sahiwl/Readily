import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getBaseUrl } from '../../../utils/baseURL';


const API_URL = getBaseUrl();

// Async thunks for fetching Google Books data
export const fetchTrendingBooks = createAsyncThunk(
  'googleBooks/fetchTrending',
  async (maxResults = 12, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/books/google-books/trending?maxResults=${maxResults}`);
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch trending books');
    }
  }
);

export const fetchBooksByCategory = createAsyncThunk(
  'googleBooks/fetchByCategory',
  async ({ category, maxResults = 12 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/books/google-books/category/${category.toLowerCase()}?maxResults=${maxResults}`
      );
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || `Failed to fetch ${category} books`);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'googleBooks/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/books/google-books/${id}`);
      return response.data.book;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch book details');
    }
  }
);

export const fetchSimilarBooks = createAsyncThunk(
  'googleBooks/fetchSimilar',
  async ({ id, maxResults = 6 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/books/google-books/similar/${id}?maxResults=${maxResults}`);
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch similar books');
    }
  }
);

export const fetchNewReleases = createAsyncThunk(
  'googleBooks/fetchNewReleases',
  async (maxResults = 12, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/books/google-books/new-releases?maxResults=${maxResults}`);
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch new releases');
    }
  }
);

export const searchBooks = createAsyncThunk(
  'googleBooks/search',
  async ({ query, maxResults = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/books/google-books?q=${query}&maxResults=${maxResults}`);
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search books');
    }
  }
);

export const fetchRecommendedBooks = createAsyncThunk(
  'googleBooks/fetchRecommended',
  async ({ preferences = [], recentlyViewed = [], maxResults = 25 }, { rejectWithValue }) => {
    try {
      // Ensure preferences and recentlyViewed are properly handled as arrays
      const prefsArray = Array.isArray(preferences) ? preferences : [preferences].filter(Boolean);
      const recentArray = Array.isArray(recentlyViewed) ? recentlyViewed : [recentlyViewed].filter(Boolean);
      
      // join arrays for URL parameters, filter out empty strings
      const prefsParam = prefsArray.filter(p => p).join(',');
      const recentParam = recentArray.filter(id => id).join(',');
      
      console.log('Fetching recommended books with params:', { 
        preferences: prefsParam, 
        recentlyViewed: recentParam, 
        maxResults 
      });
      
      // Make the API request
      const response = await axios.get(
        `${API_URL}/books/google-books/recommended?preferences=${prefsParam}&recentlyViewed=${recentParam}&maxResults=${maxResults}`
      );
      
      // Log success
      console.log('Recommended books fetched successfully:', response.data);
      return response.data.books;
    } catch (error) {
      console.error('Error fetching recommended books:', error);
      // Provide more detailed error information
      return rejectWithValue(
        error.response?.data?.error || 
        `Failed to fetch recommended books: ${error.message}`
      );
    }
  }
);

const googleBooksSlice = createSlice({
  name: 'googleBooks',
  initialState: {
    trendingBooks: [],
    categoryBooks: [],
    newReleases: [],
    searchResults: [],
    currentBook: null,
    similarBooks: [],
    recommendedBooks: [],
    loading: false,
    error: null,
    currentCategory: 'Choose a genre'
  },
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
      state.similarBooks = [];
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTrendingBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingBooks.fulfilled, (state, action) => {
        state.trendingBooks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrendingBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      .addCase(fetchBooksByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksByCategory.fulfilled, (state, action) => {
        state.categoryBooks = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooksByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.currentBook = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Similar books
      .addCase(fetchSimilarBooks.pending, (state) => {
        // We don't set loading=true here to avoid affecting the main book display
        state.error = null;
      })
      .addCase(fetchSimilarBooks.fulfilled, (state, action) => {
        state.similarBooks = action.payload;
      })
      .addCase(fetchSimilarBooks.rejected, (state, action) => {
        state.error = action.payload;
      })
      

      .addCase(fetchNewReleases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewReleases.fulfilled, (state, action) => {
        state.newReleases = action.payload;
        state.loading = false;
      })
      .addCase(fetchNewReleases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      .addCase(fetchRecommendedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedBooks.fulfilled, (state, action) => {
        state.recommendedBooks = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentCategory, clearCurrentBook } = googleBooksSlice.actions;
export default googleBooksSlice.reducer;