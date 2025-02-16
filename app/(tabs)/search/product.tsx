import React from 'react';
import { useProductStore } from '@/types/productStore';
import { ProductView } from '@/components/ProductView';
import { Stack } from 'expo-router';

export default function ProductScreen() {
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  if (!selectedProduct) return null;

  return (
    <>
      <Stack.Screen 
        options={{
          title: selectedProduct.brand
        }} 
      />
      <ProductView product={selectedProduct} />
    </>
  );
}