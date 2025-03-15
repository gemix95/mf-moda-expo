import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useAuthStore } from '@/services/authStore';
import { useCountryStore } from '@/services/countryStore';
import { useLanguageStore } from '@/services/languageStore';

export default function ProfileScreen() {
  var customerInfo = useAuthStore((state) => state.customerInfo);
  const { selectedCountry } = useCountryStore();
  
  // Format the country display text
  const countryDisplayText = selectedCountry 
    ? `${selectedCountry.name} (${selectedCountry.currency.isoCode} ${selectedCountry.currency.symbol})`
    : 'Italia (EUR €)';

  const { translations } = useLanguageStore();
  
  // Update handleMenuPress
  const handleMenuPress = (item: any) => {
    switch (item.type) {
      case 'profile':
        if (customerInfo) {
          router.push('/(tabs)/profile/details');
        } else {
          router.push('../../login');
        }
        break;
      case 'country':
        router.push('/(tabs)/profile/select-country');
        break;
      case 'preferences':
        router.push('/(tabs)/profile/shopping-preferences');
        break;
      case 'wishlist':
        router.push('/(tabs)/profile/wishlist');
        break;
      case 'notification':
        router.push('/(tabs)/profile/notifications');
        break;
      case 'language':
        router.push('/(tabs)/profile/language');
        break;
    }
  };

  const sections = [
    {
      title: customerInfo?.displayName ? `${translations.profile.hello}, ${customerInfo.displayName}` : translations.profile.welcome,
      items: [
        { type: "profile", icon: 'person-outline', title: translations.profile.menu.profile, external: false },
        { type: "wishlist", icon: 'bookmark-outline', title: translations.profile.menu.wishlist, external: false },
        { type: "preferences", icon: 'thumb-up', title: translations.profile.menu.preferences, external: false },
        { type: "notification", icon: 'notifications-none', title: translations.profile.menu.notifications, external: false },
        { type: "infos", icon: 'info-outline', title: translations.profile.menu.info, external: false },
      ]
    },
    {
      title: translations.profile.menu.language,
      items: [
        { type: "language", icon: 'language', title: translations.profile.language.italian, subtitle: translations.profile.menu.language, external: false },
        { type: "country", icon: 'outlined-flag', title: countryDisplayText, subtitle: translations.profile.menu.region, external: false },
      ]
    },
    {
      title: translations.profile.feedback.title,
      items: [
        { type: "review", icon: 'star-outline', title: translations.profile.feedback.rateApp, external: true },
        { type: "trust-pilot", icon: 'verified-user', title: translations.profile.feedback.trustPilot, external: true },
      ]
    },
    {
      title: translations.profile.social.title,
      items: [
        { type: "instagram", icon: 'camera-alt', title: translations.profile.social.instagram, external: true },
        { type: "facebook", icon: 'facebook', title: translations.profile.social.facebook, external: true },
        { type: "best", icon: 'shopping-bag', title: translations.profile.social.bestShops, external: true },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity 
              key={itemIndex}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.leftContent}>
                <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#000" />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  {'subtitle' in item && (
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <MaterialIcons 
                name={item.external ? 'north-east' : 'chevron-right'}
                size={24} 
                color="#999"
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.customerService}>
        <Text style={styles.sectionTitle}>{translations.profile.customerService.title}</Text>
        <View style={styles.serviceHours}>
          <Text style={styles.serviceDay}>{translations.profile.customerService.weekdays}</Text>
          <Text style={styles.serviceTime}>dalle ore 11:00 alle ore 13:30</Text>
          <Text style={styles.serviceTime}>dalle ore 16:00 alle ore 18:00</Text>
          
          <Text style={[styles.serviceDay, styles.extraMargin]}>{translations.profile.customerService.saturday}</Text>
          <Text style={styles.serviceTime}>dalle ore 11:00 alle ore 13:00</Text>
        </View>
        
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>{translations.profile.customerService.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>{translations.profile.customerService.whatsapp}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>{translations.profile.customerService.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.version}>
        MF Moda v{Constants.expoConfig?.version || '1.0.0'}
      </Text>
    </ScrollView>
  );
}

// Add to existing StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    marginTop: 32
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerService: {
    marginTop: 32,
    paddingBottom: 32,
  },
  serviceHours: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  serviceDay: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
  serviceTime: {
    fontWeight: '300',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  extraMargin: {
    marginTop: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  contactButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    color: '#000',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 32,
  },
});