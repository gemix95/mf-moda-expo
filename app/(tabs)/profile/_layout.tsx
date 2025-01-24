import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: 'Profile',
        headerTitleAlign: 'center',
      }}
      />
    </Stack>
  );
}