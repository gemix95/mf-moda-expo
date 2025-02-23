import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '@/services/authStore';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Constants from 'expo-constants';

export default function CustomerProfileScreen() {
  const customerInfo = useAuthStore((state) => state.customerInfo);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: 'person-outline', title: 'I tuoi dati', route: '/(tabs)/profile/user-data' },
    { icon: 'local-shipping', title: 'I tuoi ordini', route: '/(tabs)/profile/orders' },
    { icon: 'location-on', title: 'I tuoi indirizzi', route: '' },
    { icon: 'card-giftcard', title: 'Programma fedeltà', route: '' },
  ];

  const handleLogout = () => {
    logout();
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.section}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
         key={index}
         style={styles.menuItem}
         onPress={() => router.push(item.route as any)}
        >
          <View style={styles.leftContent}>
            <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#000" />
            <Text style={styles.menuText}>{item.title}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>
          MF Moda v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </ScrollView>
  );
}

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    padding: 16,
    marginTop: 32,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  appVersion: {
    marginTop: 24,
    color: '#666',
    fontSize: 14,
  },
  deleteAccount: {
    marginTop: 24,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 14,
  },
});