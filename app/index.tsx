import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  ImageBackground,
  Image 
} from 'react-native';
import { router, Stack } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel'; // <--- Import Carousel

const { width, height } = Dimensions.get('window');

// --- DATA GAMBAR CAROUSEL ---
// Nanti kamu bisa ganti require-nya dengan gambar yang berbeda-beda
const carouselData = [
  require('../assets/images/tempat1.jpg'),
  require('../assets/images/tempat2.jpg'), // Contoh duplikat, ganti jika ada gambar lain
  require('../assets/images/tempat3.jpg'), // Contoh duplikat
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0); // <--- State untuk Dots aktif

  const handleSignUp = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> 
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Background Hiasan (Sesuai kode kamu sebelumnya) */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobRightCenter} />
      <View style={styles.waveBottom} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* --- BAGIAN CAROUSEL --- */}
          <View style={{ marginTop: 20, height: height * 0.45 }}>
            <Carousel
              loop
              width={width} // Lebar area geser (full screen width biar smooth)
              height={height * 0.45} // Tinggi area geser
              autoPlay={true} // Otomatis geser
              autoPlayInterval={3000} // Setiap 3 detik
              data={carouselData}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)} // Update dots saat geser
              renderItem={({ item }) => (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Container Kartu */}
                    <View style={styles.cardContainer}>
                        <ImageBackground
                        source={item} // Ambil source dari data array
                        style={styles.cardImage}
                        imageStyle={{ borderRadius: 30 }}
                        >
                        <View style={styles.cardOverlay}>
                            <Image 
                            source={require('../assets/icon/logo_halaman_depan.png')} 
                            style={styles.logoImage} 
                            resizeMode="contain" 
                            />
                        </View>
                        </ImageBackground>
                    </View>
                </View>
              )}
            />
          </View>

          {/* --- DOTS INDICATOR (Dinamis) --- */}
          <View style={styles.dotsContainer}>
            {carouselData.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  currentIndex === index ? styles.dotActive : styles.dotInactive
                ]} 
              />
            ))}
          </View>

          {/* TEKS */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              WELCOME TO <Text style={styles.highlightText}>GASMANCING</Text>{'\n'}
              Fish Anywhere in The World.
            </Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.descriptionText}>
              Discover thousands of secret fishing spots and join the largest global community of passionate anglers.
            </Text>
          </View>

          {/* TOMBOL */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => alert('Fitur Login belum dibuat')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  // Hiasan Latar Belakang
  blobTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 149, 213, 0.2)',
  },
  blobRightCenter: {
    position: 'absolute',
    top: height * 0.4,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(22, 64, 129, 0.1)',
  },
  waveBottom: {
    position: 'absolute',
    bottom: -80,
    left: -20,
    right: -20,
    height: 200,
    backgroundColor: '#3B95D5',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    opacity: 0.8,
  },
  
  // Style Kartu (Di dalam Carousel)
  cardContainer: {
    width: width * 0.85, // Lebar kartu tetap 85% layar
    height: '100%',      // Tinggi mengikuti parent carousel
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    backgroundColor: 'white', 
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120, 
    height: 120,
  },

  // Dots
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 25,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 25, // Sedikit lebih panjang saat aktif
    backgroundColor: '#164081',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D3D3D3',
  },
  
  // Teks
  textContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    lineHeight: 30,
  },
  highlightText: {
    color: '#164081',
  },
  divider: {
    width: 120,
    height: 2,
    backgroundColor: '#000',
    marginTop: 10,
    marginBottom: 15,
  },
  descriptionText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Tombol
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#164081',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  signUpText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#555',
  },
  signInLink: {
    color: '#3B95D5',
    fontWeight: 'bold',
  },
});