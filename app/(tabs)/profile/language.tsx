import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguageStore } from '@/services/languageStore';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LanguageScreen() {
  const { language, setLanguage, translations } = useLanguageStore();

  const languages = [
    { code: 'it', name: translations.profile.language.italian },
    { code: 'en', name: translations.profile.language.english }
  ];

  const handleLanguageSelect = async (langCode: 'it' | 'en') => {
    await setLanguage(langCode);
    router.back();
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={styles.languageItem}
          onPress={() => handleLanguageSelect(lang.code as 'it' | 'en')}
        >
          <Text style={styles.languageText}>{lang.name}</Text>
          {language === lang.code && (
            <MaterialIcons name="check" size={24} color="#000" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageText: {
    fontSize: 16,
    color: '#000',
  },
});