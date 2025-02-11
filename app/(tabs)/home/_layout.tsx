import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: () => (
            <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
            ),
            headerTitleAlign: 'center',
        }}
        />

      <Stack.Screen 
        name="catalog" 
        options={({ route }) => ({ 
          title: `${(route.params as { title?: string })?.title || ''}`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="product" 
        options={({ route }) => ({ 
          title: `${(route.params as { brand?: string })?.brand || ''}`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />
    </Stack>
  );
}