import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCountryStore } from '@/services/countryStore';
import { Country } from '@/types/country';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MaterialIcons } from '@expo/vector-icons';

export default function SelectCountryScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCountry } = useCountryStore();

  const handleSelectCountry = async (country: Country) => {
    try {
      // Save to global state
      setSelectedCountry(country);
      
      // Save to persistent storage
      await AsyncStorage.setItem('selectedCountry', JSON.stringify(country));
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error('Failed to save country:', error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
        try {
            setLoading(true);
            const response = await api.fetchCountries();
            // Sort countries alphabetically by name
            const sortedCountries = response.sort((a, b) => a.name.localeCompare(b.name));
            setCountries(sortedCountries);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCountries();
  }, []);

  // Add selected country state
  const { selectedCountry } = useCountryStore();

  // Update the FlatList render item
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>
        Prezzo e disponibilità possono variare in base al tuo paese/regione
      </Text>
      
      <Text style={styles.sectionHeader}>Tutti i paesi</Text>
      
      <FlatList
        data={countries}
        keyExtractor={(item) => item.isoCode}
        renderItem={({ item }) => {
          const isSelected = selectedCountry?.isoCode === item.isoCode;
          return (
            <TouchableOpacity 
              style={styles.countryItem}
              onPress={() => handleSelectCountry(item)}
            >
              <Text style={[styles.countryName, isSelected && styles.selectedCountryName]}>
                {item.name}
              </Text>
              <View style={[styles.radioButton, isSelected && styles.selectedRadioButton]}>
                {isSelected && <MaterialIcons name="check" size={18} color="#000" />}
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  countryName: {
    fontSize: 16,
  },
  selectedCountryName: {
    fontWeight: '600',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});