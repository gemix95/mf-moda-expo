import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { api } from '@/services/api';
import { Product } from '@/types/product';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function CatalogScreen() {
  const { sector, subCategory, brand, onlySale } = useLocalSearchParams<{ 
    sector: string; 
    subCategory?: string;
    brand?: string;
    onlySale?: string;
  }>();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [sector, subCategory]);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts({
        countryCode: 'IT',
        sector,
        subCategory,
        brand,
        ...(onlySale === 'true' && { onlySale: true }),
      });
      setProducts(response.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.productImage}
      />
      {item.inSale && item.originalPrice && (
        <View style={styles.saleTag}>
          <Text style={styles.saleText}>
            {Math.round((1 - item.price / item.originalPrice) * 100)}%
          </Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.brandName}>{item.brand}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <>
              <Text style={[styles.price, styles.originalPrice]}>
                € {item.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.salePrice}>
                € {item.price.toFixed(2)}
              </Text>
            </>
          )}
          {!item.originalPrice && (
            <Text style={styles.price}>
              € {item.price.toFixed(2)}
            </Text>
          )}
        </View>
        <Text style={styles.season}>{item.season}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '90%',
    aspectRatio: 6/9,
    margin: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  
  saleTag: {
    position: 'absolute',
    top: 250,
    left: 8,
    backgroundColor: '#468866',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
  },
  saleText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  productInfo: {
    padding: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '500',
  },
  productTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  salePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#468866',
  },
  season: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});