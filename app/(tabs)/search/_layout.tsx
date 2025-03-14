import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,  
        headerTitle: 'Search',
        headerTitleAlign: 'center',
        }}
        />
      <Stack.Screen 
        name="sales" 
        options={({ route }) => ({ 
          title: `${(route.params as { sector?: string })?.sector || ''} Sales`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="catalog" 
        options={({ route }) => ({ 
          title: `${(route.params as { subCategory?: string; title?: string })?.subCategory || 
                  (route.params as { title?: string })?.title || ''}`,
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