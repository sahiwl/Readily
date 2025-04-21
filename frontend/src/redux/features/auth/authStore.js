import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getBaseUrl } from '../../../utils/baseURL';

// We don't need to access the token directly since it's in HTTP-only cookies
// We only need to store the user information and authentication state
const loadUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("Found user in localStorage:", user);
      return {
        user,
        isAuthenticated: true,
        loading: false
      };
    }
  } catch (error) {
    console.error('Error loading auth state from storage:', error);
  }
  
  console.log("No user found in localStorage");
  return {
    user: null,
    isAuthenticated: false,
    loading: false
  };
};

const initialState = loadUser();
console.log("Initial auth state:", initialState);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    setAuthInfo: (state, action) => {
      const { user } = action.payload;
      console.log("Setting auth info:", { 
        user: user ? "User provided" : "No user"
      });
      state.user = user;
      state.isAuthenticated = !!user;
      state.loading = false;
      
      // Save user data to localStorage (NOT the token, which is in HTTP-only cookie)
      if (user) localStorage.setItem('user', JSON.stringify(user));
    },
    setAuthenticated: (state, action) => {
      console.log("Setting authenticated:", action.payload);
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      console.log("Logging out user");
      
      // Send logout request to clear the auth cookie
      axios.post(`${getBaseUrl()}/api/auth/logout`, {}, { 
        withCredentials: true 
      })
      .catch(err => console.error("Error during logout:", err));
      
      // Clear state
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage (only user data, not token)
      localStorage.removeItem('user');
    },
    checkAuth: (state) => {
      // Make a request to a protected endpoint to verify if the cookie is still valid
      state.loading = true;
      axios.get(`${getBaseUrl()}/api/auth/check`, { 
        withCredentials: true 
      })
      .then(response => {
        if (response.data.authenticated) {
          state.isAuthenticated = true;
          state.user = response.data.user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem('user');
        }
      })
      .catch(() => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      .finally(() => {
        state.loading = false;
      });
    }
  },
});

// Export actions
export const { 
  setUser, 
  setAuthInfo, 
  setAuthenticated,
  logout, 
  checkAuth
} = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoading = (state) => state.auth.loading;

// Export reducer
export default authSlice.reducer;