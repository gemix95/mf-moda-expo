import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '@/services/cartManager';
import { useLanguageStore } from '@/services/languageStore';

export default function TabLayout() {
  const cartItemsCount = useCartStore(state => state.getTotalItems());
  const { translations } = useLanguageStore();

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#999',
    }}>
      <Tabs.Screen 
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
          title: translations.tabs.home
        }}
      />
      <Tabs.Screen 
        name="brands"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="local-offer" size={24} color={color} />,
          title: translations.tabs.brands
        }}
      />
      <Tabs.Screen 
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
          title: translations.tabs.search
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: translations.tabs.cart,
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          title: translations.tabs.profile
        }}
      />
    </Tabs>
  );
}