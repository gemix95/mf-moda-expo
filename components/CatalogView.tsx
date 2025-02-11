import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Product } from '@/types/product';
import { useProductStore } from '@/types/productStore';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';

interface CatalogViewProps {
  sector?: string;
  subCategory?: string;
  brand?: string;
  onlySale?: boolean;
  collectionId?: string;
  path: string;
}

export function CatalogView({ sector, subCategory, brand, onlySale, collectionId, path }: CatalogViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [sector, subCategory, brand, onlySale, collectionId]);

  const loadProducts = async () => {
    if (collectionId) {
      try {
        const response = await api.getProductsByCollection({
          countryCode: 'IT',
          collectionId
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await api.getProducts({
          countryCode: 'IT',
          sector,
          subCategory,
          brand,
          onlySale,
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.catalogContainer}>
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => {
              useProductStore.getState().setSelectedProduct(item);
              let fullPath = `/${path}/product`
              router.push(fullPath as any);
            }}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {item.originalPrice && (
              <View style={styles.saleTag}>
                <Text style={styles.saleText}>
                  -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
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
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    catalogContainer: {
      padding: 8,
    },
  });