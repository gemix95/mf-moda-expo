export interface CartAvailabilityResponse {
  data: {
    items: CartItem[];
    totalCart: {
      price: number;
      totalSavings: number;
      couponCodes: string[];
      currency: string;
    };
    message: string | null;
    banner: {
      message: string;
      style: string;
      visible: boolean;
    };
  };
}

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  size: string;
  quantityAvailable: number;
  quantitySelected: number;
  price: number;
  originalPrice: number | null;
  currency: string;
  imageUrl: string;
  description: string;
  coupon?: {
    price: number;
    applicable: boolean;
    code: string;
  };
}

  export interface CheckoutResponse {
    checkoutUrl: string;
  }
  
  export interface CheckoutPayload {
    variants: Array<{
      id: string;
      quantity: number;
    }>;
    email?: string;
    couponCode?: string;
    couponCodes?: string[];
    customerAccessToken?: string;
  }