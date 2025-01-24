import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function SalesScreen() {
  const { sector, categories } = useLocalSearchParams();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const salesCategories = JSON.parse(categories as string);

  return (
    <ScrollView style={styles.container}>
      {salesCategories.map(({ category, subCategories }: { category: string, subCategories: string[] }) => (
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
                        countryCode: 'IT',
                        sector: sector,
                        subCategory: subCategory,
                        onlySale: 'true'
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});