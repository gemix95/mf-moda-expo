import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { MaterialIcons } from '@expo/vector-icons';
import { SizeSelector } from '@/components/SizeSelector';
import { useWishlistStore } from '@/services/wishlistStore';
import { useEffect } from 'react';
import { api } from '@/services/api';
import { useCountryStore } from '@/services/countryStore';
import { useRouter } from 'expo-router';
import { useProductStore } from '@/types/productStore';
import { useLanguageStore } from '@/services/languageStore';

interface ProductViewProps {
  product: Product;
  path: string;
}

export function ProductView({ product, path }: ProductViewProps) {
  // Add translation hook near other hooks
  const { translations } = useLanguageStore();
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = async () => {
    if (isWishlisted) {
      await removeItem(product.id);
    } else {
      await addItem(product.id);
    }
  };

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRelatedProducts();
  }, [product]);

  const loadRelatedProducts = async () => {
    try {
      const response = await api.getCorrelatedProducts({
        countryCode: useCountryStore.getState().selectedCountry?.isoCode || 'IT',
        category: product.category,
        subCategory: product.subCategory,
        sector: product.sector,
      });
      setRelatedProducts(response.products);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
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
                {product.currencyCode} {product.originalPrice.toFixed(2)}
                </Text>
                <Text style={styles.salePrice}>
                {product.currencyCode} {product.price.toFixed(2)}
                </Text>
              </>
            )}
            {!product.originalPrice && (
              <Text style={styles.price}>
                {product.currencyCode} {product.price.toFixed(2)}
              </Text>
            )}
          </View>

          <View style={styles.accordionContainer}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
            >
              <Text style={styles.accordionTitle}>{translations.product.details.title}</Text>
              <MaterialIcons 
                name={expandedSection === 'details' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
            {expandedSection === 'details' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{product.description}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
            >
              <Text style={styles.accordionTitle}>{translations.product.shipping.title}</Text>
              <MaterialIcons 
                name={expandedSection === 'shipping' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
            {expandedSection === 'shipping' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{translations.product.shipping.content}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setExpandedSection(expandedSection === 'payments' ? null : 'payments')}
            >
              <Text style={styles.accordionTitle}>{translations.product.payment.title}</Text>
              <MaterialIcons 
                name={expandedSection === 'payments' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
            {expandedSection === 'payments' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{translations.product.payment.content}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setExpandedSection(expandedSection === 'customer' ? null : 'customer')}
            >
              <Text style={styles.accordionTitle}>{translations.product.customerService.title}</Text>
              <MaterialIcons 
                name={expandedSection === 'customer' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
            {expandedSection === 'customer' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{translations.product.customerService.hours}</Text>
                <View style={styles.customerButtons}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>{translations.product.customerService.phone}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>{translations.product.customerService.whatsapp}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>{translations.product.customerService.email}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>{translations.product.relatedProducts}</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={relatedProducts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.relatedCard}
                    onPress={() => {
                      useProductStore.getState().setSelectedProduct(item);
                      let fullPath = `/${path}/product`
                      router.replace(fullPath as any);
                    }}
                  >
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.relatedInfo}>
                      <Text style={styles.relatedBrand}>{item.brand}</Text>
                      <Text style={styles.relatedPrice}>
                        {item.currencyCode} {item.price.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowSizeSelector(true)}
        >
          <Text style={styles.addButtonText}>{translations.product.addToCart}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={handleWishlist}
        >
          <MaterialIcons 
            name={isWishlisted ? "favorite" : "favorite-border"} 
            size={24} 
            color="#000" 
          />
        </TouchableOpacity>
      </View>

      <SizeSelector
        isVisible={showSizeSelector}
        onClose={() => setShowSizeSelector(false)}
        onSelectSize={(selectedSize) => {
          console.log('Selected size:', selectedSize);
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
  scrollView: {
    flex: 1,
  },
  flatList: { 
      marginTop: 24
  },
  image: {
    width,
    height: width * 1.2,
  },
  pagination: {
    flexDirection: 'row',
    paddingTop: 16,
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
    paddingBottom: 16,
    paddingTop: 16
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
  relatedSection: {
    marginTop: 24,
    paddingBottom: 16,
  },
  relatedTitle: {
    fontSize: 21,
    fontWeight: '500',
    marginBottom: 16,
    marginTop: 16
  },
  relatedCard: {
    width: 200,
    marginRight: 16,
  },
  relatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  relatedInfo: {
    marginTop: 8,
  },
  relatedBrand: {
    fontSize: 14,
    fontWeight: '500',
  },
  relatedPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  accordionContainer: {
    marginTop: 24,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  accordionContent: {
    padding: 16
  },
  accordionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  customerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  contactButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    color: '#000',
  },
});