import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLanguageStore } from '@/services/languageStore';

export function UpdateRequiredPage() {
  const { translations } = useLanguageStore();
  
  const handleUpdate = () => {
    Linking.openURL('market://details?id=com.mfmoda.android');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 {translations.update.requiredTitle}</Text>
      <Text style={styles.subtitle}>
        {translations.update.requiredDescription}
      </Text>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>
          {translations.update.updateNow}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  updateButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});