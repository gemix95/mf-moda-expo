import { CartAvailabilityResponse, CheckoutPayload, CheckoutResponse } from '@/types/cart';
import { Config } from '@/types/config';
import { Country } from '@/types/country';
import { HomepageResponse } from '@/types/homepage';
import { BrandsResponse, CategoriesResponse, GetProductsParams, Product, ProductsResponse } from '@/types/product';
import { LoginResponse, LoyaltyInfo, OrderResponse, SignupRequest, SignupResponse, SpendingRulesResponse } from '@/types/user';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
// Import the raw store instead of the hook
import { useCountryStore } from './countryStore';
import { useLanguageStore } from './languageStore';

const BASE_URL = 'https://michelefranzese.moda';

// Function to get headers with country code
const getHeaders = () => {
    const countryState = useCountryStore.getState();
    const languageState = useLanguageStore.getState();
    const countryCode = countryState.selectedCountry?.isoCode;
    
    let headers = {
      'language': languageState.language || 'it',
      'mf-moda-token': 'vtyujbiuqtvu65699baj90',
      'app-version': Constants.expoConfig?.version || '1.0.0',
      'so': `Android ${Platform.Version}`,
      'countryCode': countryCode || 'IT',
    };

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
  
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/user/signup`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  },
  
  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/api/v1/wishlist`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: productIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const json = await response.json();
    return json.data;
  },
  
  async getCorrelatedProducts(params: {
    countryCode: string;
    category: string;
    subCategory: string;
    sector: string;
  }): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/products/correlated`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch correlated products');
    }
  
    return response.json();
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/api/v1/products/search`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      throw new Error('Search failed');
    }
  
    let json = await response.json()
    return json.data;
  },

  async addAddress(token: string, address: { 
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      country: string;
      phone: string;
      province: string;
      zip: string;
    }) {
    const response = await fetch(`${BASE_URL}/api/v1/user/address/add`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, address }),
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }
  
    return data;
  },
  
  async updateAddress(token: string, addressId: string, address: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    country: string;
    phone: string;
    province: string;
    zip: string;
  }) {
    const response = await fetch(`${BASE_URL}/api/v1/user/address/update`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, addressId, address }),
    });
  
    const data = await response.json();
   
    if (!response.ok) {
      throw new Error(data.message);
    }
  
    return data;
  },
  
  async deleteAddress(token: string, addressId: string) {
    const response = await fetch(`${BASE_URL}/api/v1/user/address/delete`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, addressId }),
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }
  
    return data;
  },

  async getLoyaltyInfo(email: string): Promise<LoyaltyInfo> {
    const response = await fetch(`${BASE_URL}/api/v1/user/loyalty/info`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch loyalty info');
    }

    return data.data;
  },

  async getLoyaltyActivity(email: string, accessToken: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/v1/user/loyalty/activity`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, accessToken }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch loyalty activity');
    }

    return data.data;
  },

  async forgotPassword(email: any) {
    const response = await fetch(`${BASE_URL}/api/v1/user/password`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const data = await response.json();
    return data;
  },
  async getSpendingRules(email: string, accessToken: string): Promise<SpendingRulesResponse> {
      const response = await fetch(`${BASE_URL}/api/v1/user/loyalty/spendingRules`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, accessToken }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch spending rules');
      }
  
      return data.data;
    },
  
  async redeemPoints(data: { 
    accessToken: string;
    ruleId: number;
    customerIdentifier: number;
  }): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/api/v1/user/loyalty/redeem`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to redeem points');
    }
  
    return result;
  },

  async getNewArrivals({ sector, limit }: { sector: string; limit: number }): Promise<ProductsResponse> {
    const countryState = useCountryStore.getState();    
    const countryCode = countryState.selectedCountry?.isoCode;

    const response = await fetch(`${BASE_URL}/api/v1/products/new`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ countryCode, sector, limit }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch new arrivals');
    }

    return response.json();
  },
  
  // Add to your existing api methods
  async applyCoupon(data: { 
      variants: Array<{ id: string, quantity: number }>, 
      couponCode: string 
    }): Promise<CartAvailabilityResponse> {
      const response = await fetch(`${BASE_URL}/api/v1/cart/coupon`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message);
      }
  
      return result;
    },
};
