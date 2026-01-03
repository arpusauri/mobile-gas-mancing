import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar'; // Import navbar yang tadi dibuat

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />} // Gunakan Custom Navbar kita
      screenOptions={{
        headerShown: false, // Hilangkan header bawaan (kita buat header custom nanti)
      }}
    >
      {/* Urutan Tab sesuai Icon: Home, Cart, Booking, Profile */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="PesananSaya" options={{ title: 'Pesanan Saya' }} />
      <Tabs.Screen name="ensiklopedia" options={{ title: 'Ensiklopedia' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/* Buat file dummy cart.tsx, booking.tsx, profile.tsx nanti agar error hilang */}
    </Tabs>
  );
}