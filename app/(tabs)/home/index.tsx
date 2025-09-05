import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
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
import { useLanguageStore } from '@/services/languageStore';
import { Config } from '@/types/config';
import { isVersionLower } from '@/utils/version';
import Constants from 'expo-constants';
import { useConfigStore } from '@/services/configStore';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  // Update the banner state type
  const [banner, setBanner] = useState<{ message: string; visible: boolean; style?: string } | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const { preferredSector } = useShoppingPreferencesStore();
  const { productIds } = useWishlistStore();
  const { translations } = useLanguageStore();
  const { config } = useConfigStore();

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
        <LinearGradient
          colors={
            banner.style === 'spatial' 
              ? ['#c865ef', '#5cdcee']
              : ['#fdf1d3', '#fcd7c2']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={[
            styles.bannerText,
            { color: banner.style === 'spatial' ? '#fff' : '#000' }
          ]}>
            {banner.message}
          </Text>
        </LinearGradient>
      )}

    {config?.update.showUpdateCardAndroid && 
       isVersionLower(Constants.expoConfig?.version || '0.0.0', config?.update.lastVersionOnPlayStore) && (
        <View style={styles.updateCard}>
          <View style={styles.updateContent}>
            <Text style={styles.updateText}>
              {translations.home.updateAvailable}
            </Text>
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={() => {
                Linking.openURL('market://details?id=com.mfmoda.android');
              }}
            >
              <Text style={styles.updateButtonText}>
                {translations.common.update}
              </Text>
            </TouchableOpacity>
          </View>
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
          <View style={styles.collectionTextAbove}>
            <Text style={styles.collectionName}>{firstCollection.name}</Text>
            {firstCollection.description ? (
              <Text style={styles.collectionDescription}>{firstCollection.description}</Text>
            ) : null}
          </View>
          <Image
            source={{ uri: firstCollection.image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {newArrivals.length > 0 && (
        <View style={styles.newArrivalsSection}>
          <Text style={styles.sectionTitle}>{translations.newArrivals.title}</Text>
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
          <View style={styles.collectionTextAbove}>
            <Text style={styles.collectionName}>{remainingCollections[0].name}</Text>
            {remainingCollections[0].description ? (
              <Text style={styles.collectionDescription}>{remainingCollections[0].description}</Text>
            ) : null}
          </View>
          <Image
            source={{ uri: remainingCollections[0].image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {wishlistProducts.length > 0 && (
        <View style={styles.newArrivalsSection}>
          <Text style={styles.sectionTitle}>{translations.profile.menu.wishlist}</Text>
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
          <View style={styles.collectionTextAbove}>
            <Text style={styles.collectionName}>{collection.name}</Text>
            {collection.description ? (
              <Text style={styles.collectionDescription}>{collection.description}</Text>
            ) : null}
          </View>
          <Image
            source={{ uri: collection.image || undefined }}
            style={styles.collectionImage}
            resizeMode="cover"
          />
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
  collectionTextOverlay: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.0)', // transparent, but you can add a slight background if needed
  },
  collectionTextAbove: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  collectionName: {
    color: '#111',
    fontSize: 24,
    fontWeight: '600',
  },
  collectionDescription: {
    color: '#888',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 4,
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
  updateBanner: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  updateBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  updateCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  updateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  updateText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 16,
  },
  updateButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});