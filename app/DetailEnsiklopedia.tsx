import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// IMPORT COMPONENT CAROUSEL
import HeaderCarousel from '../components/HeaderCarousel';

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.55; // Tinggi Header 55% dari layar

export default function DetailEnsiklopediaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Data Dummy Carousel (Karena params cuma bawa 1 gambar)
  const headerImages = [
    params.image as string,
    'https://images.unsplash.com/photo-1582293881525-472097e88924?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=2070&auto=format&fit=crop',
  ];

  return (
    // 1. WAJIB: GestureHandlerRootView (Sama kayak Booking Screen)
    <GestureHandlerRootView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        
        {/* === HEADER SECTION === */}
        <View style={styles.headerContainer}>
          
          {/* A. CAROUSEL (Layer Paling Bawah) */}
          <HeaderCarousel images={headerImages} height={HEADER_HEIGHT} />

          {/* B. OVERLAY GRADIENT (Biar tulisan kebaca) */}
          {/* pointerEvents="none" biar jari tembus ke carousel pas swipe */}
          <View style={styles.gradientOverlay} pointerEvents="none">
             {/* Gradient Atas (Gelap dikit buat Status Bar) */}
             <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent']}
                style={styles.topGradient}
             />
             {/* Gradient Bawah (Gelap buat Nama Ikan) */}
             <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomGradient}
             />
          </View>

          {/* C. TOMBOL BACK & HEADER TITLE (Layer Atas) */}
          <View style={styles.headerTopBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
                <Ionicons name="book" size={20} color="white" style={{marginRight: 8}}/>
                <Text style={styles.headerTitleText}>Detail Ensiklopedia</Text>
            </View>
            <View style={{ width: 40 }} /> 
          </View>

          {/* D. NAMA IKAN (Di bagian bawah gambar) */}
          <View style={styles.fishNameWrapper} pointerEvents="none">
             <Text style={styles.fishNameText}>{params.name || 'Nama Ikan'}</Text>
          </View>

        </View>

        {/* === DESCRIPTION SECTION === */}
        {/* Margin top negatif supaya "overlap" ke atas gambar */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {params.description || 
             'Ikan ini adalah salah satu spesies yang paling dikenal di terumbu karang. Mereka memiliki warna yang cerah dan pola yang unik, menjadikannya favorit bagi para penyelam dan pecinta akuarium. \n\nHabitat aslinya meliputi perairan hangat di wilayah Indo-Pasifik. Ikan ini sering ditemukan bersembunyi di balik anemon atau celah karang untuk menghindari predator.'}
          </Text>
          
          {/* Dummy text tambahan biar bisa discroll */}
          <Text style={[styles.descriptionText, {marginTop: 15}]}>
             Makanan utama mereka adalah plankton dan alga kecil. Siklus hidup mereka sangat menarik, di mana beberapa spesies dapat berganti kelamin tergantung pada kondisi lingkungan dan struktur sosial dalam kelompoknya.
          </Text>
        </View>

      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // --- HEADER STYLES ---
  headerContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'relative', // Kunci agar children absolute bisa nempel di sini
    backgroundColor: '#000', // Fallback color
  },
  
  // Layer Gradient
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject, // Full screen menutup headerContainer
    justifyContent: 'space-between',
    zIndex: 1, // Di atas gambar
    borderBottomLeftRadius: 30, // Ikutin lengkungan carousel
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  topGradient: {
    height: 120,
    width: '100%',
  },
  bottomGradient: {
    height: 160,
    width: '100%',
  },

  // Layer Navbar (Back Button)
  headerTopBar: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10, // Paling atas supaya tombol bisa dipencet
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Lingkaran transparan halus
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Opsional: latar belakang tipis biar teks jelas
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  // Layer Nama Ikan
  fishNameWrapper: {
    position: 'absolute',
    bottom: 50, // Jarak dari bawah HeaderContainer (Biar gak ketutup kartu putih)
    left: 25,
    right: 25,
    zIndex: 5,
  },
  fishNameText: {
    fontSize: 32,
    fontWeight: '800', // Extra Bold
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  // --- CONTENT STYLES ---
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    
    // INI LOGIKA OVERLAPNYA:
    marginTop: -35, // Tarik ke atas menutupi bagian bawah HeaderContainer
    
    // Shadow biar kelihatan misah dari gambar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    minHeight: height * 0.5, // Biar background putih minimal setengah layar
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    textAlign: 'justify',
  },
});