import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { api } from '@/services/api';
import { CatalogView } from './CatalogView';
import { Product, ProductsResponse } from '@/types/product';
import { useLanguageStore } from '@/services/languageStore';

interface SearchProductsProps {
  initialQuery?: string;
}

export function SearchProducts({ initialQuery = '' }: SearchProductsProps) {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { translations } = useLanguageStore();

  useEffect(() => {
    if (initialQuery) {
      debouncedSearch(initialQuery);
    }
  }, [initialQuery]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.searchProducts(query);
      setSearchResults(response);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchProducts(query), 500),
    []
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {!loading && searchResults.length === 0 && initialQuery && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>{translations.search.noResults}</Text>
          <Text style={styles.noResultsSubtext}>{translations.search.tryDifferentKeywords}</Text>
        </View>
      )}

      {!loading && searchResults.length > 0 && (
        <CatalogView products={searchResults} path="search" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
  },
});