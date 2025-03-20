import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Product } from '@/types/product';
import { useProductStore } from '@/types/productStore';

export function ProductCard({ product }: { product: Product }) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {
        useProductStore.getState().setSelectedProduct(product);
        let fullPath = `/home/product`
        router.push(fullPath as any);
      }}
    >
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>{product.currencyCode} {product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  details: {
    padding: 8,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
});