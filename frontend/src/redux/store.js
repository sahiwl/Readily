import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../redux/features/cart/cartSlice'
import booksApi from './features/books/booksApi'
import ordersApi from './features/orders/ordersApi'
import authReducer from './features/auth/authStore'
import googleBooksReducer from './features/googleBooks/googleBooksSlice'

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    googleBooks: googleBooksReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, ordersApi.middleware)
})