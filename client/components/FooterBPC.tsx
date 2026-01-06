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
  title?: string; // ✅ 1. Tambahin ini (Opsional)
  buttonLabel: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function FooterBPC({ 
  totalPrice, 
  title = "Total Harga", // ✅ 2. Kasih default value "Total Harga"
  buttonLabel, 
  onPress, 
  disabled = false 
}: FooterBPCProps) {
  
  return (
    <View style={[
      styles.container,
      totalPrice !== undefined 
        ? { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } 
        : { justifyContent: 'center', alignItems: 'center' }
    ]}>
      
      {totalPrice !== undefined && (
        <View>
          {/* ✅ 3. Ganti text statis jadi variabel {title} */}
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.price}>
            Rp. {totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.button, 
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -2,  
    left: 0,
    right: 0,
    backgroundColor: '#102A63',
    padding: 20,
    paddingBottom: 27, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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