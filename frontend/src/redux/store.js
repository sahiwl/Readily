import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../redux/features/cart/cartSlice'

export default configureStore({
  reducer: {
    cart: cartReducer
  }
})