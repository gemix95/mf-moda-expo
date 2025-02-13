import { Stack } from 'expo-router';

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