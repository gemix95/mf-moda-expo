import { Stack } from 'expo-router';

export default function BrandsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: 'Brands',
        headerTitleAlign: 'center',
      }} />
      
      <Stack.Screen 
        name="catalog" 
        options={({ route }) => ({ 
          title: `${(route.params as { brand?: string })?.brand || ''}`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />
    </Stack>
  );
}