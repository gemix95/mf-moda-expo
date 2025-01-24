export interface HomepageResponse {
  data: {
    banner: {
      style: string;
      message: string;
      visible: boolean;
    };
    collections: Collection[];
  };
}

export interface Collection {
  id: number;
  body: {
    brand: string | null;
    sector: string;
    category: string | null;
    onlySale: boolean;
    subCategory: string | null;
    collectionId: string | null;
    isNewArrivals: boolean;
  };
  name: string;
  type: string;
  image: string | null;
  index: number;
  video: string | null;
  visible: boolean;
  contentType: 'Image' | 'Video';
}