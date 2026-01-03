import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

// --- TIPE DATA STATUS (Biar rapi) ---
type StatusPesanan = 'Lunas' | 'Menunggu' | 'Dibatalkan';

// --- DATA DUMMY (Nanti ini diganti sama data dari API Temen Abang) ---
const INITIAL_DATA = [
  {
    id: 'B-928121',
    title: 'Pantai Ancol',
    location: 'Ancol, Jakarta Barat',
    date: '03 Jan 2026',
    price: 50000,
    status: 'Lunas' as StatusPesanan, // Hijau
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'B-928122',
    title: 'Danau Toba',
    location: 'Sumatera Utara',
    date: '05 Jan 2026',
    price: 150000,
    status: 'Menunggu' as StatusPesanan, // Kuning
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2071&auto=format&fit=crop'
  },
  {
    id: 'B-928123',
    title: 'Pemancingan Galatama',
    location: 'Bogor, Jawa Barat',
    date: '01 Jan 2026',
    price: 75000,
    status: 'Dibatalkan' as StatusPesanan, // Merah
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function PesananSayaScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState(INITIAL_DATA);

  // LOGIC WARNA BADGE STATUS
  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case 'Lunas': return '#4ADE80';      // Hijau Terang
      case 'Menunggu': return '#FACC15';   // Kuning
      case 'Dibatalkan': return '#EF4444'; // Merah
      default: return '#9CA3AF';
    }
  };

  // LOGIC BUTTON BATAL
  const handleCancel = (id: string) => {
    Alert.alert(
      "Batalkan Pesanan?",
      "Apakah Anda yakin ingin membatalkan pesanan ini?",
      [
        { text: "Tidak", style: "cancel" },
        { 
          text: "Ya, Batalkan", 
          style: 'destructive',
          onPress: () => {
            // Update status jadi 'Dibatalkan' secara lokal
            const updatedOrders = orders.map(order => 
              order.id === id ? { ...order, status: 'Dibatalkan' as StatusPesanan } : order
            );
            setOrders(updatedOrders);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <CustomHeader title="Pesanan Saya" showCart={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {orders.map((item) => (
          <View key={item.id} style={styles.card}>
            
            {/* BACKGROUND IMAGE DENGAN OVERLAY */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.imageOverlay} />

            {/* CONTENT KARTU */}
            <View style={styles.cardInner}>
              
              {/* BARIS ATAS: NO PESANAN & STATUS */}
              <View style={styles.topRow}>
                <Text style={styles.orderIdText}>No. Pesanan : {item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status === 'Menunggu' ? 'Pending' : item.status}</Text>
                </View>
              </View>

              {/* BARIS TENGAH: JUDUL & LOKASI */}
              <View style={styles.middleRow}>
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="white" />
                  <Text style={styles.locationText}> {item.location}</Text>
                </View>
              </View>

              {/* BARIS BAWAH: HARGA & TOMBOL */}
              <View style={styles.bottomRow}>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    Total : Rp. {item.price.toLocaleString('id-ID')}
                  </Text>
                </View>

                <View style={styles.buttonGroup}>
                  {/* TOMBOL LIHAT DETAIL */}
                  <TouchableOpacity 
                    style={styles.btnDetail}
                    onPress={() => router.push({
                      pathname: '/DetailPesananSaya',
                      params: { orderId: item.id }
                    })}
                  >
                    <Text style={styles.btnText}>Lihat Detail</Text>
                  </TouchableOpacity>

                  {/* TOMBOL BATAL (Hanya muncul jika belum batal) */}
                  {item.status !== 'Dibatalkan' && (
                    <TouchableOpacity 
                      style={styles.btnBatal}
                      onPress={() => handleCancel(item.id)}
                    >
                      <Text style={styles.btnText}>Batal</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

            </View>
          </View>
        ))}
        <View style={{height: 100}} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: 20,       // Ganti padding jadi vertikal aja
    paddingHorizontal: 20,     // Kiri kanan tetep
    backgroundColor: '#fff',
    elevation: 2,
    flexDirection: 'row',      // Biar sejajar horizontal
    alignItems: 'center',      // Tengah vertikal
    justifyContent: 'center',  // Tengah horizontal (buat judul)
    marginBottom: 10,
    position: 'relative',      // Penting buat tombol back absolute
  },
  headerBackButton: {
    position: 'absolute',      // Nempel di pojok kiri
    left: 20,
    zIndex: 10,                // Biar bisa dipencet (di atas layer lain)
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 16,
  },
  // CARD STYLES
  card: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'white'
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // Gelap dikit biar tulisan putih kebaca
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  // TOP ROW
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000', // Teks hitam di atas badge warna cerah
    fontSize: 12,
    fontWeight: 'bold',
  },
  // MIDDLE ROW
  middleRow: {
    justifyContent: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#F1F5F9',
    fontSize: 12,
  },
  // BOTTOM ROW
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Biar tombol sejajar bawah
  },
  priceBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  btnDetail: {
    backgroundColor: '#102A63', // Biru Navy
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnBatal: {
    backgroundColor: '#DC2626', // Merah
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});