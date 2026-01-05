import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
  title: string;
  transparent?: boolean;
  showCart?: boolean;
}

export default function CustomHeader({ title, transparent = false, showCart = false }: CustomHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.headerTopBar, 
      { 
        height: insets.top + 60, // Sesuai kode andalan Abang
        paddingTop: insets.top, 
        backgroundColor: transparent ? 'transparent' : 'white',
        borderBottomWidth: transparent ? 0 : 1,
        borderBottomColor: '#F1F5F9',
      }
    ]}>
      
      {/* Tombol Back Absolute */}
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 8 }]} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Judul Center Sempurna dan Keranjang */}
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* 🟢 Ikon keranjang cuma muncul kalau showCart dinilai TRUE */}
          {showCart && (
            <Ionicons name="cart" size={22} color="#102A63" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.headerTitleText}>{title}</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headerTopBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 15, 
    width: 40,
    height: 45, // Menggunakan height 45 agar poros tengah luas
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // 🟢 SENTUHAN AKHIR: Naikkin tulisan 1-2 pixel biar poros B pas tengah panah
    paddingBottom: 2, 
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    includeFontPadding: false, // Wajib di Android
  },
});