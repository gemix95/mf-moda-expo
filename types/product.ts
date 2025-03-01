export interface ProductsResponse {
  products: Product[];
}

export interface GetProductsParams {
  countryCode: string;
  subCategory?: string;
  brand?: string;
  sector?: string;
  onlySale?: boolean;
  collectionId?: string
}

export interface Sector {
  name: string;
  brands: string[];
}

export interface BrandsResponse {
  sectors: Sector[];
}

export interface SubCategory {
    category: string;
    subCategories: string[];
}
  
export interface SectorData {
    sector: string;
    categories: SubCategory[];
    categoriesInSale: SubCategory[];
}
  
export interface CategoriesResponse {
    data: SectorData[];
}

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