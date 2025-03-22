import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useCartStore } from '@/services/cartManager';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { CartAvailabilityResponse } from '@/types/cart';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/services/authStore';
import { useLanguageStore } from '@/services/languageStore';
import { TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useConfigStore } from '@/services/configStore';

export default function CartScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<CartAvailabilityResponse['data'] | null>(null);
  const { items, removeItem } = useCartStore();
  const { customerInfo, token } = useAuthStore.getState();
  const { translations } = useLanguageStore();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { config } = useConfigStore();

  useFocusEffect(
    React.useCallback(() => {
      checkAvailability();
    }, [items])
  );

  const handleCheckout = async () => {
    const hasSoldOutItems = cartData?.items.some(item => item.quantityAvailable === 0);
    
    if (hasSoldOutItems) {
      Alert.alert(
        translations.cart.soldOutAlert,
        translations.cart.soldOutMessage,
        [{ text: translations.common.ok }]
      );
      return;
    }

    try {
      setLoading(true);
      const variants = items.map(item => ({
        id: item.variantId,
        quantity: item.quantity
      }));

      const response = await api.createCheckout({ 
        variants,
        email: customerInfo?.email,
        customerAccessToken: token,
        couponCode: couponCode,
      });
      router.push(`/checkout?url=${encodeURIComponent(response.checkoutUrl)}`);
    } catch (error) {
      Alert.alert(translations.cart.errorTitle, translations.cart.checkoutError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      setIsApplyingCoupon(true);
      const variants = items.map(item => ({
        id: item.variantId,
        quantity: item.quantity
      }));

      const response = await api.applyCoupon({ 
        variants,
        couponCode: couponCode.trim()
      });

      setCartData(response.data);
      setCouponCode('');
    } catch (error: any) {
      Alert.alert(
        translations.cart.errorTitle,
        error.message || 'Failed to apply coupon'
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // In the return statement, add before the footer
  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      {!loading && (!cartData?.items || cartData.items.length === 0) ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={64} color="#666" />
          <Text style={styles.emptyText}>Il tuo carrello è vuoto</Text>
        </View>
      ) : (
        <>
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
                  <Text style={styles.sizeText}>{translations.cart.size}: {item.size}</Text>
                  <Text style={styles.sizeText}>{translations.cart.quantity}: {item.quantitySelected}</Text>
                  
                  {item.quantityAvailable === 0 ? (
                    <Text style={styles.soldOutBadge}>{translations.cart.soldOut}</Text>
                  ) : 
                  <View style={styles.priceContainer}>
                  {item.originalPrice ? (
                      <>
                        <Text style={styles.price}>
                          {cartData?.totalCart.currency} {(item.price * item.quantitySelected).toFixed(2)}
                        </Text>
                        <Text style={styles.originalPrice}>
                          {cartData?.totalCart.currency} {(item.originalPrice * item.quantitySelected).toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.price}>
                        {cartData?.totalCart.currency} {(item.price * item.quantitySelected).toFixed(2)}
                      </Text>
                    )
                  }
                  </View>
                  }
                  {item.coupon && 
                    <View style={styles.couponContainer}>
                      <Text style={styles.couponCode}>{item.coupon.code}</Text>
                      <Text style={styles.couponPrice}>
                        -{cartData?.totalCart.currency} {((item.price - item.coupon.price) * item.quantitySelected).toFixed(2)}
                      </Text>
                    </View>
                  }  
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

          {cartData?.items && cartData.items.length > 0 && (
            <>
              {config?.config.showCouponField && (
                <View style={styles.couponSection}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder={translations.cart.coupon}
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={[styles.applyCouponButton, isApplyingCoupon && styles.applyCouponButtonDisabled]}
                    onPress={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                  >
                    {isApplyingCoupon ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.applyCouponText}>{translations.common.apply}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.footer}>
                {cartData?.totalCart?.totalSavings && cartData.totalCart.totalSavings > 0 && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.savingsLabel}>Coupon</Text>
                    <Text style={styles.savingsAmount}>
                      -{cartData.totalCart.currency} {cartData.totalCart.totalSavings.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Spedizione</Text>
                  <Text style={styles.totalLabel}>Calcolata al Checkout</Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalAmount}>
                    {cartData?.totalCart.currency} {cartData?.totalCart.price.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutButtonText}>Procedi al Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  couponCode: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  couponPrice: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  savingsLabel: {
    fontSize: 16,
    color: '#22c55e',
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
  },
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
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  soldOutBadge: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  couponSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  applyCouponButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyCouponText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  applyCouponButtonDisabled: {
    opacity: 0.7,
  },
});