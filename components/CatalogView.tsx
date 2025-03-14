import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Product, ProductsResponse } from '@/types/product';
import { useProductStore } from '@/types/productStore';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useCountryStore } from '@/services/countryStore';
import { ScrollView } from 'react-native';

interface CatalogViewProps {
  sector?: string;
  subCategory?: string;
  brand?: string;
  onlySale?: boolean;
  collectionId?: string;
  path: string;
}

export function CatalogView({ sector, subCategory, brand, onlySale, collectionId, path }: CatalogViewProps) {
  const [productResponse, setProductResponse] = useState<ProductsResponse>();
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const selectedCountry = useCountryStore();

  useEffect(() => {
    loadProducts();
  }, [sector, subCategory, brand, onlySale, collectionId, selectedCountry]);

  const loadProducts = async () => {
    if (collectionId) {
      try {
        const response = await api.getProductsByCollection({
          countryCode: selectedCountry.selectedCountry?.isoCode ?? 'IT',
          collectionId
        });
        setProductResponse(response);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await api.getProducts({
          countryCode: selectedCountry.selectedCountry?.isoCode ?? 'IT',
          sector,
          subCategory,
          brand,
          onlySale,
        });
        setProductResponse(response);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProducts = productResponse?.products.filter(product => 
    !selectedFilter || product.brand === selectedFilter || product.subCategory === selectedFilter
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          ((productResponse?.brands && productResponse.brands.length > 1) || 
           (productResponse?.subCategories && productResponse.subCategories.length > 1)) ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            >
              <TouchableOpacity
                style={[styles.filterChip, !selectedFilter && styles.filterChipActive]}
                onPress={() => setSelectedFilter(null)}
              >
                <Text style={[styles.filterText, !selectedFilter && styles.filterTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              
              {((productResponse?.brands && productResponse.brands.length > 1) ? productResponse.brands : 
                (productResponse?.subCategories && productResponse.subCategories.length > 1) ? productResponse.subCategories : 
                []).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterChip, selectedFilter === item && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(item)}
                >
                  <Text style={[styles.filterText, selectedFilter === item && styles.filterTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null
        }
        data={filteredProducts}
        numColumns={2}
        renderItem={({ item }) => (
          // Update the renderItem in the FlatList to include the overlay
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => {
              useProductStore.getState().setSelectedProduct(item);
              let fullPath = `/${path}/product`
              router.push(fullPath as any);
            }}
          >
            <View>
              <Image
                source={{ uri: item.images[0] }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </View>
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
              <Text style={styles.season}>{item.season}</Text>
              <View style={styles.priceContainer}>
                {item.originalPrice && (
                  <>
                    <Text style={[styles.price, styles.originalPrice]}>
                    {item.currencyCode} {item.originalPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.salePrice}>
                    {item.currencyCode} {item.price.toFixed(2)}
                    </Text>
                  </>
                )}
                {!item.originalPrice && (
                  <Text style={styles.price}>
                    {item.currencyCode} {item.price.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

  // Update styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productCard: {
      flex: 1,
      margin: 4,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      aspectRatio: 3/4,
      marginVertical: 16,
      alignSelf: 'center',
      resizeMode: 'cover',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000',
      opacity: 0.1,
    },
    productInfo: {
      paddingTop: 8,
      paddingBottom: 16,
      backgroundColor: '#fff',
    },
    saleTag: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: '#468866',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 16,
    },
    saleText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: '400',
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
      backgroundColor: '#fff',
    },
    filtersContent: {
      paddingHorizontal: 12,
      paddingBottom: 8,
      paddingTop: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: '#f5f5f5',
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: '#000',
    },
    filterText: {
      fontSize: 16,
      color: '#666',
    },
    filterTextActive: {
      color: '#fff',
    },
  });