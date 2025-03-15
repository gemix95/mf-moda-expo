import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '@/locales/en';
import { it } from '@/locales/it';

type Language = 'it' | 'en';

interface LanguageStore {
  language: Language;
  translations: typeof it;
  setLanguage: (lang: Language) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'it',
  translations: it,
  setLanguage: async (lang) => {
    await AsyncStorage.setItem('@selected_language', lang);
    set({ 
      language: lang,
      translations: lang === 'it' ? it : en
    });
  },
  initialize: async () => {
    const savedLang = await AsyncStorage.getItem('@selected_language');
    if (savedLang === 'en' || savedLang === 'it') {
      set({ 
        language: savedLang,
        translations: savedLang === 'it' ? it : en
      });
    }
  }
}));