// components/BackgroundLayout.tsx
import React from 'react';
import { StyleSheet, View, Image, Dimensions, ViewProps } from 'react-native';

const { width, height } = Dimensions.get('window');

// Logic responsif sederhana
const isSmallScreen = height < 700;

interface BackgroundLayoutProps extends ViewProps {
  children: React.ReactNode;
}

export default function BackgroundLayout({ children, style, ...props }: BackgroundLayoutProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {/* --- BACKGROUND ELEMENTS --- */}
      
      {/* 1. Blob Kiri Atas */}
      <Image 
        source={require('../assets/images/Gelembung3.png')} 
        style={styles.bgBlobTopLeft}
        resizeMode="contain" 
      />

      {/* 2. Blob Kanan Tengah */}
      <Image 
        source={require('../assets/images/Gelembung2.png')}
        style={styles.bgBlobRightCenter}
        resizeMode="contain"
      />

       {/* 3. Blob Kecil Kiri Bawah */}
       <Image 
        source={require('../assets/images/Gelembung1.png')}
        style={styles.bgBlobSmallBottom}
        resizeMode="contain"
      />

      {/* 4. Wave Bawah */}
      <Image 
        source={require('../assets/images/wave-halaman-depan.png')}
        style={styles.bgWaveBottom}
        resizeMode="stretch" 
      />
      
      {/* --- CONTENT (Apapun yang ditaruh di dalam component ini) --- */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative', // Penting untuk absolute positioning anak-anaknya
  },
  contentContainer: {
    flex: 1,
    zIndex: 1, // Pastikan konten selalu di atas background
  },
  
  // --- STYLING BACKGROUND (Logic Responsif yang sudah kita buat) ---
  bgBlobTopLeft: {
    position: 'absolute',
    top: -height * 0.1, 
    left: -width * 0.2,
    width: width * 0.9, 
    height: width * 0.9,
    opacity: 0.9, 
    zIndex: 0, 
  },
  bgBlobRightCenter: {
    position: 'absolute',
    top: height * 0.35, 
    right: -width * 0.25,
    width: width * 0.7,
    height: width * 0.7,
    opacity: 0.8,
    zIndex: 0,
  },
  bgBlobSmallBottom: {
    position: 'absolute',
    bottom: height * 0.18, 
    left: -width * 0.05, 
    width: width * 0.35,
    height: width * 0.35,
    opacity: 0.9,
    zIndex: 0,
  },
  bgWaveBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%', 
    height: undefined, 
    aspectRatio: 375 / 160, // Sesuaikan dengan rasio gambar wave aslimu
    zIndex: 0,
  },
});