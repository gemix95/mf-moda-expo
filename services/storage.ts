import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setCredentials(email: string, password: string) {
    await AsyncStorage.multiSet([
      ['@auth_email', email],
      ['@auth_password', password],
    ]);
  },

  async clearCredentials() {
    await AsyncStorage.multiRemove(['@auth_email', '@auth_password']);
  },

  async getCredentials() {
    const [email, password] = await AsyncStorage.multiGet([
      '@auth_email',
      '@auth_password'
    ]);
    
    return {
      email: email[1],
      password: password[1]
    };
  }
};