import React from 'react'
import { useAuth } from '../context/AuthContext'
import {Navigate} from 'react-router-dom'

export const PrivateRoute = ({children}) => {
  const {currentUser, loading} = useAuth()
  if(currentUser){
    return children;
  }
  if(loading){
    return <h1>Loading......</h1>
  }
    return <Navigate to="/login" replace/>
}
