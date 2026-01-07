import React from 'react';
import { Tabs } from 'expo-router';
import MitraTabBar from '../../components/MitraTabBar';

export default function MitraLayout() {
  return (
    <Tabs
      tabBar={(props) => <MitraTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="pesanan" options={{ title: 'Pesanan' }} />
      <Tabs.Screen name="properti" options={{ title: 'Tambah Kolam' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}