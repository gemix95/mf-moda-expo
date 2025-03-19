import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useLanguageStore } from '@/services/languageStore';
import { useAuthStore } from '@/services/authStore';
import { LoyaltyActivity } from '@/types/user';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLocalSearchParams } from 'expo-router';

export default function LoyaltyHistoryScreen() {
  const { accessToken } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<LoyaltyActivity[]>([]);
  const { translations, language } = useLanguageStore();
  const customerInfo = useAuthStore(state => state.customerInfo);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await api.getLoyaltyActivity(
        customerInfo?.email ?? "",
        accessToken as string
      );
      setActivities(response.loyaltyActivities);
    } catch (error) {
      console.error('Error loading loyalty activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'it' ? 'it-IT' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{translations.loyalty.history}</Text>
      <Text style={styles.subtitle}>{translations.loyalty.historyDescription}</Text>
      
      {activities.map((activity, index) => (
        <View key={index} style={styles.activityRow}>
          <View>
            <Text style={styles.date}>{formatDate(activity.date)}</Text>
            <Text style={styles.activity}>
              {activity.activity === 'reward' ? translations.loyalty.orderPoints :
               activity.activity === 'redeem' ? translations.loyalty.redeemPoints :
               activity.activity === 'refund' ? translations.loyalty.refundPoints :
               translations.loyalty.manualPoints}
            </Text>
          </View>
          <Text style={[
            styles.points,
            { color: activity.activity === 'redeem' || activity.activity === 'refund' ? '#FF0000' : '#000' }
          ]}>
            {activity.activity === 'redeem' || activity.activity === 'refund' ? '-' : '+'}{activity.points}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  date: {
    fontSize: 16,
    marginBottom: 4,
  },
  activity: {
    fontSize: 14,
    color: '#666',
  },
  points: {
    fontSize: 18,
    fontWeight: '500',
  },
});