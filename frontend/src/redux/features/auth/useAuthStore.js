import { useDispatch, useSelector } from 'react-redux';
import { 
  selectUser,
  selectIsAuthenticated, 
  selectLoading,
  setUser,
  setAuthInfo,
  setAuthenticated,
  logout,
  checkAuth
} from './authStore';
import { loadUserCart } from '../cart/cartSlice';
import { auth } from '../../../firebase/firebase.config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';
import { getBaseUrl } from '../../../utils/baseURL';
import { useEffect } from 'react';

// Google provider for Firebase auth
const googleProvider = new GoogleAuthProvider();

// Configure axios defaults for cookies
axios.defaults.withCredentials = true;

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading);

  // Setup Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const { email, displayName, photoURL, uid } = firebaseUser;
        
        // Create user object from Firebase user
        const userData = {
          email,
          username: displayName || email.split('@')[0],
          photo: photoURL,
          uid,
          provider: 'firebase'
        };
        
        // Update Redux
        dispatch(setUser(userData));
        dispatch(setAuthenticated(true));
        
        // Load user's cart
        dispatch(loadUserCart());
        
        console.log("Firebase auth state changed - user logged in:", userData.username);
      } else {
        // If we're using Firebase auth and the user signs out, update Redux
        if (user?.provider === 'firebase' || user?.provider === 'google') {
          console.log("Firebase auth state changed - user logged out");
          dispatch(logout());
        }
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Check authentication status by verifying cookie
  const verifyAuth = () => {
    dispatch(checkAuth());
    return isAuthenticated;
  };

  // Firebase authentication methods
  const registerWithFirebase = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { email: userEmail, displayName, photoURL, uid } = userCredential.user;
      
      // Save user to Redux store
      dispatch(setUser({
        email: userEmail,
        username: displayName || email.split('@')[0],
        photo: photoURL,
        uid,
        provider: 'firebase'
      }));
      
      dispatch(setAuthenticated(true));
      
      // Load user's cart (might be empty for new users)
      dispatch(loadUserCart());
      
      return userCredential;
    } catch (error) {
      console.error('Firebase registration error:', error);
      throw error;
    }
  };

  const loginWithFirebase = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, displayName, photoURL, uid } = userCredential.user;
      
      // Save user to Redux store
      const userData = {
        email: userEmail,
        username: displayName || email.split('@')[0],
        photo: photoURL,
        uid,
        provider: 'firebase'
      };
      
      dispatch(setUser(userData));
      dispatch(setAuthenticated(true));
      
      // Load user's cart
      dispatch(loadUserCart());
      
      return { user: userData };
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { email, displayName, photoURL, uid } = result.user;
      
      // Save user to Redux store
      const userData = {
        email,
        username: displayName || email.split('@')[0],
        photo: photoURL,
        uid,
        provider: 'google'
      };
      
      dispatch(setUser(userData));
      dispatch(setAuthenticated(true));
      
      // Load user's cart
      dispatch(loadUserCart());
      
      console.log("Google login successful, user set in store:", userData.username);
      
      return { user: userData };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // Backend API authentication methods
  const loginWithBackend = async (userData) => {
    try {
      // withCredentials: true ensures cookies are sent with the request
      const response = await axios.post(`${getBaseUrl()}/api/auth/user`, userData, {
        headers: { 'Content-type': 'application/json' },
        withCredentials: true
      });
      
      const { user } = response.data;
      
      // Save auth info to Redux store (only user data, token is in HTTP-only cookie)
      dispatch(setAuthInfo({ 
        user: { ...user, provider: 'backend' }
      }));
      
      // Load user's cart
      dispatch(loadUserCart());
      
      console.log("Backend login successful");
      
      return response.data;
    } catch (error) {
      console.error('Backend login error:', error);
      throw error;
    }
  };

  const adminLoginWithBackend = async (userData) => {
    try {
      // withCredentials: true ensures cookies are sent with the request
      const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, userData, {
        headers: { 'Content-type': 'application/json' },
        withCredentials: true
      });
      
      const { user } = response.data;
      
      // Save auth info to Redux store (only user data, token is in HTTP-only cookie)
      dispatch(setAuthInfo({ 
        user: { ...user, provider: 'backend', role: 'admin' }
      }));
      
      // Load user's cart (even admins might have carts)
      dispatch(loadUserCart());
      
      console.log("Admin login successful");
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  // Logout from both Firebase and our backend
  const logoutUser = async () => {
    try {
      // If user is logged in with Firebase, sign out
      if (user?.provider === 'firebase' || user?.provider === 'google') {
        await signOut(auth);
      }
      
      // Clear Redux state and cookie via backend
      dispatch(logout());
      
      console.log("User logged out successfully");
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    checkAuth: verifyAuth,
    registerWithFirebase,
    loginWithFirebase,
    loginWithGoogle,
    loginWithBackend,
    adminLoginWithBackend,
    logoutUser,
    setUser: (user) => dispatch(setUser(user))
  };
};