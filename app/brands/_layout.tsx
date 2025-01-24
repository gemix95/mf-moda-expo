import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function BrandsLayout() {
    return (
        <Stack>
          <Stack.Screen name="index" options={{ 
            headerShown: true,
            headerTitle: 'Brands',
            headerTitleAlign: 'center',
          }}
        />
        </Stack>
      );
    }