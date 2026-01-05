import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Import Router

export default function SearchInput() {
  const router = useRouter(); // 2. Panggil Hook Router

  // Fungsi saat tombol Cari diklik
  const handleSearch = () => {
    // Arahkan ke halaman Explore (sesuai nama file di folder app/(tabs))
    router.push('/Search'); 
  };

  return (
    <View style={styles.container}>
      {/* BARIS 1: Pencarian Utama */}
      <View style={styles.inputFullWidth}>
        <Ionicons name="search-outline" size={20} color="#133E87" style={{ marginRight: 10 }} /> 
        <TextInput 
            placeholder="Mau mancing dimana?" 
            placeholderTextColor="#999" 
            style={[styles.textInputClean, Platform.OS === 'web' && { outlineStyle: 'none' }]} 
            underlineColorAndroid="transparent"
            selectionColor="#133E87"
        />
      </View>

      {/* BARIS 2: Harga Min & Max */}
      <View style={styles.rowPrice}>
        <View style={styles.inputHalf}>
            <Ionicons name="wallet-outline" size={18} color="#133E87" style={{ marginRight: 8 }} />
            <TextInput 
                placeholder="Harga Min" 
                placeholderTextColor="#AAA" 
                keyboardType="numeric" 
                style={[styles.textInputClean, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                underlineColorAndroid="transparent"
                selectionColor="#133E87"
            />
        </View>
        <View style={{width: 10}} /> 
        <View style={styles.inputHalf}>
            <Ionicons name="wallet-outline" size={18} color="#133E87" style={{ marginRight: 8 }} />
            <TextInput 
                placeholder="Harga Max" 
                placeholderTextColor="#AAA" 
                keyboardType="numeric" 
                style={[styles.textInputClean, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                underlineColorAndroid="transparent"
                selectionColor="#133E87"
            />
        </View>
      </View>

      {/* BARIS 3: Fasilitas */}
      <View style={styles.inputFullWidth}> 
        <Ionicons name="business-outline" size={20} color="#133E87" style={{ marginRight: 10 }} />
        <TextInput 
            placeholder="Fasilitas" 
            placeholderTextColor="#AAA" 
            style={[styles.textInputClean, Platform.OS === 'web' && { outlineStyle: 'none' }]}
            underlineColorAndroid="transparent"
            selectionColor="#133E87"
        />
      </View>

      {/* Tombol Cari - DITAMBAHKAN ONPRESS */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.btnText}>Cari</Text>
        <Ionicons name="search" size={22} color="white" style={{position:'absolute', right: 20}}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  inputFullWidth: {
    backgroundColor: 'white',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, height: 45, borderRadius: 12,
    marginBottom: 10, overflow: 'hidden',
  },
  rowPrice: { flexDirection: 'row', marginBottom: 10 },
  inputHalf: {
    flex: 1, backgroundColor: 'white', height: 45, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, overflow: 'hidden',
  },
  textInputClean: { 
      flex: 1, color: '#333', height: '100%', paddingVertical: 0, 
      backgroundColor: 'transparent', borderWidth: 0,
  },
  searchButton: {
    backgroundColor: '#608BC1', height: 48, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', elevation: 3, marginTop: 5
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});