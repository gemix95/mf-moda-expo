import { Stack } from 'expo-router';
import { Image } from 'react-native';

export default function ProfileLayout() {
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
    </Stack>
  );
}