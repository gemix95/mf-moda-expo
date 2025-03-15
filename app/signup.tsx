import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { useAuthStore } from '@/services/authStore';
import { useLanguageStore } from '@/services/languageStore';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { translations } = useLanguageStore();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const response = await api.signup({
        email,
        password,
        firstName,
        lastName,
      });
      
      login(
        response.token,
        response.expiresAt,
        {
          ...response.customerInfo,
          defaultAddress: null,
          addresses: []
        }
      );
      
      router.back();
      router.back();
    } catch (error) {
      Alert.alert(
        translations.common.error,
        error instanceof Error ? error.message : translations.auth.signupError,
        [{ text: translations.common.ok }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>{translations.common.back}</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MICHELE FRANZESE</Text>
        <Text style={styles.logoSubtext}>MODA</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{translations.auth.signup}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.userData.firstName}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.userData.firstName}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.userData.lastName}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.userData.lastName}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.auth.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.auth.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.auth.password}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={translations.auth.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#666" 
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.termsText}>
          {translations.auth.termsText}{' '}
          <Text style={styles.link}>{translations.auth.terms}</Text>
          {translations.auth.privacyText}{' '}
          <Text style={styles.link}>{translations.auth.privacy}</Text>.
        </Text>

        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>
            {isLoading ? translations.auth.creatingAccount : translations.auth.signup}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '500',
  },
  logoSubtext: {
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 24,
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#000',
  },
  signupButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
});