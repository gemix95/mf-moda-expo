import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useLanguageStore } from '@/services/languageStore';

export default function InfoScreen() {
  const { translations, language } = useLanguageStore();
  
  // Get base URL based on language
  const baseUrl = language === 'it' 
    ? 'https://michelefranzesemoda.com/it-eu'
    : 'https://michelefranzesemoda.com/en-eu';

  const infoPages = [
    { title: translations.info.pages.boutiques, slug: 'boutiques', url: `${baseUrl}/pages/boutiques` },
    { title: translations.info.pages.customerCare, slug: 'customer-care', url: `${baseUrl}/pages/servizio-clienti` },
    { title: translations.info.pages.shipping, slug: 'shipping', url: `${baseUrl}/pages/spedizione` },
    { title: translations.info.pages.returns, slug: 'returns', url: `${baseUrl}/pages/resi-e-cambi` },
    { title: translations.info.pages.klarna, slug: 'klarna', url: `${baseUrl}/pages/klarna` },
    { title: translations.info.pages.payments, slug: 'payments', url: `${baseUrl}/pages/pagamenti` },
    { title: translations.info.pages.privacy, slug: 'privacy', url: `${baseUrl}/pages/privacy` },
    { title: translations.info.pages.cookiePolicy, slug: 'cookie-policy', url: `${baseUrl}/pages/cookie-policy` },
    { title: translations.info.pages.manageCookies, slug: 'manage-cookies', url: `${baseUrl}/pages/ccpa-opt-out` },
    { title: translations.info.pages.loyalty, slug: 'loyalty', url: `${baseUrl}/pages/programma-fedelta-mfm` },
    { title: translations.info.pages.about, slug: 'about', url: `${baseUrl}/pages/chi-siamo` },
    { title: translations.info.pages.magazine, slug: 'magazine', url: `${baseUrl}/blogs/news` },
    { title: translations.info.pages.faqs, slug: 'faqs', url: `${baseUrl}/pages/faq` },
    { title: translations.info.pages.terms, slug: 'terms', url: `${baseUrl}/pages/termini-e-condizioni` },
  ];

  return (
    <>
      <Stack.Screen 
        options={{
          title: translations.info.title,
        }} 
      />
    <ScrollView style={styles.container}>
      {infoPages.map((page, index) => (
        <TouchableOpacity
          key={page.slug}
          style={styles.menuItem}
          onPress={() => router.push({
            pathname: '/(tabs)/profile/info/[slug]',
            params: { slug: page.slug, url: page.url }
          })}
        >
          <View style={styles.leftContent}>
            <Text style={styles.title}>{page.title}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000',
  },
});