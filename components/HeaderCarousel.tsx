import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

interface HeaderCarouselProps {
  images: string[];
  height?: number;
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
        autoPlay={false}
        data={images}
        scrollAnimationDuration={500}
        // TAMBAHAN PENTING 1: Biar swipe lancar di Android & iOS
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10], // Mengutamakan geseran horizontal
        }}
        enabled={true} 
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={styles.image}
          />
        )}
      />
      
      {/* TAMBAHAN PENTING 2: 
         Overlay di sini dihapus saja, karena kita akan pakai gradient 
         di halaman DetailEnsiklopedia biar warnanya lebih nyatu sama teks.
         Kalau dobel overlay, nanti gambarnya jadi terlalu gelap.
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    borderBottomLeftRadius: 35, // Lengkungan disamakan dengan desain
    borderBottomRightRadius: 35,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});