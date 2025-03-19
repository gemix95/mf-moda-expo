import { View, Text, StyleSheet } from 'react-native';
import { useLanguageStore } from '@/services/languageStore';

export function MaintenancePage() {
  const { translations } = useLanguageStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ {translations.maintenance.title}</Text>
      <Text style={styles.subtitle}>
        {translations.maintenance.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});