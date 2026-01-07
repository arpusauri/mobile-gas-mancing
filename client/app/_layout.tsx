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
      // CEK KEDUA TOKEN (customer: "token", mitra: "userToken")
      const customerToken = await AsyncStorage.getItem("token");
      const mitraToken = await AsyncStorage.getItem("userToken");
      const userRole = await AsyncStorage.getItem("userRole");

      const token = customerToken || mitraToken;

      const inAuthGroup =
        segments[0] === undefined ||
        segments[0] === "Signin" ||
        segments[0] === "Signup" ||
        segments[0] === "FormMitra";

      console.log("🔍 Auth Check:", {
        token: token ? "✅ Found" : "❌ Not found",
        userRole,
        segments,
        inAuthGroup
      });

      // Jika tidak ada token dan bukan di halaman auth, redirect ke home
      if (!token && !inAuthGroup) {
        console.log("🔄 No token, redirecting to /");
        router.replace("/");
      }

      // Jika ada token dan di halaman auth, redirect ke dashboard yang sesuai
      if (token && inAuthGroup) {
        if (userRole === "mitra") {
          console.log("🔄 Mitra logged in, redirecting to /(mitra)");
          router.replace("/(mitra)");
        } else {
          console.log("🔄 Customer logged in, redirecting to /(tabs)");
          router.replace("/(tabs)");
        }
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
        
        {/* MITRA SCREENS */}
        <Stack.Screen name="FormMitra" options={{ headerShown: false }} />
        <Stack.Screen name="TambahKolam" options={{ headerShown: false }} />
        <Stack.Screen name="(mitra)" options={{ headerShown: false }} />

        {/* MAIN APP (CUSTOMER) */}
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