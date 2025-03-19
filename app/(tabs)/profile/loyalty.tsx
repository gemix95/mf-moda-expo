import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { useLanguageStore } from '@/services/languageStore';
import { useAuthStore } from '@/services/authStore';
import { LoyaltyInfo } from '@/types/user';
import * as Clipboard from 'expo-clipboard';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function LoyaltyScreen() {
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyInfo | null>(null);
  const { translations, language } = useLanguageStore();
  const customerInfo = useAuthStore(state => state.customerInfo);

  useEffect(() => {
    loadLoyaltyInfo();
  }, []);

  const loadLoyaltyInfo = async () => {
    try {
      const response = await api.getLoyaltyInfo(customerInfo?.email ?? "");
      setLoyaltyData(response);
    } catch (error) {
      console.error('Error loading loyalty info:', error);
      Alert.alert(
        translations.common.error,
        translations.loyalty.errorLoading,
        [{ text: translations.common.ok }]
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert(
      translations.loyalty.codeCopied,
      translations.loyalty.codeCopiedMessage,
      [{ text: translations.common.ok }]
    );
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
    return ( 
      <LoadingScreen/>
    );
  }

  return (
    <ScrollView style={styles.container}>      
      <View style={styles.pointsSection}>
        <View style={styles.pointsHeader}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>{translations.loyalty.pointsAccumulated}</Text>
            <Text style={styles.points}>
              {Math.floor(loyaltyData?.info.pointsBalance || 0)}
            </Text>
            <Text style={styles.pointsLabel}>Punti MF</Text>
          </View>
          <TouchableOpacity 
            style={styles.redeemButton}
            onPress={() => router.push({
              pathname: '/profile/redeem-points',
              params: { 
                accessToken: loyaltyData?.accessToken,
                customerIdentifier: loyaltyData?.info.customerIdentifier,
              }
            })}
          >
            <Text style={styles.redeemButtonText}>{translations.loyalty.redeemPoints}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push({
            pathname: '/profile/loyalty-history',
            params: { accessToken: loyaltyData?.accessToken }
          })}
        >
          <Text style={styles.historyButtonText}>{translations.loyalty.viewHistory}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>{translations.loyalty.yourCoupons}</Text>
        <Text style={styles.subtitle}>{translations.loyalty.redeemPointsInfo}</Text>

        {loyaltyData?.activeRewards && loyaltyData.activeRewards.length > 0 ? (
          loyaltyData.activeRewards.map((reward) => (
            <View key={reward.id} style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <Text style={styles.couponValue}>{reward.title}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(reward.discountCode)}>
                  <MaterialIcons name="content-copy" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.couponCode}>{reward.discountCode}</Text>
              <Text style={styles.couponExpiry}>
                {translations.loyalty.expires} {formatDate(reward.expiration)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{translations.loyalty.noCoupons}</Text>
          </View>
        )}
      </View>

      {loyaltyData?.rules && loyaltyData.rules.length > 0 && (
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>{translations.loyalty.howItWorks}</Text>
          {loyaltyData.rules.map((rule, index) => (
            <View key={index} style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>• {rule.title}</Text>
              <Text style={styles.ruleDescription}>{rule.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  pointsSection: {
    padding: 32,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  pointsInfo: {
    alignItems: 'flex-start',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  points: {
    fontSize: 48,
    fontWeight: '600',
    marginVertical: 8,
  },
  rewardsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  couponCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center', // Center children horizontally
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'center', // Changed from space-between to center
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    position: 'relative', // Added to help with absolute positioning of the copy icon
  },
  couponValue: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1, // Added to take available space
  },
  couponCode: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center', // Center text
  },
  couponExpiry: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center', // Center text
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  rulesSection: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  ruleContainer: {
    marginBottom: 16,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 16,
  },
  ruleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  historyButtonText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline', 
  },
  pointsActions: {
      flexDirection: 'row',
      justifyContent: 'center', // Changed from space-between to center
      alignItems: 'center', // Added to vertically align buttons
      width: '100%',
      paddingHorizontal: 16,
      marginTop: 16,
      gap: 32, // Added gap between buttons
    },
    historyButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
      },
      redeemButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 12,
      },
    redeemButtonText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
});