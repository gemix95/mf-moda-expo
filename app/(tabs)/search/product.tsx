import React from 'react';
import { useProductStore } from '@/types/productStore';
import { ProductView } from '@/components/ProductView';

export default function ProductScreen() {
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  if (!selectedProduct) return null;

  return <ProductView product={selectedProduct} />;
}