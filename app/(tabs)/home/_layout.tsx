import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: () => (
              <View style={styles.header}>
                <Text style={styles.headerTitle}>MICHELE FRANZESE</Text>
                <Text style={styles.headerSubtitle}>MODA</Text>
              </View>
            ),
            headerTitleAlign: 'center',
        }}
        />

      <Stack.Screen 
        name="catalog" 
        options={({ route }) => ({ 
          title: `${(route.params as { title?: string })?.title || ''}`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

      <Stack.Screen 
        name="product" 
        options={({ route }) => ({ 
          title: `${(route.params as { brand?: string })?.brand || ''}`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
  },
});