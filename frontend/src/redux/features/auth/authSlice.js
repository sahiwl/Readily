import { createSlice } from '@reduxjs/toolkit';

// Helper function to load initial state from localStorage (temporarily)
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      console.log("Loaded user from storage:", user);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from storage:', error);
  }
  
  console.log("No user found in storage, starting with unauthenticated state");
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState = loadUserFromStorage();
console.log("Initial auth state:", initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      console.log("Setting credentials:", { user, token });
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logoutUser: (state) => {
      console.log("Logging out user");
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }
});

export const { setCredentials, logoutUser, updateUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;