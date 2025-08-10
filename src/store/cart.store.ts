import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// This is the type for the items we'll store in the cart
export type CartItem = {
  id: string;
  title: string;
  price: number;
  img: string;
  quantity: number;
};

// This is the type for the entire store's state and actions
type CartState = {
  items: CartItem[];
  // This signature now accepts a quantity parameter
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  // Use `persist` middleware to save the cart state to localStorage
  persist(
    (set) => ({
      items: [],

      // Action to add an item (or items) to the cart
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            // If item already exists, increase its quantity by the specified amount
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // Otherwise, add the new item with the specified quantity
            return { items: [...state.items, { ...product, quantity }] };
          }
        }),

      // Action to completely remove an item from the cart
      removeFromCart: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      // Action to increase or decrease an item's quantity
      updateQuantity: (itemId, action) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQuantity =
                  action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
            .filter((item) => item.quantity > 0), // Remove item if quantity becomes 0
        })),

      // Action to clear the entire cart
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // Name for the item in localStorage
    }
  )
);