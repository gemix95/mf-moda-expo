import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { useAuthStore } from '@/services/authStore';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const response = await api.signup({
        email,
        password,
        firstName,
        lastName,
      });
      
      // Login the user with the received data
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
        'Error',
        error instanceof Error ? error.message : 'Signup failed',
        [{ text: 'OK' }],
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
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MICHELE FRANZESE</Text>
        <Text style={styles.logoSubtext}>MODA</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign up</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
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
          By continuing, you accept Michele Franzese Moda's{' '}
          <Text style={styles.link}>Terms & Conditions</Text>. To learn more about how Michele Franzese Moda uses and protects your personal data, please read Michele Franzese Moda's{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>
            {isLoading ? 'Creating account...' : 'Sign up'}
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