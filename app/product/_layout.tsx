import { Stack } from 'expo-router';

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={({ route }) => ({ 
          title: (route.params as { brand?: string })?.brand || '',
          headerTitleAlign: 'center'
        })} 
      />
    </Stack>
  );
}