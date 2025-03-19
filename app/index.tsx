import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MaintenancePage } from '@/components/MaintenancePage';
import { OneSignal } from 'react-native-onesignal';

export default function RootScreen() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.getConfig();
      
      if (response.data.maintenance?.enabled) {
        setIsMaintenanceMode(true);
        return;
      }

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

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return <LoadingScreen />;
}