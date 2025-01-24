import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollablePicker } from '@/components/ScrollablePicker';
import { LoadingScreen } from '@/components/LoadingScreen';
import { router } from 'expo-router';

export default function BrandsScreen() {
  const [sectors, setSectors] = useState<{ name: string; brands: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('Uomo');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await api.getBrands();
      setSectors(data.sectors);
      setSelectedSector(data.sectors[0]?.name || 'Uomo');
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentSectorBrands = sectors
    .find(sector => sector.name === selectedSector)?.brands || [];

  const filteredBrands = currentSectorBrands
    .filter(brand => brand.toLowerCase().includes(searchText.toLowerCase()))
    .sort();

  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, string[]>);

  const sections = Object.entries(groupedBrands).sort(([a], [b]) => a.localeCompare(b));

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      
      <ScrollablePicker
        items={sectors.map(sector => ({
          id: sector.name,
          label: sector.name,
        }))}
        selectedId={selectedSector}
        onSelect={setSelectedSector}
      />

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={sections}
        keyExtractor={([letter]) => letter}
        renderItem={({ item: [letter, brandsList] }) => (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>{letter}</Text>
              {brandsList.map((brand) => (
                <View key={brand} style={styles.brandRow}>
                  <TouchableOpacity 
                    style={styles.brandNameContainer}
                    onPress={() => {
                      router.push({
                        pathname: '/brands/catalog',
                        params: {
                          sector: selectedSector,
                          brand: brand
                        }
                      });
                    }}
                  >
                    <Text style={styles.brandName}>{brand}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="favorite-border"
                      size={24}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categories: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategory: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryText: {
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  loader: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '300'
  },
  brandNameContainer: {
    flex: 1,
    paddingRight: 16,
  },
});