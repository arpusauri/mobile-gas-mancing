import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
// 1. IMPORT WAJIB
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderCarousel from '../components/HeaderCarousel'; // Pastikan path sesuai

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 2. DATA DUMMY UNTUK SLIDER (Ganti ImageBackground jadi ini)
  const headerImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop', // Gambar Pantai
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop',
  ];

  // Data Dummy Ulasan
  const REVIEWS = [
    {
      id: 1,
      user: 'Bambang Pamungkas',
      rating: 4.2,
      image: 'https://randomuser.me/api/portraits/men/1.jpg', 
      comment: "Aplikasi ini bener-bener membantu banget buat saya yang hobi mancing. Mulai dari info spot mancing terdekat, cuaca laut, sampai tips peralatan semua ada."
    },
    {
      id: 2,
      user: 'Susi Susanti',
      rating: 4.5,
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      comment: "Desainnya simpel tapi informatif, jadi gampang dipakai walau lagi di kapal. Recommended buat pemula maupun pro!"
    },
    {
      id: 3,
      user: 'Taufik Hidayat',
      rating: 4.0,
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      comment: "Spotnya akurat banget, saya dapat banyak ikan pas kesini. Fasilitas juga sesuai deskripsi."
    },
  ];

  const FACILITIES = ['Parkir', 'Toilet', 'Musholla', 'Kantin', 'Sewa Kapal', 'Spot Foto'];

  return (
    // 3. BUNGKUS DENGAN GESTURE HANDLER
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 120 }}
          bounces={false}
        >
          
          {/* --- 1. HEADER AREA (CAROUSEL + TEXT) --- */}
          <View style={styles.headerContainer}>
            
            {/* LAYER 1: SLIDER GAMBAR */}
            <HeaderCarousel images={headerImages} height={350} />

            {/* LAYER 2: OVERLAY CONTENT (Text & Tombol Back) */}
            {/* pointerEvents="box-none" biar swipe tembus ke gambar */}
            <View style={styles.headerOverlay} pointerEvents="box-none">
              
              {/* Gradient Gelap di Bawah biar teks putih kebaca */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientBottom}
                pointerEvents="none"
              />

              {/* Tombol Back */}
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              {/* Info Judul & Lokasi */}
              <View style={styles.headerInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerTitle}>Pantai Ancol</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location-outline" size={16} color="#ddd" />
                    <Text style={styles.headerLocation}>Ancol, Jakarta Barat</Text>
                  </View>
                </View>
                
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#F1C94D" />
                  <Text style={styles.ratingText}>4.2 <Text style={{fontWeight:'normal', color:'#555'}}>(300)</Text></Text>
                </View>
              </View>

            </View>
          </View>

          {/* --- 2. KONTEN BODY --- */}
          <View style={styles.bodyContainer}>
            
            <Text style={styles.sectionTitle}>Tentang Lokasi</Text>
            <Text style={styles.descriptionText}>
              Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan. Angin sepoi-sepoi dan ombak yang tenang menjadikan tempat ini favorit bagi para pemancing.
            </Text>

            <View style={styles.divider} />

            {/* FASILITAS */}
            <Text style={styles.subHeader}>Fasilitas</Text>
            <View style={styles.facilitiesRow}>
              {FACILITIES.map((item, index) => (
                <View key={index} style={styles.facilityChip}>
                  <Text style={styles.facilityText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* PERALATAN TAMBAHAN */}
            <Text style={styles.subHeader}>Peralatan Tambahan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
               {[1, 2, 3].map((item) => (
                 <View key={item} style={styles.equipmentCard}>
                   <LinearGradient colors={['#2A549E', '#133E87']} style={styles.equipmentBg}>
                      {/* Ganti source gambar sesuai aset kamu */}
                      <Image 
                        source={{uri: 'https://images.unsplash.com/photo-1541743132-72e505809774?q=80&w=1000&auto=format&fit=crop'}} 
                        style={{width: '100%', height: '100%', opacity: 0.8}} 
                        resizeMode="cover"
                      />
                   </LinearGradient>
                   <View style={styles.equipmentLabel}>
                     <Text style={{color:'white', fontWeight:'bold', fontSize: 12}}>Pancingan Set</Text>
                   </View>
                 </View>
               ))}
            </ScrollView>

            <View style={styles.divider} />

            {/* ULASAN */}
            <Text style={styles.subHeader}>Ulasan Pengunjung</Text>
            <View style={styles.reviewList}>
              {REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={{ uri: review.image }} style={styles.avatar} />
                      <View>
                          <Text style={styles.reviewerName}>{review.user}</Text>
                          <View style={styles.reviewRatingRow}>
                             <Ionicons name="star" size={12} color="#F1C94D" />
                             <Text style={styles.reviewRatingText}>{review.rating}</Text>
                          </View>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>

          </View>
        </ScrollView>

        {/* --- FIXED BOTTOM FOOTER (Style Baru: Biru Tua Melengkung) --- */}
        <View style={styles.bottomFooter}>
          <View>
              <Text style={styles.priceLabel}>Harga Mulai</Text>
              <Text style={styles.priceText}>Rp 50.000<Text style={styles.priceUnit}>/hari</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => {
              // Contoh Navigasi ke Halaman Booking
              router.push({
                pathname: "/Booking", // Sesuaikan nama file kamu
                params: { name: "Pantai Ancol", price: 50000 }
              });
            }}
          >
              <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
          </TouchableOpacity>
        </View>

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  
  // HEADER
  headerContainer: {
    height: 350, 
    width: '100%', 
    position: 'relative', // PENTING
    backgroundColor: '#eee',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject, // Isi penuh container
    justifyContent: 'space-between', // Back button di atas, Info di bawah
    zIndex: 10,
    paddingBottom: 30, // Jarak dari bawah
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 150, // Tinggi bayangan hitam
    borderBottomLeftRadius: 35, // Samakan dengan carousel
    borderBottomRightRadius: 35,
  },
  backButton: {
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    marginLeft: 20,
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 20,
  },
  headerInfo: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
    paddingHorizontal: 25,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerLocation: { fontSize: 14, color: '#f0f0f0', marginLeft: 4 },
  ratingBadge: {
    backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center'
  },
  ratingText: { fontWeight: 'bold', fontSize: 14, marginLeft: 5 },

  // BODY
  bodyContainer: { paddingHorizontal: 25, paddingTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22, textAlign: 'justify' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },

  // FASILITAS
  facilitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityChip: {
    backgroundColor: '#E3F2FD', // Biru sangat muda
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginRight: 8, marginBottom: 8
  },
  facilityText: { color: '#133E87', fontWeight: '600', fontSize: 12 },

  // PERALATAN
  equipmentCard: {
    width: 120, height: 120, 
    borderRadius: 15, marginRight: 15, 
    overflow: 'hidden',
    backgroundColor: '#f9f9f9'
  },
  equipmentBg: { flex: 1, justifyContent:'center', alignItems:'center' },
  equipmentLabel: { 
    height: 30, 
    backgroundColor: '#133E87', 
    alignItems: 'center', justifyContent:'center' 
  },

  // ULASAN
  reviewList: { marginTop: 5 },
  reviewCard: {
    backgroundColor: '#F9FAFB', 
    borderRadius: 16, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee'
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor:'#ddd' },
  reviewerName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  reviewRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop:2 },
  reviewRatingText: { fontSize: 12, fontWeight: 'bold', marginLeft: 3, color: '#555' },
  reviewComment: { fontSize: 13, color: '#444', lineHeight: 20 },

  // FOOTER (Style Biru Melengkung Pilihanmu)
  bottomFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#133E87', // Warna Utama
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingVertical: 20, paddingBottom: 30,
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: -5},
    zIndex: 100
  },
  priceLabel: { fontSize: 12, color: '#B0C4DE' },
  priceText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  priceUnit: { fontSize: 12, fontWeight: 'normal', color: '#B0C4DE' },
  bookButton: {
    backgroundColor: 'white',
    paddingHorizontal: 25, paddingVertical: 12,
    borderRadius: 25,
    elevation: 2
  },
  bookButtonText: { color: '#133E87', fontWeight: 'bold', fontSize: 14 }
});