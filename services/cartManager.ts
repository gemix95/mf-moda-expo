import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ProductSize } from '@/types/product';

interface CartItem {
  variantId: string;
  quantity: number;
  size: ProductSize;
}

interface CartStore {
  items: CartItem[];
  addItem: (size: ProductSize) => Promise<{ success: boolean; error?: string }>;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (size: ProductSize) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.variantId === size.variantId);
        
        if (existingItem) {
          if (existingItem.quantity >= size.quantity) {
            return {
              success: false,
              error: `Maximum quantity (${size.quantity}) reached for this size`
            };
          }
          
          set({
            items: currentItems.map(item =>
              item.variantId === size.variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { variantId: size.variantId, quantity: 1, size }] });
        }
        
        return { success: true };
      },
      removeItem: (variantId: string) => {
        set(state => ({
          items: state.items.filter(item => item.variantId !== variantId)
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);