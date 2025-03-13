import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShoppingPreferencesStore {
  preferredSector: string;
  setPreferredSector: (sector: string) => Promise<void>;
  initializePreferences: () => Promise<void>;
}

export const useShoppingPreferencesStore = create<ShoppingPreferencesStore>((set) => ({
  preferredSector: 'Donna',
  setPreferredSector: async (sector) => {
    try {
      await AsyncStorage.setItem('preferredSector', sector);
      set({ preferredSector: sector });
    } catch (error) {
      console.error('Error saving preferred sector:', error);
    }
  },
  initializePreferences: async () => {
    try {
      const savedSector = await AsyncStorage.getItem('preferredSector');
      set({ preferredSector: savedSector || 'Donna' });
    } catch (error) {
      console.error('Error loading preferred sector:', error);
      set({ preferredSector: 'Donna' });
    }
  },
}));