import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { MaterialIcons } from '@expo/vector-icons';
import { SizeSelector } from '@/components/SizeSelector';

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
      
      <View style={styles.pagination}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.shortDescription}</Text>
        <View style={styles.priceContainer}>
          {product.originalPrice && (
            <>
              <Text style={[styles.price, styles.originalPrice]}>
                € {product.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.salePrice}>
                € {product.price.toFixed(2)}
              </Text>
            </>
          )}
          {!product.originalPrice && (
            <Text style={styles.price}>
              € {product.price.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowSizeSelector(true)}
          >
            <Text style={styles.addButtonText}>Add to cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.wishlistButton}>
            <MaterialIcons name="bookmark-border" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <SizeSelector
        isVisible={showSizeSelector}
        onClose={() => setShowSizeSelector(false)}
        onSelectSize={(selectedSize) => {
          console.log('Selected size:', selectedSize);
          // Handle adding to cart here
        }}
        sizes={product.sizes}
        productPrice={product.price}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    flatList: { 
        marginTop: 0
    },
    image: {
      width,
      height: width * 1.2,
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      top: width * 1.25,
      width: '100%',
      justifyContent: 'center',
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(205, 205, 205, 0.5)',
    },
    paginationDotActive: {
      backgroundColor: '#000',
    },
    details: {
      paddingHorizontal: 16,
      paddingBottom: 16
    },
    brand: {
      fontSize: 32,
      fontWeight: '600',
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#666',
      marginBottom: 16,
    },
    salePrice: {
      fontSize: 14,
      fontWeight: '500',
      color: '#468866',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16
    },
    price: {
      fontSize: 14,
      fontWeight: '500',
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      color: '#999',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    addButton: {
      flex: 1,
      backgroundColor: '#000',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'light',
    },
    wishlistButton: {
      padding: 14,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: '#000',
    },
  });