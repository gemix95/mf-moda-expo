import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,  
        headerTitle: () => (
            <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
            ),
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
    </Stack>
  );
}