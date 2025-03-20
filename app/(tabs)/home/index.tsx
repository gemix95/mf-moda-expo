import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { Collection } from '@/types/homepage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useShoppingPreferencesStore } from '@/services/shoppingPreferencesStore';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/services/authStore';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useWishlistStore } from '@/services/wishlistStore';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [banner, setBanner] = useState<{ message: string; visible: boolean } | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const { preferredSector } = useShoppingPreferencesStore();
  const { productIds } = useWishlistStore();

  useEffect(() => {
    Promise.all([loadHomepage(), loadNewArrivals(), loadWishlistProducts(), login()]);
  }, [preferredSector, productIds]);

  const loadNewArrivals = async () => {
    try {
      const response = await api.getNewArrivals({
        sector: preferredSector,
        limit: 25
      });
      setNewArrivals(response.products);
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    }
  };

  const loadWishlistProducts = async () => {
    if (productIds.length === 0) return;
    
    try {
      const response = await api.getProductsByIds(productIds);
      setWishlistProducts(response);
    } catch (error) {
      console.error('Error loading wishlist products:', error);
    }
  };

  const login = async () => {
    if (logged) { return }
    setLogged(true)
    const credentials = await storage.getCredentials();
    if (credentials.email && credentials.password) {
      try {
        const response = await api.login(credentials.email, credentials.password);
        useAuthStore.getState().login(
          response.token,
          response.expiresAt,
          response.customerInfo
        );
      } catch (error) {
        await storage.clearCredentials();
      }
    }
  }

  const loadHomepage = async () => {
    try {
      const response = await api.getHomepage(preferredSector);
      setBanner(response.data.banner);
      setCollections(response.data.collections);
    } catch (error) {
      console.error('Error loading homepage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const firstCollection = collections[0];
  const remainingCollections = collections.slice(1);

  return (
    <ScrollView style={styles.container}>
      {banner?.visible && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner.message}</Text>
        </View>
      )}

      {firstCollection && (
        <TouchableOpacity 
          onPress={() => {
            router.push({
              pathname: '/home/catalog',
              params: {
                sector: firstCollection.body.sector,
                subCategory: firstCollection.body.subCategory,
                brand: firstCollection.body.brand,
                collectionId: firstCollection.body.collectionId,
                onlySale: `${firstCollection.body.onlySale}`,
                title: firstCollection.name
              }
            });
          }}
          style={styles.collectionContainer}
        >
          <Image
            source={{ uri: firstCollection.image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={styles.collectionName}>{firstCollection.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {newArrivals.length > 0 && (
        <View style={styles.newArrivalsSection}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </View>
      )}

      {remainingCollections[0] && (
        <TouchableOpacity 
          key={remainingCollections[0].id}
          onPress={() => {
            router.push({
              pathname: '/home/catalog',
              params: {
                sector: remainingCollections[0].body.sector,
                subCategory: remainingCollections[0].body.subCategory,
                brand: remainingCollections[0].body.brand,
                collectionId: remainingCollections[0].body.collectionId,
                onlySale: `${remainingCollections[0].body.onlySale}`,
                title: remainingCollections[0].name
              }
            });
          }}
          style={styles.collectionContainer}
        >
          <Image
            source={{ uri: remainingCollections[0].image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={styles.collectionName}>{remainingCollections[0].name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {wishlistProducts.length > 0 && (
        <View style={styles.newArrivalsSection}>
          <Text style={styles.sectionTitle}>Your Wishlist</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </View>
      )}

      {remainingCollections.slice(1).map((collection) => (
        <TouchableOpacity 
          key={collection.id}
          onPress={() => {
            router.push({
              pathname: '/home/catalog',
              params: {
                sector: collection.body.sector,
                subCategory: collection.body.subCategory,
                brand: collection.body.brand,
                collectionId: collection.body.collectionId,
                onlySale: `${collection.body.onlySale}`,
                title: collection.name
              }
            });
          }}
          style={styles.collectionContainer}
        >
          <Image
            source={{ uri: collection.image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={styles.collectionName}>{collection.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#000',
    padding: 16,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  collectionContainer: {
    marginBottom: 1,
  },
  collectionImage: {
    width: width,
    height: width * 1.2,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  collectionName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  newArrivalsSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carousel: {
    paddingLeft: 16,
  },
});