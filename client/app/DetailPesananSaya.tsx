import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

export default function DetailPesananSaya() {
  const params = useLocalSearchParams();
  
  // Ambil data dari params
  const orderId = (params.orderId as string) || '#B-000000';
  const title = (params.title as string) || 'Wisata Alam';
  const location = (params.location as string) || 'Lokasi tidak tersedia';
  const price = (params.price as string) || '0';
  const status = (params.status as string) || 'Menunggu';
  const imageUri = (params.image as string) || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4';

  // Logika warna badge status
  const getStatusUI = () => {
    switch (status) {
      case 'Lunas':
        return { 
          backgroundColor: '#4ADE80', 
          textColor: '#FFFFFF', 
          label: 'Sudah Lunas' 
        };
      case 'Dibatalkan':
        return { 
          backgroundColor: '#EF4444', 
          textColor: '#FFFFFF', 
          label: 'Pesanan Dibatalkan' 
        };
      default:
        return { 
          backgroundColor: '#FACC15', 
          textColor: '#000000', 
          label: 'Menunggu Pembayaran' 
        };
    }
  };

  const ui = getStatusUI();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Detail Pesanan" showCart={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay} />
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {title}
            </Text>
            <View style={styles.heroLocationRow}>
              <Ionicons name="location-sharp" size={16} color="white" />
              <Text style={styles.heroLocationText}>
                {location}
              </Text>
            </View>
          </View>

          {/* Badge Status Melayang */}
          <View style={[styles.statusBadge, { backgroundColor: ui.backgroundColor }]}>
            <Text style={[styles.statusText, { color: ui.textColor }]}>
              {ui.label}
            </Text>
          </View>
        </View>

        {/* AREA CARD PUTIH */}
        <View style={styles.mainCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>
              Informasi Pembayaran
            </Text>
            <Text style={styles.orderIdText}>
              {orderId}
            </Text>
          </View>
          
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.labelDimmed}>
                Total Harga
              </Text>
              <Text style={styles.valueBold}>
                Rp. {Number(price).toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.labelDimmed}>
                Metode Pembayaran
              </Text>
              <Text style={styles.valueBold}>
                BRI
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* INFORMASI SEWA - Versi Tukar Tempat */}
          <Text style={styles.sectionTitle}>
            Informasi Sewa
          </Text>
          
          <View style={styles.rentGrid}>
            
            {/* 🟢 BARIS ATAS: TANGGAL & ORANG (Sejajar 50:50) */}
            <View style={styles.rowSejajar}>
              {/* Kolom Tanggal */}
              <View style={styles.rentCol}>
                <View style={styles.rentItem}>
                  <Ionicons name="calendar" size={20} color="#102A63" />
                  <View style={styles.rentTextCol}>
                    <Text style={styles.labelDimmed}>
                      Tanggal
                    </Text>
                    <Text style={styles.rentValueLabel}>
                      03/01/2026
                    </Text>
                  </View>
                </View>
              </View>

              {/* Kolom Orang */}
              <View style={styles.rentCol}>
                <View style={styles.rentItem}>
                  <Ionicons name="people" size={20} color="#102A63" />
                  <View style={styles.rentTextCol}>
                    <Text style={styles.labelDimmed}>
                      Orang
                    </Text>
                    <Text style={styles.rentValueLabel}>
                      1 Orang
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 🟢 BARIS BAWAH: LOKASI (Sendirian biar Luas) */}
            <View style={styles.rentItemMargin}>
              <Ionicons name="location" size={20} color="#102A63" />
              <View style={styles.rentTextCol}>
                <Text style={styles.labelDimmed}>
                  Lokasi
                </Text>
                <Text style={styles.rentValueLabel}>
                  {location}
                </Text>
              </View>
            </View>

          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Peralatan Yang Disewa:
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.equipmentScroll}
          >
            {[1, 2, 3, 4, 5].map((idx) => (
              <View key={idx} style={styles.itemCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd' }} 
                  style={styles.itemImage} 
                />
                <View style={styles.itemLabel}>
                  <Text style={styles.itemText}>
                    Pancingan
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        {status === 'Menunggu' && (
          <TouchableOpacity style={styles.btnBatal}>
            <Text style={styles.btnBatalText}>
              Batal
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heroSection: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 55,
    left: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  heroLocationText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 65,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  mainCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -40,
    padding: 20,
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  orderIdText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  labelDimmed: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  valueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  rentGrid: {
    marginTop: 10,
  },
  rowSejajar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rentCol: {
    flex: 1,
  },
  rentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rentItemMargin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rentTextCol: {
    marginLeft: 10,
  },
  rentValueLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  equipmentScroll: {
    marginTop: 15,
  },
  itemCard: {
    width: 110,
    marginRight: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemImage: {
    width: '100%',
    height: 80,
  },
  itemLabel: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#102A63',
  },
  footer: {
    padding: 20,
  },
  btnBatal: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  btnBatalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});