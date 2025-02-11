import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
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
          title: 'Home'
        }}
      />
      <Tabs.Screen 
        name="brands"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="local-offer" size={24} color={color} />,
          title: 'Brands'
        }}
      />
      <Tabs.Screen 
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
          title: 'Search'
        }}
      />
      <Tabs.Screen 
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
          title: 'Cart'
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          title: 'Profile'
        }}
      />
    </Tabs>
  );
}