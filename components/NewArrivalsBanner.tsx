import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useLanguageStore } from '@/services/languageStore';

interface NewArrivalsBannerProps {
  sector: string;
}

const getCollectionId = (sector: string): number => {
  switch (sector) {
    case 'Donna':
      return 611591258443;
    case 'Uomo':
      return 611595092299;
    case 'Bambino':
      return 611727147339;
    case 'Bambina':
      return 611727114571;
    case 'Casa':
      return 611725214027;
    default:
      return 611591258443;
  }
};

export function NewArrivalsBanner({ sector }: NewArrivalsBannerProps) {
  const { translations } = useLanguageStore();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push({
        pathname: '/search/catalog',
        params: {
          sector,
          subCategory: null,
          brand: null,
          collectionId: getCollectionId(sector),
          title: `${translations.newArrivals.title} ${sector}`
        }
      })}
    >
      <Text style={styles.title}>{translations.newArrivals.title}</Text>
      <Text style={styles.subtitle}>{translations.newArrivals.subtitle}</Text>
      <Text style={styles.link}>{translations.newArrivals.discover}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5EA',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
});