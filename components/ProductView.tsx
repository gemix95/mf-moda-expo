import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Product } from '@/types/product';

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
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

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      width,
      height: width * 1.2,
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      top: width * 1.3,
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
      padding: 16,
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
      marginTop: 8,
    },
    price: {
      fontSize: 14,
      fontWeight: '500',
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      color: '#999',
    },
    addButton: {
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
  });