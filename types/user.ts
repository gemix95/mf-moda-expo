export interface LoginResponse {
    token: string;
    expiresAt: string;
    customerInfo: CustomerInfo
  }

  export interface CustomerInfo {
    acceptsMarketing: boolean;
    displayName: string;
    email: string;
    phone: string | null
    defaultAddress: Address | null;
    addresses: Address[] | null;
  }
  
  export interface Address {
    address1: string | null;
    address2: string | null;
    city: string | null;
    company: string | null;
    country: string;
    countryCode: string;
    firstName: string;
    id: string;
    lastName: string;
    name: string;
    phone: string | null;
    province: string | null;
    provinceCode: string | null;
    zip: string | null;
  }

  export interface OrderResponse {
    numberOfOrders: string;
    orders: Order[];
  }
  
  export interface Order {
    orderNumber: number;
    processedAt: string;
    items: OrderItem[];
    totalPrice: {
      amount: string;
      currencyCode: string;
    };
    fulfillmentStatus: string;
    canceledAt?: string;
  }

  export interface OrderItem {
    title: string;
    quantity: number;
    imageUrl: string;
    vendor?: string;
    size?: string;
    price: {
      originalPrice: string;
      discountedPrice?: string;
      currencyCode?: string;
    };
  }

  export interface SignupResponse {
    token: string;
    expiresAt: string;
    customerInfo: {
      acceptsMarketing: boolean;
      displayName: string;
      email: string;
      phone: string | null;
    };
  }
  
  export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }