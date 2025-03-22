import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import WebView from 'react-native-webview';
import { useLanguageStore } from '@/services/languageStore';
import { useRef, useState } from 'react';

export default function InfoDetailScreen() {
  const { url, slug } = useLocalSearchParams();
  const { translations } = useLanguageStore();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTitle = () => {
    const pageKey = slug as keyof typeof translations.info.pages;
    return translations.info.pages[pageKey] || '';
  };

  const injectedJavaScript = `
    // Hide content initially
    document.body.style.opacity = '0';
    
    // Remove elements
    document.querySelector('header')?.remove();
    document.querySelector('nav')?.remove();
    document.querySelector('footer')?.remove();
    document.querySelector('.shopify-section-header')?.remove();
    document.querySelector('.shopify-section-footer')?.remove();
    document.querySelector('.announcement-bar')?.remove();
    document.querySelector('.header__icons')?.remove();
    document.querySelector('.header__menu-btn')?.remove();
    document.querySelector('.header__search')?.remove();
    
    // Show content after cleaning
    document.body.style.opacity = '1';
    true;
  `;

  return (
    <>
      <Stack.Screen 
        options={{
          title: getTitle(),
        }} 
      />
      <View style={styles.container}>
        <WebView 
          source={{ uri: url as string }} 
          style={styles.webview}
          injectedJavaScript={injectedJavaScript}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => {
            setIsLoading(false);
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(injectedJavaScript);
            }
          }}
          ref={webViewRef}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        />
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});