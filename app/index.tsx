import { useEffect } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { OneSignal } from 'react-native-onesignal';

export default function RootScreen() {
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.getConfig();
      // Store config if needed

      OneSignal.initialize("d2be3f7a-6766-4204-b3de-2520c57e2e29");
      OneSignal.Notifications.requestPermission(true);
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log('OneSignal: notification clicked:', event);
      });

      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  return <LoadingScreen />;
}