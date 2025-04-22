import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../redux/features/cart/cartSlice'
import ordersApi from './features/orders/ordersApi'
import authReducer from './features/auth/authStore'
import googleBooksReducer from './features/googleBooks/googleBooksSlice'

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    googleBooks: googleBooksReducer,
    [ordersApi.reducerPath]: ordersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersApi.middleware)
})