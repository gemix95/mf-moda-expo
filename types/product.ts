export interface ProductSize {
  size: string;
  standardSizeClothing: string | null;
  standardSizeShoes: string | null;
  quantity: number;
  price: number;
  originalPrice?: number;
  currencyCode: string;
  variantId: string;
}

export interface Product {
  id: string;
  brand: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  subCategory: string;
  sector: string;
  storeUrl: string;
  color: string;
  season: string;
  publishedAt: string;
  availableForSale: boolean;
  images: string[];
  inSale: boolean;
  isIcon: boolean;
  dateUpdated: string;
  currencyCode: string;
  price: number;
  originalPrice?: number;
  sizeLadder: string;
  recommendSize: boolean;
  sizes: ProductSize[];
}