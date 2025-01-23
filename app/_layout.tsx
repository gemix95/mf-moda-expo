import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
            title: 'Home'
          }}
        />
        <Tabs.Screen 
          name="brands"
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="local-offer" size={24} color={color} />,
            title: 'Brands'
          }}
        />
        <Tabs.Screen 
          name="search"
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
            title: 'Search'
          }}
        />
        <Tabs.Screen 
          name="cart"
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
            title: 'Cart'
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            title: 'Profile'
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
