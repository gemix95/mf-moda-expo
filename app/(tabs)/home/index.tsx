import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { Collection } from '@/types/homepage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useShoppingPreferencesStore } from '@/services/shoppingPreferencesStore';
import { OneSignal } from 'react-native-onesignal';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ message: string; visible: boolean } | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const { preferredSector } = useShoppingPreferencesStore();

  useEffect(() => {
    loadHomepage();
    OneSignal.Notifications.requestPermission(true);
  }, [preferredSector]);

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

  return (
    <ScrollView style={styles.container}>
      {banner?.visible && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner.message}</Text>
        </View>
      )}

      {collections.map((collection) => (
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
});