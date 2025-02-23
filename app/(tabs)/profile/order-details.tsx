import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function OrderDetailsScreen() {
  const { order: orderParam } = useLocalSearchParams();
  const order = JSON.parse(orderParam as string);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dettagli ordine</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Ordinato il:</Text>
        <Text style={styles.sectionText}>
          {format(new Date(order.processedAt), 'dd MMMM yyyy', { locale: it })}
        </Text>
      </View>

      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Indirizzo di spedizione</Text>
          </View>
        </View>
        {order.shippingAddress && (
          <>  
            <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.address1}
              {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''}
            </Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.zip}, {order.shippingAddress.city}, {order.shippingAddress.country}
            </Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prodotti</Text>
        {order.items.map((item: any, index: number) => (
          <View key={index} style={styles.productItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productVendor}>{item.vendor}</Text>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productSize}>Taglia: {item.size}</Text>
              <Text style={styles.productPrice}>
                {new Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: item.price.currencyCode ?? "EUR"
                }).format(Number(item.price.discountedPrice))}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Riepilogo</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{order.items.length} Prodotti</Text>
          <Text style={styles.summaryValue}>
            {new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: order.totalPrice.currencyCode ?? "EUR"
            }).format(Number(order.totalPrice.amount))}
          </Text>
        </View>
        {order.totalShippingPrice && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Spedizione</Text>
            <Text style={styles.summaryValue}>
              {new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: order.totalShippingPrice.currencyCode ?? "EUR"
              }).format(Number(order.totalShippingPrice.amount))}
            </Text>
          </View>
        )}
        {order.discount?.amount && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.discountLabel]}>
              {order.discount.code}
            </Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>
              -{new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: order.discount.amount.currencyCode ?? "EUR"
              }).format(Number(order.discount.amount.amount))}
            </Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Totale</Text>
          <Text style={styles.totalValue}>
            {new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: order.totalPrice.currencyCode ?? "EUR"
            }).format(Number(order.totalPrice.amount))}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 16,
  },
  addressSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productVendor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  productSize: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  summary: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
  },
  discountLabel: {
    color: '#ff3b30',
  },
  discountValue: {
    color: '#ff3b30',
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});