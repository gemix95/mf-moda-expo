import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';

export default function CheckoutPage() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [showCloseButton, setShowCloseButton] = useState(false);

  if (!url) {
    return null;
  }

  const handleNavigationStateChange = (navState: { url: string }) => {
    setShowCloseButton(navState.url.includes('thank_you'));
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
            {showCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.replace('/(tabs)/home')}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
        </View>
      <WebView
        ref={webViewRef}
        source={{ uri: decodeURIComponent(url as string) }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => <LoadingScreen />}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 12,
  },
  webview: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});