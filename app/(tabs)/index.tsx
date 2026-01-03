import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import SearchInput from '../../components/SearchInput'; // Panggil Komponen

// --- DATA DUMMY ---
const POPULAR_SPOTS = [
  { id: 1, name: 'Pantai Ancol', location: 'Ancol, Jakarta Barat', rating: 4.2, reviews: 300, price: 'Rp. 50.000/hari', image: require('../../assets/images/tempat1.jpg') },
  { id: 2, name: 'Waduk Cirata', location: 'Purwakarta', rating: 4.5, reviews: 120, price: 'Rp. 35.000/hari', image: require('../../assets/images/tempat2.jpg') },
  { id: 3, name: 'Danau Toba', location: 'Sumatera Utara', rating: 4.8, reviews: 500, price: 'Rp. 45.000/hari', image: require('../../assets/images/tempat1.jpg') },
];

const TIPS = [
  { id: 1, title: 'Teknik Mancing', desc: 'Panduan lengkap metode memancing dasar.' },
  { id: 2, title: 'Umpan Jitu', desc: 'Rahasia racikan umpan untuk ikan air tawar.' },
  { id: 3, title: 'Spot Rahasia', desc: 'Cara menemukan spot ikan besar.' },
];

export default function HomeScreen() {
  return (
    <LinearGradient
        colors={['#133E87', '#050F21']}
        locations={[0.1, 0.4]} 
        style={styles.container}
      >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* --- HEADER --- */}
        <View style={styles.fixedHeader}>
            <View style={styles.logoRow}>
                <Image source={require('../../assets/icon/logo_header_putih.png')} style={{ width: 32, height: 18, marginRight: 10 }} resizeMode="contain"/>
                <Text style={styles.logoText}>Gas Mancing</Text>
            </View>

            {/* PANGGIL COMPONENT SEARCH DISINI */}
            <SearchInput />
        </View>

        {/* --- KONTEN PUTIH (SHEET) --- */}
        <View style={styles.contentContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 25 }}>
                
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tempat Populer</Text>
                </View>

                {/* Populer List */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
                    {POPULAR_SPOTS.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.cardPopular}>
                        <ImageBackground source={item.image} style={styles.cardImage} imageStyle={{ borderRadius: 20 }}>
                            <View style={styles.cardHeaderRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                        <Ionicons name="location-sharp" size={12} color="white" />
                                        <Text style={styles.cardLocation}>{item.location}</Text>
                                    </View>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={12} color="#F1C94D" />
                                    <Text style={styles.ratingText}>{item.rating} <Text style={{color:'#999', fontWeight:'normal'}}>({item.reviews})</Text></Text>
                                </View>
                            </View>
                            <View style={styles.priceBadge}>
                                <Text style={styles.priceText}>{item.price}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Tips Mancing */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>Tips Mancing</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginTop: 10 }}>
                    {TIPS.map((item) => (
                    <View key={item.id} style={styles.cardTips}>
                        <View style={styles.iconBox}>
                            <Ionicons name="book-outline" size={24} color="white" />
                        </View>
                        <Text style={styles.tipsTitle}>{item.title}</Text>
                        <Text style={styles.tipsDesc}>{item.desc}</Text>
                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
                            <Text style={{fontWeight:'bold', fontSize:12, color:'#133E87', marginRight: 5}}>Baca Selengkapnya</Text>
                            <Ionicons name="arrow-forward" size={12} color='#133E87' />
                        </TouchableOpacity>
                    </View>
                    ))}
                </ScrollView>

                {/* Banner */}
                <View style={styles.bannerBox}>
                    <Text style={styles.bannerTitle}>Daftarkan Properti Anda!</Text>
                    <Text style={styles.bannerDesc}>Bergabunglah menjadi mitra kami.</Text>
                    <TouchableOpacity style={styles.bannerBtn}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:12}}>Gabung Sekarang</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 25, zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  
  contentContainer: {
      flex: 1, backgroundColor: '#F0F4F8',
      borderTopLeftRadius: 35, borderTopRightRadius: 35,
      overflow: 'hidden',
  },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  
  cardPopular: { width: 260, height: 320, marginRight: 15, borderRadius: 20, elevation: 5 },
  cardImage: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  cardLocation: { fontSize: 12, color: 'white', marginLeft: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  ratingBadge: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15 },
  ratingText: { fontSize: 11, fontWeight: 'bold', marginLeft: 3 },
  priceBadge: { alignSelf: 'flex-start', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  priceText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  
  cardTips: { width: 160, height: 180, backgroundColor: 'white', borderRadius: 15, marginRight: 15, padding: 15, justifyContent: 'space-between', elevation: 1 },
  iconBox: { width: 40, height: 40, backgroundColor: '#133E87', borderRadius: 10, justifyContent:'center', alignItems:'center', marginBottom: 5 },
  tipsTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  tipsDesc: { fontSize: 11, color: '#666', lineHeight: 16 },
  
  bannerBox: { backgroundColor: '#D9D9D9', margin: 20, borderRadius: 15, padding: 20, alignItems: 'flex-start' },
  bannerTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  bannerDesc: { fontSize: 12, color: '#444', marginBottom: 15 },
  bannerBtn: { backgroundColor: '#133E87', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignSelf:'flex-end' },
});