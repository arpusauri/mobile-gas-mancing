import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Halaman Utama (Tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 👇 DAFTARIN HALAMAN LAINNYA DI SINI BANG 👇 */}
        {/* Biar mereka masuk tumpukan resmi & memorinya aman */}
        
        <Stack.Screen name="Booking" options={{ headerShown: false }} />
        <Stack.Screen name="Payment" options={{ headerShown: false }} />
        <Stack.Screen name="Confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="PesananSaya" options={{ headerShown: false }} />
        <Stack.Screen name="DetailPesananSaya" options={{ headerShown: false }} />
        
        {/* Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}