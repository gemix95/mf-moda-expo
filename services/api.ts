import { CartAvailabilityResponse } from '@/types/cart';
import { Config } from '@/types/config';
import { HomepageResponse } from '@/types/homepage';
import { Product } from '@/types/product';
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

const BASE_URL = 'https://michelefranzese.moda';

const defaultHeaders = {
  'countryCode': 'IT',
  'language': 'it',
  'mf-moda-token': 'vtyujbiuqtvu65699baj90',
  'app-version': Constants.expoConfig?.version || '1.0.0',
  'so': `Android ${Platform.Version}`,
};

// Add this method to your existing api object
interface ProductsResponse {
  products: Product[];
}

interface GetProductsParams {
  countryCode: string;
  subCategory?: string;
  brand?: string;
  sector?: string;
  onlySale?: boolean;
  collectionId?: string
}

export const api = {
  async getBrands(): Promise<BrandsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/json/brands`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
  
  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/json/categories`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },

  async getProducts(params: GetProductsParams): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  },

  async getProductsByCollection(params: GetProductsParams): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/products/collection`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  },

  async getConfig(): Promise<Config> {
    const response = await fetch(`${BASE_URL}/api/v1/json/config`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
  
  async getHomepage(sector: string): Promise<HomepageResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/json/homepage`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sector }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },

  async getCartAvailability(data: any): Promise<CartAvailabilityResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/cart/availability`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
};