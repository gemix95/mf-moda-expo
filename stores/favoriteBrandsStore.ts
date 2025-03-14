import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteBrandsStore {
  favoriteBrands: string[];
  toggleFavorite: (brand: string) => void;
  loadFavorites: () => Promise<void>;
}

export const useFavoriteBrandsStore = create<FavoriteBrandsStore>((set, get) => ({
  favoriteBrands: [],
  toggleFavorite: (brand: string) => {
    const currentFavorites = get().favoriteBrands;
    const newFavorites = currentFavorites.includes(brand)
      ? currentFavorites.filter(b => b !== brand)
      : [...currentFavorites, brand];
    
    AsyncStorage.setItem('favoriteBrands', JSON.stringify(newFavorites));
    set({ favoriteBrands: newFavorites });
  },
  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteBrands');
      if (stored) {
        set({ favoriteBrands: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  },
}));