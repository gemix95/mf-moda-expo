import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StyleSheet, View } from 'react-native';

export default function CheckoutPage() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  if (!url) {
    return null;
  }

  const handleNavigationStateChange = (navState: { url: string }) => {
    // Handle successful order or cancellation
    if (navState.url.includes('/thank-you')) {
      // TODO: Add button to close the page
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: decodeURIComponent(url as string) }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => <LoadingScreen />}
        style={styles.webview}
      />
    </View>
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
});