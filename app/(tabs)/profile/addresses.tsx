import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/services/authStore';

export default function AddressesScreen() {
  const { customerInfo } = useAuthStore();
  const defaultAddress = useAuthStore((state) => state.customerInfo?.defaultAddress);
  const addresses = useAuthStore((state) => state.customerInfo?.addresses || []);

  if (!customerInfo?.addresses || customerInfo.addresses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="location-off" size={64} color="#999" />
        <Text style={styles.emptyText}>Nessun indirizzo salvato</Text>
        <Text style={styles.emptySubtext}>
          Aggiungi un indirizzo per velocizzare il checkout
        </Text>
        <TouchableOpacity 
          style={styles.placeholderAddButton}
          onPress={() => router.push('/(tabs)/profile/new-address')}
        >
          <Text style={styles.placeholderAddButtonText}>Aggiungi indirizzo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {addresses.map((address, index) => (
        <TouchableOpacity 
        onPress={() => 
          router.push({
            pathname: '/profile/new-address',
            params: {
              addressId: address.id,
              initialData: JSON.stringify(address)
            }
          })
        }
        >
        <View key={index} style={styles.addressCard}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressText}>
            {address.address1}
            {address.address2 ? `, ${address.address2}` : ''}
          </Text>
          <Text style={styles.addressText}>
            {address.zip}, {address.city}, {address.country}
          </Text>

          {defaultAddress?.id === address.id && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
  },
  addressCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  placeholderAddButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  placeholderAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});