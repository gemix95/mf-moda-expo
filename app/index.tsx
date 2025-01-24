import { useEffect } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function RootScreen() {
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.getConfig();
      // Store config if needed
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  return <LoadingScreen />;
}