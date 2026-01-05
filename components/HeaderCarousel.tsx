import React, { useState } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator
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
        enabled={true} 
        // 👇 PERBAIKAN 1: Panggil komponen CarouselImageItem (JANGAN Image langsung)
        renderItem={({ item }) => <CarouselImageItem item={item} />}
      />
    </View>
  );
}

// 👇 PERBAIKAN 2: Komponen ini yang ngurusin loading + format link gambar
function CarouselImageItem({ item }: { item: string }) {
  const [loading, setLoading] = useState(true); 

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}> 
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#102A63" />
        </View>
      )}
      
      <Image 
        // 👇 PERBAIKAN 3: Pakai { uri: item } karena ini Link Internet
        source={{ uri: item }} 
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',        
    alignItems: 'center',            
    zIndex: 1,                       
  },
});