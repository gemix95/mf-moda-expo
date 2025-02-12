import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useCartStore } from '@/services/cartManager';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { CartAvailabilityResponse } from '@/types/cart';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen() {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<CartAvailabilityResponse['data'] | null>(null);
  const { items, removeItem } = useCartStore();

  // Add useFocusEffect to call API when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      checkAvailability();
    }, [items])
  );

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const variants = items.map(item => ({
        id: item.variantId,
        quantity: item.quantity
      }));

      const response = await api.getCartAvailability({ variants });

      if (response.data.message) {
        Alert.alert('Cart Update', response.data.message);
      }

      setCartData(response.data);

      // Update cart items availability check
      if (response.data.items.length !== items.length) {
        const availableVariantIds = response.data.items.map(item => item.variantId);
        items.forEach(item => {
          if (!availableVariantIds.includes(item.variantId)) {
            removeItem(item.variantId);
          }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check cart availability');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Update the total display in the footer
  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      {cartData?.banner?.visible && (
        <View style={[styles.banner, cartData?.banner.style === 'spatial' && styles.bannerSpatial]}>
          <Text style={styles.bannerText}>{cartData?.banner.message}</Text>
        </View>
      )}

      <ScrollView style={styles.itemsContainer}>
        {cartData?.items.map((item) => (
          <View key={item.variantId} style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.brandName}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.sizeText}>Taglia: {item.size}</Text>
              <Text style={styles.sizeText}>Qty: {item.quantitySelected}</Text>
              <View style={styles.priceContainer}>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>
                    {item.currency} {item.originalPrice.toFixed(2)}
                  </Text>
                )}
                <Text style={styles.price}>
                  {item.currency} {item.price.toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.variantId)}
            >
              <MaterialIcons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>
            {cartData?.totalCart.currency} {cartData?.totalCart.price.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Spedizione</Text>
          <Text style={styles.totalLabel}>Calcolata al Checkout</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Procedi al Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  bannerSpatial: {
    backgroundColor: '#FFF3E0',
  },
  bannerText: {
    textAlign: 'center',
    color: '#000',
  },
  itemsContainer: {
    flex: 1,
  },
  cartItem: {
    paddingVertical: 32,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sizeText: {
    fontSize: 14,
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});