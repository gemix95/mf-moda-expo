import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface Sector {
  name: string;
  brands: string[];
}

interface BrandsResponse {
  sectors: Sector[];
}

// Add these interfaces to your existing api.ts
interface SubCategory {
    category: string;
    subCategories: string[];
}
  
interface SectorData {
    sector: string;
    categories: SubCategory[];
    categoriesInSale: SubCategory[];
}
  
interface CategoriesResponse {
    data: SectorData[];
}

const BASE_URL = 'https://michelefranzese.moda/api/v1';

const defaultHeaders = {
  'language': 'it',
  'mf-moda-token': 'vtyujbiuqtvu65699baj90',
  'app-version': Constants.expoConfig?.version || '1.0.0',
  'so': `Android ${Platform.Version}`,
};

// Add this method to your existing api object
export const api = {
  async getBrands(): Promise<BrandsResponse> {
    const response = await fetch(`${BASE_URL}/json/brands`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
  
  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${BASE_URL}/json/categories`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  }
};