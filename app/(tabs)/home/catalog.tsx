import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CatalogView } from '@/components/CatalogView';

export default function CatalogScreen() {
  const { sector, subCategory, brand, onlySale, collectionId } = useLocalSearchParams<{ 
    sector: string; 
    subCategory?: string;
    brand?: string;
    onlySale?: string;
    collectionId?: string;
  }>();

  return (
    <CatalogView 
      sector={sector}
      subCategory={subCategory}
      brand={brand}
      onlySale={onlySale === 'true'}
      collectionId={collectionId}
      path='home'
    />
  );
}