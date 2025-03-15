import { Stack } from 'expo-router';
import { useLanguageStore } from '@/services/languageStore';

export default function CartLayout() {
  const { translations } = useLanguageStore();
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: translations.cart.title,
        headerTitleAlign: 'center',
      }}/>
    </Stack>
  );
}