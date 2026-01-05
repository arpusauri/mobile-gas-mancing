import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  ImageBackground 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function MitraScreen() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.mainContainer}>
        {/* --- DEKORASI LINGKARAN --- */}
        <View style={styles.circleLarge} />
        <View style={styles.circleMedium} />
        <View style={styles.circleSmall} />

        {/* --- HEADER LOGO --- */}
        <View style={styles.headerLogo}>
           <Image 
             source={{ uri: 'https://i.ibb.co/dummy-logo-fish.png' }} // Ganti asset asli nanti
             style={styles.logoImage} 
           />
           <Text style={styles.brandName}>Gas Mancing</Text>
        </View>

        {/* --- MAIN CONTENT --- */}
        <View style={styles.centerContent}>
           <Text style={styles.titleText}>Gabung Jadi Mitra</Text>
           <Text style={styles.titleText}>GasMancing</Text>

           <TouchableOpacity 
             style={styles.mainButton}
             onPress={() => router.push('/Booking')} // Contoh navigasi
           >
             <Text style={styles.buttonText}>Daftarkan Properti</Text>
           </TouchableOpacity>
        </View>

        {/* --- FOOTER WAVES --- */}
        <View style={styles.waveWrapper}>
           <Image 
             source={{ uri: 'https://i.ibb.co/dummy-waves.png' }} // Ganti asset asli nanti
             style={styles.waveImage}
             resizeMode="stretch"
           />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 25,
  },
  logoImage: { width: 30, height: 30, marginRight: 10 },
  brandName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Menyeimbangkan posisi karena ada ombak di bawah
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#102A63',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: 25,
  },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },

  // DEKORASI (Mirip di gambar Mitra.png)
  circleLarge: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E0E7FF', // Biru sangat muda (soft gradient)
    top: -50,
    right: -50,
  },
  circleMedium: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E7FF',
    left: -50,
    top: height * 0.4,
  },
  circleSmall: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#102A63',
    opacity: 0.2,
    right: 40,
    bottom: 250,
  },

  waveWrapper: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 180,
  },
  waveImage: { width: '100%', height: '100%' },
});