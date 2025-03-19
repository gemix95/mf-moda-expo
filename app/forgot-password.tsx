import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { useLanguageStore } from '@/services/languageStore';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { translations } = useLanguageStore();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        translations.common.error,
        translations.auth.emailRequired,
        [{ text: translations.common.ok }]
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.forgotPassword({ email });
      
      Alert.alert(translations.auth.resetPassword, response.message, [
        { 
          text: translations.common.ok,
          onPress: () => router.back()
        }
    ]
      );
    } catch (error: any) {
      Alert.alert(translations.common.error, error.message, [
        { text: translations.common.ok }
    ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>{translations.common.back}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{translations.auth.resetPassword}</Text>
        <Text style={styles.description}>
          {translations.auth.resetPasswordDescription}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.auth.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.auth.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.resetButton, isLoading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>
            {isLoading ? translations.common.loading : translations.auth.sendResetLink}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});