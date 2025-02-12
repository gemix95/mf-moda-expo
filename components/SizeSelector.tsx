import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ProductSize } from '@/types/product';

interface SizeSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectSize: (size: ProductSize) => void;
  sizes: ProductSize[];
  productPrice: number;
}

export function SizeSelector({ isVisible, onClose, onSelectSize, sizes, productPrice }: SizeSelectorProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(() => {
    // Auto-select if there's only one available size
    const availableSizes = sizes.filter(size => size.quantity > 0);
    return availableSizes.length === 1 ? availableSizes[0] : null;
  });

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Seleziona Taglia</Text>
        <View style={styles.sizeList}>
          {sizes.map((sizeOption) => (
            <TouchableOpacity
              key={sizeOption.variantId}
              style={[
                styles.sizeButton,
                selectedSize?.variantId === sizeOption.variantId && styles.selectedSize,
                sizeOption.quantity === 0 && styles.soldOutSize,
              ]}
              onPress={() => sizeOption.quantity > 0 && setSelectedSize(sizeOption)}
              disabled={sizeOption.quantity === 0}
            >
              <View style={styles.sizeContentContainer}>
                <Text style={[
                  styles.sizeText,
                  selectedSize?.variantId === sizeOption.variantId && styles.selectedSizeText,
                  sizeOption.quantity === 0 && styles.soldOutSizeText
                ]}>
                  {sizeOption.size}
                </Text>
                {sizeOption.quantity === 0 && (
                  <Text style={styles.soldOutLabel}>Sold out</Text>
                )}
                {sizeOption.quantity > 0 && sizeOption.price !== productPrice && (
                  <Text style={styles.priceText}>
                    € {sizeOption.price.toFixed(2)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={[
            styles.addButton,
            !selectedSize && styles.addButtonDisabled
          ]}
          disabled={!selectedSize}
          onPress={() => {
            if (selectedSize) {
              onSelectSize(selectedSize);
              onClose();
            }
          }}
        >
          <Text style={styles.addButtonText}>Aggiungi al carrello</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

// Update the sizeButton and its content layout
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  sizeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  selectedSize: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  sizeText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
  // Update the View wrapper inside the TouchableOpacity
  sizeContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2, // Added minimal vertical padding
  },
    selectedSizeText: {
      color: '#fff',
    },
    addButton: {
      backgroundColor: '#000',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonDisabled: {
      backgroundColor: '#ccc',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    sizeButton: {
        width: '30%',
        aspectRatio: 2, // Changed from 1.5 to make buttons shorter
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 4, // Added specific vertical padding
        paddingHorizontal: 8,
      },
      soldOutSize: {
        borderColor: '#ddd',
        backgroundColor: '#f5f5f5',
      },
      soldOutSizeText: {
        color: '#999',
      },
      soldOutLabel: {
        fontSize: 10,
        color: '#ff4444',
        marginTop: 4,
      },
      priceText: {
        fontSize: 12,
        color: '#666',
      },
  });