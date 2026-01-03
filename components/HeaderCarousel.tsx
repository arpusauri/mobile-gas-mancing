import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

// Ambil lebar layar otomatis
const width = Dimensions.get('window').width;

interface HeaderCarouselProps {
  images: string[];  // Data gambar (Array URL)
  height?: number;   // Tinggi slider (Opsional, default 375)
}

export default function HeaderCarousel({ 
  images, 
  height = 375
}: HeaderCarouselProps) {
  
  return (
    <View style={[styles.container, { height }]}>
      <Carousel
        loop={true}
        width={width}
        height={height}
        autoPlay={false} // Bisa diubah jadi true kalau mau gerak sendiri
        data={images}
        scrollAnimationDuration={500}
        // Biar swipe lancar di dalam ScrollView/GestureHandler
        enabled={true} 
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={styles.image}
          />
        )}
      />
      
      {/* Overlay Gelap (Biar tulisan di atasnya kebaca) */}
      <View style={styles.overlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    // Border radius di sini biar gambarnya melengkung bawahnya
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Wajib, biar gambar gak bocor keluar border radius
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)', // Gelap transparan
    zIndex: 1, 
  },
});