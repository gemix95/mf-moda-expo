import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { useAuthStore } from '@/services/authStore';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('enyons@mailnesia.com');
  const [password, setPassword] = useState('enyons@mailnesia.com');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      const response = await api.login(email, password);
      
      login(
        response.token,
        response.expiresAt,
        response.customerInfo
      );
      
      router.back();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Email o password errata');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/images/login-bg.jpg')} 
      style={styles.container}
    >
      <StatusBar style="light" />
      {isLoading && <LoadingScreen />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MICHELE FRANZESE</Text>
        <Text style={styles.headerSubtitle}>MODA</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"} 
                size={24} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Register to Michele Franzese Moda and get the full personalize{'\n'}
            Shopping Experience at your hand!
          </Text>
          <Text style={styles.newCustomer}>New Customer?</Text>
          <TouchableOpacity 
                style={styles.signupButton}
                onPress={() => router.push('../signup')}
              >
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  form: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#666',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  newCustomer: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});