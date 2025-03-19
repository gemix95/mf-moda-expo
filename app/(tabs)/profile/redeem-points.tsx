import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { useLanguageStore } from '@/services/languageStore';
import { useAuthStore } from '@/services/authStore';
import { SpendingRule } from '@/types/user';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function RedeemPointsScreen() {
  const { accessToken, customerIdentifier } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);  // Add this state
  const [spendingRules, setSpendingRules] = useState<SpendingRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<SpendingRule | null>(null);
  const { translations } = useLanguageStore();
  const customerInfo = useAuthStore(state => state.customerInfo);

  useEffect(() => {
    loadSpendingRules();
  }, []);

  const loadSpendingRules = async () => {
    try {
      const response = await api.getSpendingRules(
        customerInfo?.email ?? "",
        accessToken as string
      );
      setSpendingRules(response.spendingRules);
      if (response.spendingRules.length > 0) {
        setSelectedRule(response.spendingRules[0]);
      }
    } catch (error) {
      console.error('Error loading spending rules:', error);
      Alert.alert(
        translations.common.error,
        translations.loyalty.errorLoadingRules,
        [{ text: translations.common.ok }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedRule || redeeming) return;
    
    setRedeeming(true);
    try {
      const response = await api.redeemPoints({
        accessToken: accessToken as string,
        ruleId: selectedRule.id,
        customerIdentifier: Number(customerIdentifier)
      });
  
      Alert.alert(
        translations.loyalty.success,
        response.message,
        [{ 
          text: translations.common.ok,
          onPress: () => router.back()
        }]
      );
    } catch (error: any) {
      Alert.alert(
        translations.common.error,
        error.message || translations.loyalty.errorRedeeming,
        [{ text: translations.common.ok }]
      );
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (spendingRules.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.giftIcon}>🎁</Text>
        <Text style={styles.emptyTitle}>
          {translations.loyalty.insufficientBalance}
        </Text>
        <Text style={styles.emptySubtitle}>
          {translations.loyalty.keepShopping}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{translations.loyalty.redeemPoints}</Text>
      <Text style={styles.subtitle}>
        {translations.loyalty.redeemDescription}
      </Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>{translations.loyalty.selectReward}</Text>
        <Picker
          selectedValue={selectedRule?.id}
          onValueChange={(itemValue) => {
            const rule = spendingRules.find(r => r.id === itemValue);
            if (rule) setSelectedRule(rule);
          }}
          style={styles.picker}
        >
          {spendingRules.map((rule) => (
            <Picker.Item key={rule.id} label={rule.title} value={rule.id} />
          ))}
        </Picker>
      </View>

      {selectedRule && (
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#F5E6BE', '#F3DBA8', '#F0D197', '#F5E6BE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.cardLogo}>MF</Text>
            <Text style={styles.cardSubLogo}>MODA</Text>
            <View style={styles.cardContent}>
              <Text style={styles.discountText}>{selectedRule.title}</Text>
              <Text style={styles.pointsText}>{selectedRule.points} Punti MF</Text>
            </View>
          </LinearGradient>
        </View>
      )}

    <TouchableOpacity 
        style={[styles.redeemButton, redeeming && styles.redeemButtonDisabled]}
        onPress={handleRedeem}
        disabled={redeeming}
      >
        <Text style={styles.redeemButtonText}>
          {redeeming ? translations.common.loading : translations.loyalty.redeemNow}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        {translations.loyalty.redeemDisclaimer}
      </Text>
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
  pickerContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  card: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center', // Center horizontally
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLogo: {
    fontSize: 72,
    fontWeight: '200', // Much lighter weight
    color: '#000', // Keep original dark color
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginTop: 8,
  },
  cardSubLogo: {
    fontSize: 32,
    fontWeight: '200', // Much lighter weight
    color: '#000', // Keep original dark color
    textAlign: 'center',
    marginTop: -16,
  },
  redeemButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  cardContent: {
    marginTop: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  discountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pointsText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  redeemButtonDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});