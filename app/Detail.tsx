import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Data Dummy untuk Ulasan
  const REVIEWS = [
    {
      id: 1,
      user: 'Bambang Pamungkas',
      rating: 4.2,
      image: require('../assets/images/react-logo.png'), 
      comment: "Aplikasi ini bener-bener membantu banget buat saya yang hobi mancing. Mulai dari info spot mancing terdekat, cuaca laut, sampai tips peralatan semua ada."
    },
    {
      id: 2,
      user: 'Bambang Pamungkas',
      rating: 4.2,
      image: require('../assets/images/react-logo.png'),
      comment: "Desainnya simpel tapi informatif, jadi gampang dipakai walau lagi di kapal. Recommended buat pemula maupun pro!"
    },
    {
      id: 3,
      user: 'Bambang Pamungkas',
      rating: 4.2,
      image: require('../assets/images/react-logo.png'),
      comment: "Spotnya akurat banget, saya dapat banyak ikan pas kesini. Fasilitas juga sesuai deskripsi."
    },
  ];

  // Data Dummy Fasilitas
  const FACILITIES = ['Parkir', 'Toilet', 'Parkir', 'Parkir', 'Parkir', 'Parkir', 'Parkir'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FIXED BOTTOM BUTTON (Style Baru: Biru Tua Melengkung) */}
      <View style={styles.bottomFooter}>
        <View>
            <Text style={styles.priceLabel}>Harga Mulai</Text>
            {/* Harga jadi Putih */}
            <Text style={styles.priceText}>Rp 50.000<Text style={styles.priceUnit}>/hari</Text></Text>
        </View>
        {/* Tombol jadi Putih */}
        <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* --- 1. HEADER IMAGE --- */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={require('../assets/images/tempat1.jpg')}
            style={styles.headerImage}
            imageStyle={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradientOverlay}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

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
          </ImageBackground>
        </View>

        {/* --- 2. KONTEN BODY --- */}
        <View style={styles.bodyContainer}>
          
          <Text style={styles.sectionTitle}>Pantai Ancol</Text>
          <Text style={styles.descriptionText}>
            Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan.
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
                  {/* Ganti warna gradasi jadi Biru Tua tema */}
                  <LinearGradient colors={['#2A549E', '#133E87']} style={styles.equipmentBg}>
                     <Image source={require('../assets/images/item1.jpg')} style={{width: 160, height: 160}} resizeMode="contain"/>
                  </LinearGradient>
                  {/* Ganti background label jadi Biru Tua tema */}
                  <View style={styles.equipmentLabel}>
                    <Text style={{color:'white', fontWeight:'bold'}}>Pancingan</Text>
                  </View>
               </View>
             ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* ULASAN */}
          <Text style={styles.subHeader}>Ulasan</Text>
          <View style={styles.reviewList}>
            {REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={review.image} style={styles.avatar} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  
  // HEADER
  headerContainer: {
    height: 350, width: '100%', backgroundColor: 'white',
  },
  headerImage: {
    width: '100%', height: '100%', justifyContent: 'flex-end',
  },
  gradientOverlay: {
    position: 'absolute', left:0, right:0, bottom:0, top:0,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40
  },
  backButton: {
    position: 'absolute', top: 50, left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8
  },
  headerInfo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 25, paddingBottom: 30,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerLocation: { fontSize: 14, color: '#f0f0f0', marginLeft: 4 },
  ratingBadge: {
    backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center'
  },
  ratingText: { fontWeight: 'bold', fontSize: 14, marginLeft: 5 },

  // BODY
  bodyContainer: { paddingHorizontal: 25, paddingTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },

  // FASILITAS
  facilitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityChip: {
    backgroundColor: '#C5DFF8', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginRight: 8, marginBottom: 8
  },
  facilityText: { color: '#133E87', fontWeight: '600', fontSize: 12 },

  // PERALATAN (Box Warna Disesuaikan)
  equipmentCard: {
    width: 120, height: 100, borderRadius: 15, marginRight: 15, overflow: 'hidden',
    // borderWidth dihapus biar lebih clean dengan warna gelap
  },
  equipmentBg: { flex: 1, justifyContent:'center', alignItems:'center' },
  equipmentLabel: { 
      height: 25, 
      backgroundColor: '#133E87', // Warna Biru Tua Tema
      alignItems: 'center', justifyContent:'center' 
  },

  // ULASAN
  reviewList: { marginTop: 5 },
  reviewCard: {
    backgroundColor: '#F0F0F0', borderRadius: 20, padding: 15, marginBottom: 15
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor:'#ddd' },
  reviewerName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  reviewRatingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', alignSelf:'flex-start', paddingHorizontal:6, paddingVertical:2, borderRadius:10, marginTop:4 },
  reviewRatingText: { fontSize: 10, fontWeight: 'bold', marginLeft: 3 },
  reviewComment: { fontSize: 13, color: '#444', lineHeight: 20 },

  // BOTTOM FOOTER (Style Baru: Biru Tua Melengkung)
  bottomFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#133E87', // Background Biru Tua
    borderTopLeftRadius: 30, borderTopRightRadius: 30, // Sudut melengkung atas
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingVertical: 15, paddingBottom: 25,
    elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10,
    zIndex: 100
  },
  priceLabel: { fontSize: 12, color: '#B0C4DE' }, // Warna teks label lebih terang dikit
  priceText: { fontSize: 18, fontWeight: 'bold', color: 'white' }, // Harga Putih
  priceUnit: { fontSize: 12, fontWeight: 'normal', color: '#B0C4DE' },
  bookButton: {
    backgroundColor: 'white', // Tombol Putih
    paddingHorizontal: 30, paddingVertical: 12,
    borderRadius: 25
  },
  bookButtonText: { color: '#133E87', fontWeight: 'bold', fontSize: 14 } // Teks Tombol Biru
});