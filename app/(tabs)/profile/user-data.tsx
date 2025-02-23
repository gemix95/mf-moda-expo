import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/services/authStore';

export default function UserDataScreen() {
  const customerInfo = useAuthStore((state) => state.customerInfo);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{customerInfo?.displayName?.split(' ')[0] || '-'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Cognome</Text>
        <Text style={styles.value}>{customerInfo?.displayName?.split(' ')[1] || '-'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{customerInfo?.email || '-'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
});