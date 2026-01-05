import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchInput from '../components/SearchInput';
import { useRouter } from 'expo-router';

// Data Dummy
const SEARCH_RESULTS = [
  {
    id: 1, name: 'Pantai Ancol', location: 'Ancol, Jakarta Barat', rating: '4.2', reviews: '300', price: 'Rp. 50.000', unit: '/hari',
    image: require('../assets/images/tempat1.jpg'), facilities: ['Toilet', 'Parkir', 'Mushola']
  },
  {
    id: 2, name: 'Waduk Cirata', location: 'Purwakarta, Jawa Barat', rating: '4.5', reviews: '120', price: 'Rp. 35.000', unit: '/hari',
    image: require('../assets/images/tempat2.jpg'), facilities: ['Kantin', 'Sewa Alat', 'Perahu']
  },
  {
    id: 3, name: 'Danau Toba', location: 'Sumatera Utara', rating: '4.8', reviews: '500', price: 'Rp. 45.000', unit: '/hari',
    image: require('../assets/images/tempat1.jpg'), facilities: ['Penginapan', 'Parkir Luas']
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  // Fungsi untuk pindah ke detail
  const handlePress = () => {
    router.push('/Detail');
  };

  return (
    <LinearGradient
      colors={['#133E87', '#050F21']}
      locations={[0.1, 0.4]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={styles.fixedHeader}>
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Image source={require('../assets/icon/logo_header_putih.png')} style={{ width: 24, height: 14, marginRight: 8 }} resizeMode="contain" />
              <Text style={styles.logoText}>Hasil Pencarian</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          <SearchInput />
        </View>

        {/* KONTEN */}
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}>
            
            <View style={styles.titleContainer}>
              <Text style={styles.pageTitle}>Rekomendasi Spot Mancing</Text>
              <Text style={styles.subTitle}>{SEARCH_RESULTS.length} tempat ditemukan</Text>
            </View>

            {SEARCH_RESULTS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                activeOpacity={0.9}
                onPress={handlePress} // Klik kartu juga bisa pindah
              >
                
                {/* 1. GAMBAR (Full Width Bagian Atas) */}
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                    {/* Badge Rating */}
                    <View style={styles.ratingBadgeOverlay}>
                        <Ionicons name="star" size={12} color="#F1C94D" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>

                {/* 2. KONTEN (Putih di Bawah) */}
                <View style={styles.cardContent}>
                    
                    {/* Judul & Lokasi */}
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={14} color="#999" />
                            <Text style={styles.cardLocation}>{item.location}</Text>
                        </View>
                    </View>

                    {/* Fasilitas */}
                    <View style={styles.facilityRow}>
                        {item.facilities.map((fac, idx) => (
                            <View key={idx} style={styles.facilityTag}>
                                <Text style={styles.facilityText}>{fac}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Garis Pemisah */}
                    <View style={styles.divider} />

                    {/* Footer: Harga & Tombol */}
                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.priceLabel}>Mulai dari</Text>
                            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                                <Text style={styles.priceText}>{item.price}</Text>
                                <Text style={styles.unitText}>{item.unit}</Text>
                            </View>
                        </View>
                        
                        {/* TOMBOL LIHAT (NAVIGASI DITAMBAHKAN DI SINI) */}
                        <TouchableOpacity style={styles.bookButton} onPress={handlePress}>
                            <Text style={styles.bookButtonText}>Lihat</Text>
                            <Ionicons name="arrow-forward" size={16} color="white" style={{marginLeft: 4}}/>
                        </TouchableOpacity>
                    </View>

                </View>
              </TouchableOpacity>
            ))}

          </ScrollView>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  topNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  contentContainer: {
    flex: 1, backgroundColor: '#F5F7FA', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden',
  },
  titleContainer: { paddingHorizontal: 20, marginBottom: 15 },
  pageTitle: { fontSize: 18, fontWeight: 'bold', color: '#133E87' },
  subTitle: { fontSize: 12, color: '#666', marginTop: 2 },

  // --- STYLE CARD CLEAN ---
  card: {
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
    overflow: 'hidden'
  },
  
  imageContainer: { height: 150, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  ratingBadgeOverlay: {
      position: 'absolute', top: 10, right: 10,
      backgroundColor: 'white', flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, elevation: 2
  },
  ratingText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4, color: '#333' },

  cardContent: { padding: 15 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginLeft: -2 },
  cardLocation: { fontSize: 12, color: '#888', marginLeft: 4 },

  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  facilityTag: { 
      backgroundColor: '#F0F4F8', paddingHorizontal: 8, paddingVertical: 4, 
      borderRadius: 6, marginRight: 6, marginBottom: 4 
  },
  facilityText: { fontSize: 10, color: '#555' },

  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 10, color: '#999' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#133E87' },
  unitText: { fontSize: 12, color: '#666', fontWeight:'normal' },

  bookButton: {
      backgroundColor: '#133E87', flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20
  },
  bookButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});