import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { Platform } from 'react-native';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MaintenancePage } from '@/components/MaintenancePage';
import { UpdateRequiredPage } from '@/components/UpdateRequiredPage';
import { OneSignal } from 'react-native-onesignal';
import { compareVersions } from '@/utils/version';
import Constants from 'expo-constants';

export default function RootScreen() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);

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

      if (Platform.OS === 'android' && response.data.update?.minSupportedVersionAndroid) {
        const currentVersion = Constants.expoConfig?.version ?? '0.0.0';
        if (compareVersions(response.data.update.minSupportedVersionAndroid, currentVersion) > 0) {
          setNeedsUpdate(true);
          return;
        }
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

  if (needsUpdate) {
    return <UpdateRequiredPage />;
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return <LoadingScreen />;
}