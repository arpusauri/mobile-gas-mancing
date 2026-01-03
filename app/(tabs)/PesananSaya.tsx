import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader'; 

// Definisi tipe status agar kodingan lebih aman (Type Safety)
type StatusPesanan = 'Lunas' | 'Menunggu' | 'Dibatalkan';

// Data simulasi (Dummy). Nanti ini akan digantikan oleh data asli dari Database teman Abang
const INITIAL_DATA = [
  {
    id: 'B-928121',
    title: 'Pantai Ancol',
    location: 'Ancol, Tanjung Priok, Jakarta Utara, DKI Jakarta',
    date: '03 Jan 2026',
    price: 150000, 
    status: 'Menunggu' as StatusPesanan, 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'B-928122',
    title: 'Danau Toba',
    location: 'Sumatera Utara',
    date: '05 Jan 2026',
    price: 150000,
    status: 'Lunas' as StatusPesanan,
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2071&auto=format&fit=crop'
  },
  {
    id: 'B-928123',
    title: 'Pemancingan Galatama',
    location: 'Bogor, Jawa Barat',
    date: '01 Jan 2026',
    price: 75000,
    status: 'Dibatalkan' as StatusPesanan,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function PesananSayaScreen() {
  const router = useRouter();
  // State untuk menyimpan daftar pesanan yang bisa berubah (misal: saat dibatalkan)
  const [orders, setOrders] = useState(INITIAL_DATA);

  // Fungsi untuk menentukan warna badge berdasarkan status pesanan
  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case 'Lunas': return '#4ADE80';      // Hijau
      case 'Menunggu': return '#FACC15';   // Kuning (Menunggu Pembayaran)
      case 'Dibatalkan': return '#EF4444'; // Merah
      default: return '#9CA3AF';
    }
  };

  // Fungsi untuk menangani aksi pembatalan pesanan
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
            // Update state secara lokal: Mencari ID yang cocok dan mengubah statusnya
            setOrders((prevOrders) => {
              const newArr = prevOrders.map(order => 
                order.id === id ? { ...order, status: 'Dibatalkan' as StatusPesanan } : order
              );
              // Return array baru agar React mendeteksi perubahan dan me-render ulang UI
              return [...newArr]; 
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header Custom: Menampilkan judul dan ikon keranjang sesuai desain UI */}
      <CustomHeader title="Pesanan Saya" showCart={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* 1. Lapisan Gambar Latar Belakang */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            
            {/* 2. Lapisan Overlay Gelap (Agar teks putih mudah dibaca) */}
            <View style={styles.imageOverlay} />

            {/* 3. Lapisan Konten Utama (Berada di atas Overlay) */}
            <View style={styles.cardInner}>
              
              {/* Baris Atas: ID Pesanan & Badge Status */}
              <View style={styles.topRow}>
                <Text style={styles.orderIdText}>No. Pesanan : {item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>
                    {item.status === 'Menunggu' ? 'Menunggu Pembayaran' : item.status}
                  </Text>
                </View>
              </View>

              {/* Baris Tengah: Judul Lokasi & Info Tambahan */}
              <View style={styles.middleRow}>
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="white" />
                  <Text style={styles.locationText}> {item.location}</Text>
                </View>
              </View>

              {/* Baris Bawah: Info Harga & Tombol Aksi */}
              <View style={styles.bottomRow}>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    Total : Rp. {item.price.toLocaleString('id-ID')}
                  </Text>
                </View>

                <View style={styles.buttonGroup}>
                  {/* Navigasi ke Halaman Detail dengan membawa ID Pesanan */}
                  <TouchableOpacity 
                    style={styles.btnDetail}
                    onPress={() => router.push({
                        pathname: '/DetailPesananSaya',
                        params: { 
                            orderId: item.id,
                            title: item.title,
                            location: item.location,
                            price: item.price,
                            status: item.status,
                            image: item.image
                        }
                    })}
                  >
                    <Text style={styles.btnText}>Lihat Detail</Text>
                  </TouchableOpacity>

                  {/* Tombol Batal: Hanya muncul jika pesanan belum dibatalkan */}
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
        {/* Spacer bawah agar kartu terakhir tidak tertutup navigasi bawah */}
        <View style={{height: 100}} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1, // Berada di atas gambar, di bawah teks
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 2, // Memastikan teks dan tombol berada di lapisan teratas agar bisa diklik
  },
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
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  middleRow: {
    justifyContent: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    backgroundColor: '#102A63',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnBatal: {
    backgroundColor: '#DC2626',
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