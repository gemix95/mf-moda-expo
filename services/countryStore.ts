import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Country = {
  name: string;
  isoCode: string;
  currency: {
    name: string;
    symbol: string;
    isoCode: string;
  };
};

type CountryStore = {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  initializeCountry: () => Promise<void>;
};

export const useCountryStore = create<CountryStore>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (country) => {
    set({ selectedCountry: country });
  },
  initializeCountry: async () => {
    try {
      const storedCountry = await AsyncStorage.getItem('selectedCountry');
      if (storedCountry) {
        const country = JSON.parse(storedCountry);
        set({ selectedCountry: country });
      } else {
        // Set default country if none is saved
        const defaultCountry = {
          name: "Italia",
          isoCode: "IT",
          currency: {
            name: "Euro",
            symbol: "€",
            isoCode: "EUR"
          }
        };
        set({ selectedCountry: defaultCountry });
        await AsyncStorage.setItem('selectedCountry', JSON.stringify(defaultCountry));
      }
    } catch (error) {
      console.error('Failed to load country from storage:', error);
    }
  },
}));