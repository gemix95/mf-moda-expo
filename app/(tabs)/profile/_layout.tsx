import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLanguageStore } from '@/services/languageStore';

export default function ProfileLayout() {
  const { translations } = useLanguageStore();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: translations.profile.menu.profile,
        headerTitleAlign: 'center',
      }}
      />

      <Stack.Screen 
        name="details" 
        options={() => ({ 
          title: translations.profile.menu.profile,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="user-data" 
        options={() => ({ 
          title: translations.profile.menu.profile,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="orders" 
        options={() => ({ 
          title: translations.profile.menu.orders,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="order-details" 
        options={({ route }) => {
          const order = route.params && 'order' in route.params ? JSON.parse(route.params.order as string) : null;
          return {
            title: order ? `${translations.profile.menu.order} #${order.orderNumber}` : '',
            headerBackTitle: translations.common.back,
            presentation: 'card'
          };
        }} 
      />

      <Stack.Screen 
        name="addresses" 
        options={() => ({ 
          title: translations.profile.menu.addresses,
          headerBackTitle: translations.common.back,
          presentation: 'card',
          headerRight: () => (
            <Link href="/(tabs)/profile/new-address" asChild>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>{translations.common.add}</Text>
              </TouchableOpacity>
            </Link>
          )
        })} 
      />

      <Stack.Screen 
        name="new-address" 
        options={({ route }) => ({ 
          title: route.params && 'addressId' in route.params ? 
            translations.profile.menu.editAddress : 
            translations.profile.menu.newAddress,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />
      
      <Stack.Screen 
        name="select-country" 
        options={() => ({ 
          title: translations.profile.menu.selectCountry,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="shopping-preferences" 
        options={() => ({ 
          title: translations.profile.menu.preferences,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="wishlist" 
        options={() => ({ 
          title: translations.profile.menu.wishlist,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="product" 
        options={({ route }) => ({ 
          title: `${(route.params as { brand?: string })?.brand || ''}`,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="notifications" 
        options={() => ({ 
          title: translations.profile.menu.notifications,
          headerBackTitle: translations.common.back,
          presentation: 'card'
        })} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },
});