import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';

// Helper function to load cart items from localStorage with user-specific carts
const loadCartItems = () => {
  try {
    // Get the current user from localStorage
    const userStr = localStorage.getItem('user');
    let userId = "guest"; // Default for non-logged in users
    
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user.email || user.username || user.uid || "guest";
    }
    
    // Get cart for this specific user
    const savedCart = localStorage.getItem(`cart_${userId}`);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

// Helper function to save cart items to localStorage with user-specific carts
const saveCartItems = (cartItems) => {
  try {
    // Get the current user from localStorage
    const userStr = localStorage.getItem('user');
    let userId = "guest"; // Default for non-logged in users
    
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user.email || user.username || user.uid || "guest";
    }
    
    // Save cart for this specific user
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
    cartItems: loadCartItems()
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            const exisistingItem = state.cartItems.find(item => item._id === action.payload._id);
            if(!exisistingItem){
                state.cartItems.push(action.payload);
                // Save to localStorage with user-specific key
                saveCartItems(state.cartItems);
                
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Product added to the cart",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Already added to the cart",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay"
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
            // Save to localStorage with user-specific key
            saveCartItems(state.cartItems);
        },
        clearCart: (state) => {
            state.cartItems = [];
            // Remove from localStorage for current user
            saveCartItems([]);
        },
        // New action to load user's cart when they log in
        loadUserCart: (state) => {
            state.cartItems = loadCartItems();
        }
    }
})

// Export the actions
export const { addToCart, removeFromCart, clearCart, loadUserCart } = cartSlice.actions;
export default cartSlice.reducer;