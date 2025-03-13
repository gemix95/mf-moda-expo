import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api';
import { Product } from '@/types/product';

interface WishlistStore {
  productIds: string[];
  products: Product[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  productIds: [],
  products: [],
  
  addItem: async (productId) => {
    const newIds = [...get().productIds, productId];
    await AsyncStorage.setItem('wishlist', JSON.stringify(newIds));
    set({ productIds: newIds });
    await get().loadWishlist();
  },
  
  removeItem: async (productId) => {
    const newIds = get().productIds.filter(id => id !== productId);
    await AsyncStorage.setItem('wishlist', JSON.stringify(newIds));
    set({ 
      productIds: newIds,
      products: get().products.filter(p => p.id !== productId)
    });
  },
  
  isInWishlist: (productId) => {
    return get().productIds.includes(productId);
  },
  
  loadWishlist: async () => {
    try {
      const stored = await AsyncStorage.getItem('wishlist');
      const ids = stored ? JSON.parse(stored) : [];
      set({ productIds: ids });
      
      if (ids.length > 0) {
        const products = await api.getProductsByIds(ids);
        set({ products: products });
      } else {
        set({ products: [] });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  },
}));