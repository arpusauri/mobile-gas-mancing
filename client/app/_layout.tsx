import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      const inAuthGroup =
        segments[0] === undefined ||
        segments[0] === "Signin" ||
        segments[0] === "Signup";

      if (!token && !inAuthGroup) {
        router.replace("/");
      }

      if (token && inAuthGroup) {
        router.replace("/(tabs)");
      }

      setChecked(true);
    };

    checkAuth();
  }, [segments]);


  if (!checked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* AUTH / PUBLIC */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Signin" options={{ headerShown: false }} />
        <Stack.Screen name="Signup" options={{ headerShown: false }} />

        {/* MAIN APP */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* OTHER SCREENS */}
        <Stack.Screen name="Search" options={{ headerShown: false }} />
        <Stack.Screen name="Detail" options={{ headerShown: false }} />
        <Stack.Screen
          name="DetailEnsiklopedia"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Booking" options={{ headerShown: false }} />
        <Stack.Screen name="Payment" options={{ headerShown: false }} />
        <Stack.Screen name="Confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="PesananSaya" options={{ headerShown: false }} />
        <Stack.Screen
          name="DetailPesananSaya"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}