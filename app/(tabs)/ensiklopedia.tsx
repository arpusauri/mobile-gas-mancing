import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  ImageBackground, 
  TouchableOpacity, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // <--- 1. IMPORT ROUTER

// Data Dummy
const fishData = [
  {
    id: '1',
    name: 'Ikan Nimo (Clownfish)',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop',
    description: 'Ikan badut yang hidup bersimbiosis dengan anemon laut. Sangat populer karena warnanya yang cerah.',
  },
  {
    id: '2',
    name: 'Ikan Dory (Blue Tang)',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1000&auto=format&fit=crop',
    description: 'Ikan Surgeonfish biru yang dikenal pelupa namun setia kawan. Hidup di terumbu karang Indo-Pasifik.',
  },
  {
    id: '3',
    name: 'Ikan Cupang',
    image: 'https://images.unsplash.com/photo-1534982841079-afde227aba20?q=80&w=1000&auto=format&fit=crop',
    description: 'Ikan air tawar dengan sirip indah yang agresif menjaga wilayahnya. Sering dijadikan ikan hias.',
  },
];

// --- KOMPONEN KARTU ---
const FishCard = ({ item }: { item: any }) => {
  const [showDesc, setShowDesc] = useState(false);
  const router = useRouter(); // <--- 2. INISIALISASI ROUTER

  // Logic cek URL atau Lokal
  const imageSource = typeof item.image === 'string' 
    ? { uri: item.image } 
    : item.image;

  // Fungsi pindah halaman
  const handleDetailPress = () => {
    router.push({
      pathname: '/DetailEnsiklopedia', // <--- 3. NAMA FILE DETAIL KAMU
      params: { 
        id: item.id,
        name: item.name,
        image: item.image,
        description: item.description
      } 
    });
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => setShowDesc(!showDesc)}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={imageSource}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        {showDesc ? (
          <View style={styles.descriptionOverlay}>
              <Text style={styles.descTitle}>{item.name}</Text>
              <Text style={styles.descText}>{item.description}</Text>
              <Text style={styles.tapHint}>(Ketuk lagi untuk menutup)</Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Text style={styles.fishName}>{item.name}</Text>
            
            {/* TOMBOL DETAIL DI SINI */}
            <TouchableOpacity 
              style={styles.detailButton} 
              onPress={handleDetailPress} // <--- 4. PASANG FUNGSI KLIK
            >
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>

          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

// --- KOMPONEN UTAMA PAGE ---
export default function EncyclopediaScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="book" size={24} color="#133E87" /> 
        <Text style={styles.headerTitle}>Ensiklopedia</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput 
          placeholder="Cari ikan" 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* LIST KARTU IKAN */}
      <FlatList
        data={fishData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FishCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  cardImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Teks di bawah
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fishName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    maxWidth: '65%', 
  },
  detailButton: {
    backgroundColor: '#133E87',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  detailButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  descriptionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(19, 62, 135, 0.9)', 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  descTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  descText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  tapHint: {
    color: '#DDD',
    fontSize: 10,
    marginTop: 15,
    fontStyle: 'italic',
  }
});