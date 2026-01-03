import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Data Dummy untuk Ikan Nimo (sesuai desain)
const FISH_DETAIL_DATA = {
  id: '1',
  name: 'Ikan Nimo',
  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop', // Gambar Ikan Badut
  description:
    'Ikan ini lebih dikenal sebagai "Ikan Nimo" berkat popularitasnya di layar lebar. Ikan Badut hidup bersimbiosis dengan anemon laut. Uniknya, mereka kebal terhadap sengatan anemon dan menjadikannya sebagai rumah yang aman dari predator. Warna oranye cerah dengan garis putih vertikal menjadi ciri khas utamanya yang sangat ikonik di terumbu karang.',
};

export default function DetailEnsiklopediaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Simulasi pengambilan data berdasarkan ID (di sini kita pakai data dummy langsung)
  const fish = FISH_DETAIL_DATA;

  if (!fish) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Data ikan tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {/* Header Gambar Ikan */}
        <ImageBackground source={{ uri: fish.image }} style={styles.headerImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />

          {/* Header Atas: Tombol Kembali & Judul Halaman */}
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons name="book" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitleText}>Detail Ensiklopedia</Text>
            </View>
            <View style={{ width: 40 }} /> {/* Penyeimbang kanan */}
          </View>

          {/* Nama Ikan di Bagian Bawah Header */}
          <Text style={styles.fishNameTitle}>{fish.name}</Text>
        </ImageBackground>

        {/* Kartu Putih Deskripsi */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>{fish.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Warna background abu muda
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  // Styles Header Gambar
  headerImage: {
    width: width,
    height: height * 0.55, // Tinggi header sekitar setengah layar
    justifyContent: 'space-between', // Header bar di atas, nama ikan di bawah
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 40, // Memberi ruang untuk nama ikan sebelum tertutup kartu
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Latar belakang transparan untuk tombol kembali
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  fishNameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 25,
    marginBottom: 10, // Jarak dari batas bawah header
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Bayangan teks agar lebih menonjol
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  // Styles Kartu Deskripsi
  descriptionCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    marginTop: -35, // Margin negatif agar kartu menutupi bagian bawah header
    minHeight: height * 0.5, // Memastikan kartu mengisi sisa layar
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Warna teks judul gelap
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444', // Warna teks deskripsi sedikit lebih terang
    lineHeight: 26, // Jarak antar baris agar nyaman dibaca
    textAlign: 'justify', // Teks rata kanan-kiri
  },
});