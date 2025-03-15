import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useWishlistStore } from '@/services/wishlistStore';
import { useProductStore } from '@/types/productStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLanguageStore } from '@/services/languageStore';

export default function WishlistScreen() {
  const { products, removeItem, loadWishlist } = useWishlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const { translations, language } = useLanguageStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadWishlist();
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen/>;
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="favorite-border" size={64} color="#999" />
        <Text style={styles.emptyText}>{translations.wishlist.emptyTitle}</Text>
        <Text style={styles.emptySubtext}>
          {translations.wishlist.emptyDescription}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => {
              useProductStore.getState().setSelectedProduct(item);
              router.push('../profile/product');
            }}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <View>
                  <Text style={styles.brandName}>{item.brand}</Text>
                  <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.wishlistButton}
                  onPress={() => removeItem(item.id)}
                >
                  <MaterialIcons name="favorite" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.priceContainer}>
                {item.originalPrice ? (
                  <>
                    <Text style={[styles.price, styles.originalPrice]}>
                      {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
                        style: 'currency',
                        currency: item.currencyCode
                      }).format(item.originalPrice)}
                    </Text>
                    <Text style={styles.salePrice}>
                      {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
                        style: 'currency',
                        currency: item.currencyCode
                      }).format(item.price)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.price}>
                    {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
                      style: 'currency',
                      currency: item.currencyCode
                    }).format(item.price)}
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 120,
    height: 160,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wishlistButton: {
    padding: 8,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#468866',
  },
  season: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});