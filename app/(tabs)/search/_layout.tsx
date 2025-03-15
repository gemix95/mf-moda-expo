import { Stack } from 'expo-router';
import { useLanguageStore } from '@/services/languageStore';

export default function SearchLayout() {
  const { translations } = useLanguageStore();
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: translations.search.title,
        headerTitleAlign: 'center',
      }}/>
      <Stack.Screen 
        name="sales" 
        options={({ route }) => ({ 
          title: `${(route.params as { sector?: string })?.sector || ''} ${translations.search.sales}`,
          headerBackTitle: translations.common.back,
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