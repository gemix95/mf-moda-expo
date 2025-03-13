import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        headerShown: true,
        headerTitle: 'Profile',
        headerTitleAlign: 'center',
      }}
      />

    <Stack.Screen 
        name="details" 
        options={() => ({ 
          title: `Il tuo Profilo`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

    <Stack.Screen 
        name="user-data" 
        options={() => ({ 
          title: `I tuoi Dati`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

    <Stack.Screen 
        name="orders" 
        options={() => ({ 
          title: `I tuoi Ordini`,
          headerBackTitle: 'Back',
          presentation: 'card'
        })} 
      />

    <Stack.Screen 
        name="order-details" 
        options={({ route }) => {
          const order = route.params && 'order' in route.params ? JSON.parse(route.params.order as string) : null;
          return {
            title: order ? `Ordine #${order.orderNumber}` : '',
            headerBackTitle: 'Back',
            presentation: 'card'
          };
        }} 
      />
    <Stack.Screen 
      name="addresses" 
      options={() => ({ 
        title: 'I tuoi Indirizzi',
        headerBackTitle: 'Back',
        presentation: 'card',
        headerRight: () => (
          <Link href="/(tabs)/profile/new-address" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Aggiungi</Text>
          </TouchableOpacity>
        </Link>
        )
      })} 
    />
    <Stack.Screen 
      name="new-address" 
      options={() => ({ 
        title: 'Nuovo Indirizzo',
        headerBackTitle: 'Back',
        presentation: 'card'
      })} 
    />
    
    <Stack.Screen 
      name="select-country" 
      options={() => ({ 
        title: 'Seleziona Paese',
        headerBackTitle: 'Back',
        presentation: 'card'
      })} 
    />

    <Stack.Screen 
      name="shopping-preferences" 
      options={() => ({ 
        title: 'Preferenze Shopping',
        headerBackTitle: 'Back',
        presentation: 'card'
      })} 
    />
    </Stack>
  );
}

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },
});