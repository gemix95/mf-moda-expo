export interface CartAvailabilityResponse {
    data: {
      items: CartItem[];
      totalCart: {
        price: number;
        currency: string | null;
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
    coupon: string | null;
  }