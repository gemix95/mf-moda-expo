import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { MaterialIcons } from '@expo/vector-icons';
import { SizeSelector } from '@/components/SizeSelector';
import { useWishlistStore } from '@/services/wishlistStore';
import { useEffect } from 'react';
import { api } from '@/services/api';
import { useCountryStore } from '@/services/countryStore';
import { useRouter } from 'expo-router';
import { useProductStore } from '@/types/productStore';

interface ProductViewProps {
  product: Product;
  path: string;
}

export function ProductView({ product, path }: ProductViewProps) {
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = async () => {
    if (isWishlisted) {
      await removeItem(product.id);
    } else {
      await addItem(product.id);
    }
  };

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRelatedProducts();
  }, [product]);

  const loadRelatedProducts = async () => {
    try {
      const response = await api.getCorrelatedProducts({
        countryCode: useCountryStore.getState().selectedCountry?.isoCode || 'IT',
        category: product.category,
        subCategory: product.subCategory,
        sector: product.sector,
      });
      setRelatedProducts(response.products);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <FlatList
          style={styles.flatList}
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(ev) => {
            const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        />

        <View style={styles.pagination}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentImageIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description}>{product.shortDescription}</Text>
          <View style={styles.priceContainer}>
            {product.originalPrice && (
              <>
                <Text style={[styles.price, styles.originalPrice]}>
                {product.currencyCode} {product.originalPrice.toFixed(2)}
                </Text>
                <Text style={styles.salePrice}>
                {product.currencyCode} {product.price.toFixed(2)}
                </Text>
              </>
            )}
            {!product.originalPrice && (
              <Text style={styles.price}>
                {product.currencyCode} {product.price.toFixed(2)}
              </Text>
            )}
          </View>

          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Related Products</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={relatedProducts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.relatedCard}
                    onPress={() => {
                      useProductStore.getState().setSelectedProduct(item);
                      let fullPath = `/${path}/product`
                      router.replace(fullPath as any);
                    }}
                  >
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.relatedInfo}>
                      <Text style={styles.relatedBrand}>{item.brand}</Text>
                      <Text style={styles.relatedPrice}>
                        {item.currencyCode} {item.price.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowSizeSelector(true)}
        >
          <Text style={styles.addButtonText}>Add to cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={handleWishlist}
        >
          <MaterialIcons 
            name={isWishlisted ? "favorite" : "favorite-border"} 
            size={24} 
            color="#000" 
          />
        </TouchableOpacity>
      </View>

      <SizeSelector
        isVisible={showSizeSelector}
        onClose={() => setShowSizeSelector(false)}
        onSelectSize={(selectedSize) => {
          console.log('Selected size:', selectedSize);
        }}
        sizes={product.sizes}
        productPrice={product.price}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollView: {
      flex: 1,
    },
    flatList: { 
        marginTop: 24
    },
    image: {
      width,
      height: width * 1.2,
    },
    pagination: {
      flexDirection: 'row',
      paddingTop: 16,
      width: '100%',
      justifyContent: 'center',
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(205, 205, 205, 0.5)',
    },
    paginationDotActive: {
      backgroundColor: '#000',
    },
    details: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 16
    },
    brand: {
      fontSize: 32,
      fontWeight: '600',
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#666',
      marginBottom: 16,
    },
    salePrice: {
      fontSize: 14,
      fontWeight: '500',
      color: '#468866',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16
    },
    price: {
      fontSize: 14,
      fontWeight: '500',
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      color: '#999',
    },
    footer: {
      padding: 16,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    addButton: {
      flex: 1,
      backgroundColor: '#000',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'light',
    },
    wishlistButton: {
      padding: 14,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: '#000',
    },
  relatedSection: {
    marginTop: 24,
    paddingBottom: 16,
  },
  relatedTitle: {
    fontSize: 21,
    fontWeight: '500',
    marginBottom: 16,
    marginTop: 16
  },
  relatedCard: {
    width: 200,
    marginRight: 16,
  },
  relatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  relatedInfo: {
    marginTop: 8,
  },
  relatedBrand: {
    fontSize: 14,
    fontWeight: '500',
  },
  relatedPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});