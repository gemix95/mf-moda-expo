import { Stack } from 'expo-router';

export default function CatalogLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={({ route }) => {
          const params = route.params as { brand?: string; subCategory?: string, title?: string };
          const title = params.subCategory || params.brand || params.title || '';
          
          return { 
            title,
            headerBackTitle: 'Back',
            presentation: 'card',
            headerShown: true,  
            headerTitleAlign: 'center',
          };
        }
      } 
      />
    </Stack>
  );
}