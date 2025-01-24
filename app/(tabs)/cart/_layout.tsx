import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function CartLayout() {
    return (
        <Stack>
          <Stack.Screen name="index" options={{ 
            headerShown: true,
            headerTitle: 'Cart',
            headerTitleAlign: 'center',
          }}
        />
        </Stack>
      );
    }