import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../redux/features/auth/useAuthStore'

export const PrivateRoute = ({children}) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const { checkAuth } = useAuthStore();
  
  // Verify token isn't expired
  React.useEffect(() => {
    checkAuth();
  }, []);
  
  if (isAuthenticated) {
    return children;
  }
  
  if (loading) {
    return <h1>Loading......</h1>
  }
  
  return <Navigate to="/login" replace/>
}
