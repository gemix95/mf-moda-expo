import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/services/authStore';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Order } from '@/types/user';
import { MaterialIcons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoading(true);
        if (token) {
          const response = await api.fetchOrders(token);
          setOrders(response.orders || []); // Add fallback empty array
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [token]); // Add token dependency

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.section}>
        {orders.map((order) => (
          <View key={order.orderNumber} style={styles.orderCard}>
            <View style={styles.itemContainer}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: order.items[0]?.imageUrl }} 
                  style={styles.itemImage} 
                />
                {order.items.length > 1 && (
                  <View style={styles.itemCountBadge}>
                    <Text style={styles.itemCountText}>+{order.items.length - 1}</Text>
                  </View>
                )}
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>
                  {format(new Date(order.processedAt), 'dd MMMM yyyy', { locale: it })}
                </Text>
                <Text style={styles.orderNumber}>Ordine #{order.orderNumber}</Text>
                <Text style={styles.totalAmount}>
                  {order.totalPrice.currencyCode} {order.totalPrice.amount}
                </Text>
                {order.canceledAt && (
                  <View style={styles.cancelledBadge}>
                    <Text style={styles.cancelledText}>Annullato</Text>
                  </View>
                )}
              </View>
              <View style={styles.arrowContainer}>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </View>
            </View>
          </View>
        ))}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingVertical: 24,
    },
  orderCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '300',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemImage: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '300',
  },
  cancelledText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
    imageWrapper: {
      position: 'relative',
      width: 80,
      height: 120,
    },
    itemCountBadge: {
      position: 'absolute',
      top: 'auto',
      right: -8,
      backgroundColor: '#000',
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    itemCountText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
        itemContainer: {
          flexDirection: 'row',
        },
        orderDetails: {
          flex: 1,
          marginLeft: 32,
          justifyContent: 'center',
          gap: 4,
        },
        cancelledBadge: {
          backgroundColor: '#ff3b30',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          alignSelf: 'flex-start',
          marginTop: 4,
        },
        arrowContainer: {
            justifyContent: 'center',
            paddingLeft: 16,
          }
});