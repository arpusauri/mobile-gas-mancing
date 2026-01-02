import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, 
  TextInput, Dimensions, LayoutAnimation, Platform, UIManager, Alert, Modal 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    facilities: ['Toilet', 'Parkiran', 'Musholla'],
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
  const [isEditVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showPicker, setShowPicker] = useState<'open' | 'close' | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const openEditModal = (pool: any) => {
    setEditData({ ...pool });
    setEditVisible(true);
  };

  const handleUpdatePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [16, 9], quality: 0.7 });
    if (!result.canceled) setEditData({ ...editData, image: result.assets[0].uri });
  };

  const toggleFacility = (fac: string) => {
    const current = editData.facilities || [];
    setEditData({ 
      ...editData, 
      facilities: current.includes(fac) ? current.filter((f: string) => f !== fac) : [...current, fac] 
    });
  };

  const handleCancelOrder = (poolId: string, orderId: string) => {
    Alert.alert("Konfirmasi", `Batalkan pesanan ${orderId}?`, [
      { text: "Batal" },
      { text: "Ya, Hapus", style: 'destructive', onPress: () => {
        setPools(pools.map(p => p.id === poolId ? { ...p, orders: p.orders.filter(o => o.id !== orderId) } : p));
      }}
    ]);
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
                    <View style={styles.locRow}><Ionicons name="location-sharp" size={14} color="#fff" /><Text style={styles.poolLoc}>{item.location}</Text></View>
                  </View>
                  <View style={styles.ratingBadge}><Ionicons name="star" size={12} color="#FBBF24" /><Text style={styles.ratingText}>{item.rating}({item.reviews})</Text></View>
                </View>

                <View style={styles.bottomRow}>
                  {/* 1. Tambahin flex: 1 dan flexWrap supaya fasilitas otomatis turun ke bawah kalau penuh */}
                  <View style={[styles.facilityRow, { flex: 1, flexWrap: 'wrap', alignSelf: 'flex-end' }]}>
                    {item.facilities.map((fac, idx) => (
                      <View key={idx} style={styles.facilityBadge}>
                        <Text style={styles.facilityText}>{fac}</Text>
                      </View>
                    ))}
                  </View>

                  {/* 2. Tambahin width tetap (130) dan alignItems: 'flex-end' supaya tombol tetep rapi di kanan */}
                  <View style={[styles.actionGroup, { width: 130, alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>Rp. {item.price}/{item.unit}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.btnEdit} onPress={() => openEditModal(item)}>
                      <Text style={styles.btnEditText}>Edit</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={styles.btnExpand} onPress={() => toggleExpand(item.id)}>
                        <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
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
                      <Text style={[styles.hCell, { width: 50 }]}>ID</Text>
                      <Text style={[styles.hCell, { width: 85 }]}>PEMESAN</Text>
                      <Text style={[styles.hCell, { width: 85 }]}>TGL SEWA</Text>
                      <Text style={[styles.hCell, { width: 80 }]}>STATUS</Text>
                      <Text style={[styles.hCell, { width: 50 }]}>AKSI</Text>
                    </View>
                    {item.orders.map((order) => (
                      <View key={order.id} style={styles.tableRow}>
                        <Text style={[styles.rCell, { width: 50 }]}>{order.id}</Text>
                        <Text style={[styles.rCell, { width: 85 }]}>{order.customer}</Text>
                        <Text style={[styles.rCell, { width: 85 }]}>{order.date}</Text>
                        <Text style={[styles.rCell, { width: 70, fontWeight: 'bold', color: order.status === 'Pending' ? '#F59E0B' : '#10B981' }]}>{order.status}</Text>
                        <TouchableOpacity onPress={() => handleCancelOrder(item.id, order.id)} style={{ width: 40, alignItems: 'center' }}>
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* MODAL EDIT FULL */}
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
              <Text style={styles.label}>Foto Lokasi Utama</Text>
              <TouchableOpacity style={styles.photoUploadContainer} onPress={handleUpdatePhoto}>
                <ImageBackground source={{ uri: editData?.image }} style={styles.photoUploadImage} imageStyle={{ borderRadius: 12 }}>
                  <View style={styles.photoOverlay}>
                    <Ionicons name="camera" size={30} color="#fff" />
                    <Text style={styles.photoText}>Ganti Foto</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <Text style={styles.label}>Nama Kolam</Text>
              <TextInput 
                style={styles.input} 
                value={editData?.name} 
                onChangeText={(t) => setEditData({...editData, name: t})} 
              />

              {/* --- FIELD BARU: ALAMAT --- */}
              <Text style={styles.label}>Alamat Lengkap</Text>
              <TextInput 
                style={[styles.input, {height: 60, textAlignVertical: 'top'}]} 
                multiline 
                value={editData?.location} 
                onChangeText={(t) => setEditData({...editData, location: t})} 
              />

              {/* --- FIELD BARU: HARGA & SATUAN --- */}
              <View style={styles.row}>
                <View style={{ flex: 2, marginRight: 10 }}>
                  <Text style={styles.label}>Harga (Rp)</Text>
                  <TextInput 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={editData?.price} 
                    onChangeText={(t) => setEditData({...editData, price: t})} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Satuan</Text>
                  <View style={styles.unitContainer}>
                    {['jam', 'hari'].map(u => (
                      <TouchableOpacity 
                        key={u} 
                        onPress={() => setEditData({...editData, unit: u})} 
                        style={[styles.uBtn, editData?.unit === u && styles.uActive]}
                      >
                        <Text style={{ fontSize: 10, color: editData?.unit === u ? '#fff' : '#000', textTransform: 'capitalize' }}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Deskripsi</Text>
              <TextInput 
                style={[styles.input, {height: 70, textAlignVertical: 'top'}]} 
                multiline 
                value={editData?.description} 
                onChangeText={(t) => setEditData({...editData, description: t})} 
              />

              <View style={styles.row}>
                <TouchableOpacity style={{flex:1, marginRight:10}} onPress={() => setShowPicker('open')}>
                    <Text style={styles.label}>Buka</Text>
                    <View style={styles.input}><Text>{editData?.openTime}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => setShowPicker('close')}>
                    <Text style={styles.label}>Tutup</Text>
                    <View style={styles.input}><Text>{editData?.closeTime}</Text></View>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Fasilitas</Text>
              <View style={styles.facRow}>
                {['Toilet', 'Musholla', 'Parkiran', 'Wifi', 'Kantin'].map(f => (
                  <TouchableOpacity 
                    key={f} 
                    style={[styles.facChip, editData?.facilities.includes(f) && styles.facChipActive]} 
                    onPress={() => toggleFacility(f)}
                  >
                    <Text style={[styles.facChipText, editData?.facilities.includes(f) && {color: '#fff'}]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.btnSave} 
                onPress={() => { 
                  setPools(pools.map(p => p.id === editData.id ? editData : p)); 
                  setEditVisible(false); 
                  Alert.alert("Berhasil", "Data properti telah diperbarui.");
                }}
              >
                <Text style={styles.btnSaveText}>Simpan Perubahan</Text>
              </TouchableOpacity>
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showPicker && (
        <DateTimePicker value={new Date()} mode="time" is24Hour={true} onChange={(e, d) => {
          setShowPicker(null);
          if(d) {
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            setEditData({ ...editData, [showPicker === 'open' ? 'openTime' : 'closeTime']: timeStr });
          }
        }} />
      )}
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
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginqTop: 10 },
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
  table: { minWidth: 350 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E1', paddingBottom: 5 },
  hCell: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  rCell: { fontSize: 11, color: '#1E293B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.85 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A63' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#F9F9F9', justifyContent: 'center' },
  photoUploadContainer: { height: 160, marginBottom: 10, borderRadius: 12, overflow: 'hidden' },
  photoUploadImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  photoOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, alignItems: 'center' },
  photoText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  row: { flexDirection: 'row' },
  facRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  facChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#DDD' },
  facChipActive: { backgroundColor: '#102A63', borderColor: '#102A63' },
  facChipText: { fontSize: 12, color: '#666' },
  btnSave: { backgroundColor: '#102A63', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  btnSaveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  unitContainer: { 
  flexDirection: 'row', 
  backgroundColor: '#F1F5F9', 
  borderRadius: 10, 
  padding: 4, 
  marginTop: 0,
  borderWidth: 1,
  borderColor: '#DDD',
  height: 48, // Samain sama tinggi input biar sejajar
  alignItems: 'center'
},
uBtn: { 
  flex: 1, 
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center', 
  borderRadius: 8 
},
uActive: { 
  backgroundColor: '#102A63' 
},
});