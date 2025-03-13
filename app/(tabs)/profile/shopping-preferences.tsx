import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { useShoppingPreferencesStore } from '@/services/shoppingPreferencesStore';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function ShoppingPreferencesScreen() {
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { preferredSector, setPreferredSector, initializePreferences } = useShoppingPreferencesStore();

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true);
        const response = await api.getCategories();
        const sectorNames = response.data.map(item => item.sector);
        setSectors(sectorNames);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePreferences();
    fetchSectors();
  }, []);

  const handleSave = async (sector: string) => {
    await setPreferredSector(sector);
    router.back();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      {sectors.map((sector) => (
        <TouchableOpacity
          key={sector}
          style={styles.sectorItem}
          onPress={() => handleSave(sector)}
        >
          <Text style={styles.sectorText}>{sector}</Text>
          {preferredSector === sector && (
            <MaterialIcons name="check" size={24} color="#000" />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  sectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectorText: {
    fontSize: 16,
  },
});