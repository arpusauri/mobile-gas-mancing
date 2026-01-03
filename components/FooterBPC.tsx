import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Platform 
} from 'react-native';

interface FooterBPCProps {
  totalPrice?: number;
  buttonLabel: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function FooterBPC({ 
  totalPrice, 
  buttonLabel, 
  onPress, 
  disabled = false 
}: FooterBPCProps) {
  
  return (
    <View style={[
      styles.container,
      // Logika Layout: Kalau ada harga (Booking) dia Kiri-Kanan. Kalau gak ada, dia Tengah.
      totalPrice !== undefined 
        ? { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } 
        : { justifyContent: 'center', alignItems: 'center' }
    ]}>
      
      {/* BAGIAN KIRI: HANYA MUNCUL JIKA ADA HARGA (Booking) */}
      {totalPrice !== undefined && (
        <View>
          <Text style={styles.label}>Total Harga</Text>
          <Text style={styles.price}>
            Rp. {totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>
      )}

      {/* BAGIAN TOMBOL */}
      <TouchableOpacity 
        style={[
          styles.button, 
          // Kalau mode Booking (ada harga), tombol menyesuaikan. Kalau Payment/Confirm, tombol full.
          totalPrice !== undefined ? { paddingHorizontal: 20 } : { width: '100%' },
          disabled && { opacity: 0.6 } 
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>

    </View>
  );
}

// STYLES DIAMBIL PERSIS DARI CODINGAN ASLI ABANG
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // INI RAHASIANYA DARI KODINGAN ASLI ABANG:
    bottom: -2,  
    left: 0,
    right: 0,
    backgroundColor: '#102A63',
    padding: 20,
    paddingBottom: 27, // Padding statis yang Abang pakai di awal
    
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Shadow
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    color: 'white',
    fontSize: 12,
  },
  price: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#102A63',
    fontWeight: 'bold',
    fontSize: 14,
  },
});