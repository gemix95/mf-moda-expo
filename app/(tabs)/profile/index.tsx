import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const sections = [
    {
      title: 'Benvenuto',
      items: [
        { type: "login", icon: 'person-outline', title: 'Il tuo Profilo', external: false },
        { type: "wishlist", icon: 'bookmark-outline', title: 'Lista dei Desideri', external: false },
        { type: "preferences", icon: 'thumb-up', title: 'Preferenze Shopping', external: false },
        { type: "notification", icon: 'notifications-none', title: 'Notifiche', external: false },
        { type: "infos", icon: 'info-outline', title: 'Pagine informative', external: false },
      ]
    },
    {
      title: 'Lingua e Regione',
      items: [
        { type: "language", icon: 'language', title: 'Italiano', subtitle: 'Lingua', external: false },
        { type: "country", icon: 'outlined-flag', title: 'Italia (EUR €)', subtitle: 'Regione', external: false },
      ]
    },
    {
      title: 'Inviaci un feedback',
      items: [
        { type: "review", icon: 'star-outline', title: 'Valuta l\'app', external: true },
        { type: "trust-pilot", icon: 'verified-user', title: 'Trust Pilot', external: true },
      ]
    },
    {
      title: 'Social',
      items: [
        { type: "instagram", icon: 'camera-alt', title: 'Instagram', external: true },
        { type: "facebook", icon: 'facebook', title: 'Facebook', external: true },
        { type: "best", icon: 'shopping-bag', title: 'The Best Shops', external: true },
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
              onPress={() => {
                if (item.type === 'login') {
                  router.push('../login');
                }
              }}
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
        <Text style={styles.sectionTitle}>Customer Service</Text>
        <View style={styles.serviceHours}>
          <Text style={styles.serviceDay}>lunedì - venerdì</Text>
          <Text style={styles.serviceTime}>dalle ore 11:00 alle ore 13:30</Text>
          <Text style={styles.serviceTime}>dalle ore 16:00 alle ore 18:00</Text>
          
          <Text style={[styles.serviceDay, styles.extraMargin]}>sabato</Text>
          <Text style={styles.serviceTime}>dalle ore 11:00 alle ore 13:00</Text>
        </View>
        
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Telefono</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>
          MF Moda v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
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