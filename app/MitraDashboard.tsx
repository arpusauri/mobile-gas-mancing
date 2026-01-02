import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  TextInput,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  Modal
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// 1. Import library image picker
import * as ImagePicker from 'expo-image-picker';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

const INITIAL_POOLS = [
  {
    id: '1',
    name: 'Pantai Ancol',
    location: 'Ancol, Jakarta Barat',
    rating: '4.2',
    reviews: '300',
    price: '50.000',
    unit: 'hari',
    description: 'Tempat mancing pinggir laut yang nyaman dan strategis.',
    openTime: '08:00',
    closeTime: '20:00',
    facilities: ['Toilet', 'Parkir'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    orders: [
      { id: 'BK-001', customer: 'Budi Santoso', date: '02/01/2026', status: 'Pending' },
      { id: 'BK-002', customer: 'Siti Aminah', date: '02/01/2026', status: 'Confirmed' },
    ]
  }
];

export default function MitraDashboard() {
  const router = useRouter();
  const [pools, setPools] = useState(INITIAL_POOLS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // STATE MODAL EDIT
  const [isEditVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const openEditModal = (pool: any) => {
    setEditData({ ...pool });
    setEditVisible(true);
  };

  const handleSaveEdit = () => {
    setPools(pools.map(p => p.id === editData.id ? editData : p));
    setEditVisible(false);
    Alert.alert("Berhasil", "Data kolam dan foto telah diperbarui.");
  };

  // 2. FUNGSI HANDLE PHOTO (REAL LOGIC)
  const handleUpdatePhoto = async () => {
    // Minta izin akses galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Izin Ditolak", "Aplikasi butuh izin galeri untuk mengubah foto.");
      return;
    }

    // Buka Galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7, // Kompres sedikit agar tidak terlalu berat
    });

    if (!result.canceled) {
      // Set URI foto baru ke dalam state editData
      setEditData({ ...editData, image: result.assets[0].uri });
    }
  };

  const toggleFacility = (fac: string) => {
    const current = editData.facilities || [];
    if (current.includes(fac)) {
      setEditData({ ...editData, facilities: current.filter((f: string) => f !== fac) });
    } else {
      setEditData({ ...editData, facilities: [...current, fac] });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>Daftar Kolam Saya</Text>
        
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.btnAdd} onPress={() => router.push('/TambahKolam')}>
            <Text style={styles.btnAddText}>+ Tambah Kolam</Text>
          </TouchableOpacity>
        </View>

        {pools.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <ImageBackground source={{ uri: item.image }} style={styles.poolCardBase} imageStyle={{ borderRadius: 25 }}>
              <View style={styles.cardOverlay}>
                <View style={styles.topRow}>
                  <View>
                    <Text style={styles.poolName}>{item.name}</Text>
                    <View style={styles.locRow}>
                      <Ionicons name="location-sharp" size={14} color="#fff" />
                      <Text style={styles.poolLoc}>{item.location}</Text>
                    </View>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text style={styles.ratingText}>{item.rating}({item.reviews})</Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.facilityRow}>
                    {item.facilities.map((fac, idx) => (
                      <View key={idx} style={styles.facilityBadge}><Text style={styles.facilityText}>{fac}</Text></View>
                    ))}
                  </View>

                  <View style={styles.actionGroup}>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>Rp. {item.price}/{item.unit}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.btnEdit} onPress={() => openEditModal(item)}>
                      <Text style={styles.btnEditText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnExpand} onPress={() => toggleExpand(item.id)}>
                      <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>

            {expandedId === item.id && (
              <View style={styles.orderContainer}>
                <Text style={styles.orderTitle}>Pesanan Masuk</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.hCell, { width: 80 }]}>ID</Text>
                      <Text style={[styles.hCell, { width: 120 }]}>PEMESAN</Text>
                      <Text style={[styles.hCell, { width: 100 }]}>STATUS</Text>
                    </View>
                    {item.orders.map((order) => (
                      <View key={order.id} style={styles.tableRow}>
                        <Text style={[styles.rCell, { width: 80 }]}>{order.id}</Text>
                        <Text style={[styles.rCell, { width: 120 }]}>{order.customer}</Text>
                        <Text style={[styles.rCell, { width: 100, fontWeight: 'bold' }]}>{order.status}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* MODAL EDIT DENGAN FUNGSI UPDATE FOTO */}
      <Modal visible={isEditVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Properti</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }}>
              
              {/* AREA KLIK UNTUK GANTI FOTO */}
              <Text style={styles.label}>Foto Lokasi Utama</Text>
              <TouchableOpacity style={styles.photoUploadContainer} onPress={handleUpdatePhoto}>
                <ImageBackground 
                  source={{ uri: editData?.image }} 
                  style={styles.photoUploadImage}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={styles.photoOverlay}>
                    <Ionicons name="camera" size={30} color="#fff" />
                    <Text style={styles.photoText}>Ubah Foto</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <Text style={styles.label}>Nama Pemancingan</Text>
              <TextInput style={styles.input} value={editData?.name} onChangeText={(t) => setEditData({...editData, name: t})} />

              <Text style={styles.label}>Deskripsi</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline value={editData?.description} onChangeText={(t) => setEditData({...editData, description: t})} />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Buka</Text>
                  <TextInput style={styles.input} value={editData?.openTime} onChangeText={(t) => setEditData({...editData, openTime: t})} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Tutup</Text>
                  <TextInput style={styles.input} value={editData?.closeTime} onChangeText={(t) => setEditData({...editData, closeTime: t})} />
                </View>
              </View>

              <Text style={styles.label}>Fasilitas</Text>
              <View style={styles.facRow}>
                {['Toilet', 'Musholla', 'Parkiran'].map(f => (
                  <TouchableOpacity 
                    key={f} 
                    style={[styles.facChip, editData?.facilities.includes(f) && styles.facChipActive]}
                    onPress={() => toggleFacility(f)}
                  >
                    <Text style={[styles.facChipText, editData?.facilities.includes(f) && {color: '#fff'}]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.btnSave} onPress={handleSaveEdit}>
                <Text style={styles.btnSaveText}>Simpan Perubahan</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingTop: 50 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 20 },
  headerRow: { alignItems: 'flex-end', marginBottom: 20 },
  btnAdd: { backgroundColor: '#102A63', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  btnAddText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cardWrapper: { marginBottom: 20 },
  poolCardBase: { width: '100%', height: 210 },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 25, padding: 15, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  poolName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  poolLoc: { color: '#fff', fontSize: 12, marginLeft: 4 },
  ratingBadge: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 15 },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: '#000', marginLeft: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  facilityRow: { flexDirection: 'row', gap: 5 },
  facilityBadge: { backgroundColor: 'rgba(191, 219, 254, 0.9)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15 },
  facilityText: { fontSize: 11, color: '#1E40AF', fontWeight: 'bold' },
  actionGroup: { alignItems: 'flex-end', gap: 8 },
  priceBadge: { backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15 },
  priceText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  btnEdit: { backgroundColor: '#102A63', paddingVertical: 8, paddingHorizontal: 30, borderRadius: 20, width: 130, alignItems: 'center' },
  btnEditText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnExpand: { backgroundColor: 'rgba(16, 42, 99, 0.7)', padding: 6, borderRadius: 20, width: 40, alignItems: 'center' },
  orderContainer: { backgroundColor: '#F8FAFC', marginTop: -25, paddingTop: 40, padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, zIndex: -1, borderWidth: 1, borderColor: '#E2E8F0' },
  orderTitle: { fontSize: 14, fontWeight: 'bold', color: '#102A63', marginBottom: 10 },
  table: { minWidth: width - 70 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E1', paddingBottom: 5 },
  hCell: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rCell: { fontSize: 11, color: '#1E293B' },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.9 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A63' },
  photoUploadContainer: { height: 180, marginBottom: 15, borderRadius: 12, overflow: 'hidden' },
  photoUploadImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  photoOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', gap: 10 },
  photoText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#F9F9F9' },
  row: { flexDirection: 'row', marginTop: 5 },
  facRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  facChip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
  facChipActive: { backgroundColor: '#102A63', borderColor: '#102A63' },
  facChipText: { fontSize: 12, color: '#666' },
  btnSave: { backgroundColor: '#102A63', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  btnSaveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});