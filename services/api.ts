import { CartAvailabilityResponse, CheckoutPayload, CheckoutResponse } from '@/types/cart';
import { Config } from '@/types/config';
import { Country } from '@/types/country';
import { HomepageResponse } from '@/types/homepage';
import { BrandsResponse, CategoriesResponse, GetProductsParams, Product, ProductsResponse } from '@/types/product';
import { LoginResponse, OrderResponse } from '@/types/user';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
// Import the raw store instead of the hook
import { useCountryStore } from './countryStore';

const BASE_URL = 'https://michelefranzese.moda';

// Function to get headers with country code
const getHeaders = () => {
    const state = useCountryStore.getState();
    const countryCode = state.selectedCountry?.isoCode;
    
    let headers = {
      'language': 'it',
      'mf-moda-token': 'vtyujbiuqtvu65699baj90',
      'app-version': Constants.expoConfig?.version || '1.0.0',
      'so': `Android ${Platform.Version}`,
      'countryCode': countryCode || 'IT',
    };

    console.log(headers)
    return headers
};

export const api = {
  async getBrands(): Promise<BrandsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/json/brands`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
  
  // Update all other methods to use getHeaders() instead of defaultHeaders
  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/json/categories`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },

  // Continue updating all other methods similarly
  // For example:
  async getProducts(params: GetProductsParams): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
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
        ...getHeaders(),
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
      headers: getHeaders(),
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
        ...getHeaders(),
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
    const response = await fetch(`${BASE_URL}/api/v1/cart/automaticCoupon`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  },
  // Add to your api object
  async createCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/cart/checkout`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  },
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
  
    return data;
  },

  async fetchOrders(token: string): Promise<OrderResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/user/orders`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });

    const dataJson = await response.json();

    if (!response.ok) {
      throw new Error(dataJson.error || 'Fetch orders failed');
    }
  
    return dataJson.data
  },

  async fetchCountries(): Promise<[Country]> {
      const response = await fetch(`${BASE_URL}/api/v1/json/countries`, {
        method: 'GET',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return (data.availableCountries || []);
  },
};