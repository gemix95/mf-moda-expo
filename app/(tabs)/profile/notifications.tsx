import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguageStore } from '@/services/languageStore';

export default function NotificationsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { translations } = useLanguageStore();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    const enabled = await AsyncStorage.getItem('@notifications_enabled');
    setIsEnabled(enabled === 'true');
  };

  const toggleNotifications = async (value: boolean) => {
    setIsEnabled(value);
    await AsyncStorage.setItem('@notifications_enabled', value.toString());
    
    if (value) {
      OneSignal.Notifications.requestPermission(true);
    } else {
      OneSignal.User.pushSubscription.optOut();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>{translations.notifications.enablePush}</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
      <Text style={styles.description}>
        {translations.notifications.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
