import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { ScrollablePicker } from '@/components/ScrollablePicker';
import { router } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NewArrivalsBanner } from '@/components/NewArrivalsBanner';
import { useCountryStore } from '@/services/countryStore';
import { SearchProducts } from '@/components/SearchProducts';
import { useLanguageStore } from '@/services/languageStore';

export default function SearchScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('Uomo');
  const [searchText, setSearchText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const selectedCountry = useCountryStore();
  const [isSearching, setIsSearching] = useState(false);
  const { translations } = useLanguageStore();
  const currentSectorData = categories.find(item => item.sector === selectedSector);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.data);
      setSelectedSector(response.data[0]?.sector || 'Uomo');
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setIsSearching(!!text);
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={translations.search.placeholder}
          value={searchText}
          onChangeText={handleSearchChange}
        />
        {isSearching && (
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
              setIsSearching(false);
            }}
          >
            <Text style={styles.cancelButton}>{translations.common.cancel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <SearchProducts initialQuery={searchText} />
      ) : (
        <>
          <ScrollablePicker
            items={categories.map(item => ({
              id: item.sector,
              label: item.sector,
            }))}
            selectedId={selectedSector}
            onSelect={setSelectedSector}
          />

          <ScrollView style={styles.categoriesContainer}>
            <NewArrivalsBanner sector={selectedSector}/>

            {currentSectorData?.categoriesInSale?.length > 0 && (
              <View style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => {
                    router.push({
                      pathname: '/search/sales',
                      params: {
                        sector: selectedSector,
                        categories: JSON.stringify(currentSectorData.categoriesInSale)
                      }
                    });
                  }}
                >
                  <Text style={[styles.categoryTitle, styles.salesTitle]}>{translations.search.sales}</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#468866" />
                </TouchableOpacity>
              </View>
            )}

            {currentSectorData?.categories.map(({ category, subCategories }: { category: string, subCategories: string[] }) => (
              <View key={category} style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <MaterialIcons
                    name={expandedCategories.includes(category) ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
                
                {expandedCategories.includes(category) && (
                  <View style={styles.subCategoriesList}>
                    {subCategories.map(subCategory => (
                      <TouchableOpacity
                        key={subCategory}
                        style={styles.subCategoryItem}
                        onPress={() => {
                          router.push({
                            pathname: '/search/catalog',
                            params: {
                              countryCode: selectedCountry.selectedCountry?.isoCode ?? 'IT',
                              sector: selectedSector,
                              subCategory: subCategory
                            }
                          });
                        }}
                      >
                        <Text style={styles.subCategoryText}>{subCategory}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#999" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

// Add to StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSector: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sectorText: {
    color: '#000',
  },
  selectedSectorText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
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
  categoriesContainer: {
    marginTop: 16,
    flex: 1,
  },
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  subCategoriesList: {
    paddingLeft: 32,
    paddingRight: 16,
    paddingBottom: 8,
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
  },
  salesTitle: {
    color: '#468866',
    fontWeight: '600',
  },
  cancelButton: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
  },
});