import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileMitra() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Apakah Anda yakin ingin keluar?',
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            // Hapus hanya data auth, bukan semua storage
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('userId');
            
            console.log('✅ Logged out successfully');
            
            // Redirect ke Signin
            router.replace('/Signin');
          } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Gagal logout, coba lagi');
          }
        },
      },
    ]
  );
};


  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#102A63" />
        </View>
        <Text style={styles.name}>{userData?.nama_lengkap || 'Mitra'}</Text>
        <Text style={styles.email}>{userData?.email || '-'}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#666" />
          <Text style={styles.infoText}>{userData?.no_telepon || '-'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.infoText}>{userData?.alamat || '-'}</Text>
        </View>
      </View>

      {userData?.nama_bank && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informasi Bank</Text>
          <View style={styles.infoRow}>
            <Ionicons name="card" size={20} color="#666" />
            <Text style={styles.infoText}>{userData.nama_bank}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={20} color="#666" />
            <Text style={styles.infoText}>{userData.no_rekening}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.infoText}>{userData.atas_nama_rekening}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#102A63',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102A63',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EDF5',
    marginVertical: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});