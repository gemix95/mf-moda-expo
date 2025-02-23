import { Stack } from 'expo-router';

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
    </Stack>
  );
}