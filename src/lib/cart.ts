
// Cart utility functions to centralize cart operations

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

const CART_STORAGE_KEY = 'kitcheniaCart';

// Get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  if (!cart) return [];
  try {
    return JSON.parse(cart);
  } catch (error) {
    console.error('Error parsing cart data:', error);
    return [];
  }
};

// Add an item to the cart
export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number): void => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  dispatchCartUpdatedEvent();
};

// Update item quantity in the cart
export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  const cart = getCartItems();
  
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity = quantity;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    dispatchCartUpdatedEvent();
  }
};

// Remove an item from the cart
export const removeFromCart = (itemId: string): void => {
  const cart = getCartItems();
  const updatedCart = cart.filter(cartItem => cartItem.id !== itemId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  dispatchCartUpdatedEvent();
};

// Clear the entire cart
export const clearCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
  dispatchCartUpdatedEvent();
};

// Calculate total number of items in cart
export const getCartItemCount = (): number => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Calculate total price of all items in cart
export const getCartTotal = (): number => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Dispatch an event when cart is updated
export const dispatchCartUpdatedEvent = (): void => {
  window.dispatchEvent(new Event('cartUpdated'));
};
