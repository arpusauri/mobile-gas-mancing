import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, 
  TextInput, Dimensions, LayoutAnimation, Platform, UIManager, Alert, Modal,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, API_URL } from '../../api/config';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Type Definitions
interface Order {
  id: string;
  orderId: number;
  customer: string;
  contact: string;
  date: string;
  status: string;
  total: number;
}

interface Pool {
  id: string;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  price: string;
  unit: string;
  description: string;
  openTime: string;
  closeTime: string;
  facilities: string[];
  image: string;
  orders: Order[];
}

export default function MitraDashboard() {
  const router = useRouter();
  const [pools, setPools] = useState<Pool[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isEditVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<Pool | null>(null);
  const [showPicker, setShowPicker] = useState<'open' | 'close' | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mitraId, setMitraId] = useState<number | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    loadMitraData();
  }, []);

  const loadMitraData = async () => {
    try {
      console.log("🔵 Loading mitra data...");
      
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log("Token:", token ? "✅ Found" : "❌ Not found");
      console.log("UserData:", userData ? "✅ Found" : "❌ Not found");
      
      if (!token || !userData) {
        console.error("❌ No token or userData, redirecting to login...");
        Alert.alert('Error', 'Sesi login habis, silakan login kembali');
        router.replace('/Signin');
        return;
      }

      const user = JSON.parse(userData);
      console.log("User parsed:", user);
      
      const mitraIdFromUser = user.id_mitra;
      console.log("Mitra ID:", mitraIdFromUser);
      
      if (!mitraIdFromUser) {
        console.error("❌ No mitra ID found in user data");
        Alert.alert('Error', 'ID Mitra tidak ditemukan. Silakan login ulang.');
        router.replace('/Signin');
        return;
      }
      
      setMitraId(mitraIdFromUser);
      setUserToken(token);

      console.log("🔵 Fetching properties for mitra:", mitraIdFromUser);
      await fetchMitraProperties(mitraIdFromUser, token);
    } catch (error) {
      console.error('❌ Error loading mitra data:', error);
      Alert.alert('Error', 'Gagal memuat data. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const fetchMitraProperties = async (id: number, token: string) => {
    setLoading(true);
    try {
      console.log("🔵 Fetching places for mitra ID:", id);
      
      const places = await api.places.getByMitraId(id, token);
      console.log("✅ Places fetched:", places);
      
      const poolsWithOrders = await Promise.all(
        places.map(async (place: any) => {
          try {
            console.log("🔵 Fetching orders for place:", place.title);
            const orders = await api.mitra.getPropertyBookings(id, token);
            
            const placeOrders = orders.filter((order: any) => 
              order.nama_tempat === place.title
            );

            console.log(`✅ Orders for ${place.title}:`, placeOrders.length);

            // Construct proper image URL
            let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
            if (place.image_url && place.image_url !== 'default_place.jpg') {
              // Jika sudah full URL (http/https), pakai langsung
              if (place.image_url.startsWith('http')) {
                imageUrl = place.image_url;
              } else {
                // Jika filename saja, construct full URL dengan API_URL
                imageUrl = `${API_URL}/uploads/${place.image_url}`;
              }
            }

            return {
              id: place.id_tempat.toString(),
              name: place.title || 'Tanpa Nama',
              location: place.location || '-',
              rating: place.average_rating ? parseFloat(place.average_rating).toFixed(1) : '0.0',
              reviews: place.total_reviews_count ? place.total_reviews_count.toString() : '0',
              price: parseFloat(place.base_price || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              unit: (place.price_unit || 'jam').toLowerCase(),
              description: place.full_description || place.description || '',
              openTime: extractTime(place.description, 'open') || '08:00',
              closeTime: extractTime(place.description, 'close') || '20:00',
              facilities: place.fasilitas || [], // Sudah array of strings dari backend
              image: imageUrl,
              orders: placeOrders.map((order: any) => ({
                id: order.nomor_pesanan,
                orderId: order.id_pesanan,
                customer: order.nama_pemesan,
                contact: order.kontak_pemesan,
                date: formatDate(order.tgl_mulai_sewa),
                status: order.status_pesanan,
                total: parseFloat(order.total_biaya || 0),
              }))
            };
          } catch (err) {
            console.error('Error fetching orders for place:', place.id_tempat, err);
            
            // Construct image URL untuk error case juga
            let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
            if (place.image_url && place.image_url !== 'default_place.jpg') {
              if (place.image_url.startsWith('http')) {
                imageUrl = place.image_url;
              } else {
                imageUrl = `${API_URL}/uploads/${place.image_url}`;
              }
            }
            
            return {
              id: place.id_tempat.toString(),
              name: place.title || 'Tanpa Nama',
              location: place.location || '-',
              rating: place.average_rating ? parseFloat(place.average_rating).toFixed(1) : '0.0',
              reviews: place.total_reviews_count ? place.total_reviews_count.toString() : '0',
              price: parseFloat(place.base_price || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              unit: (place.price_unit || 'jam').toLowerCase(),
              description: place.full_description || place.description || '',
              openTime: '08:00',
              closeTime: '20:00',
              facilities: place.fasilitas || [],
              image: imageUrl,
              orders: []
            };
          }
        })
      );

      console.log("✅ Total pools processed:", poolsWithOrders.length);
      setPools(poolsWithOrders);
    } catch (error: any) {
      console.error('❌ Error fetching properties:', error);
      Alert.alert('Error', error.message || 'Gagal memuat properti');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const extractTime = (desc: string, type: 'open' | 'close') => {
    const match = desc?.match(/Buka:\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (match) {
      return type === 'open' ? match[1] : match[2];
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (mitraId && userToken) {
      await fetchMitraProperties(mitraId, userToken);
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const openEditModal = (pool: any) => {
    setEditData({ ...pool });
    setEditVisible(true);
  };

  const handleUpdatePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      aspect: [16, 9], 
      quality: 0.7 
    });
    if (!result.canceled) {
      setEditData({ ...editData, image: result.assets[0].uri });
    }
  };

  const toggleFacility = (fac: string) => {
    if (!editData) return;
    
    const current = editData.facilities || [];
    setEditData({ 
      ...editData, 
      facilities: current.includes(fac) 
        ? current.filter((f: string) => f !== fac) 
        : [...current, fac] 
    });
  };

  const handleSaveEdit = async () => {
    if (!editData || !mitraId || !userToken) return;
    
    try {
      setLoading(true);
      
      const safeDescription = editData.description || '';
      
      // 1. GUNAKAN FORMDATA
      const formData = new FormData();

      // 2. Masukkan data (Key harus sama dengan yang diminta Backend)
      formData.append('title', editData.name); 
      formData.append('location', editData.location);
      
      // Bersihkan format harga (hapus titik)
      const cleanPrice = editData.price.replace(/\./g, '');
      formData.append('base_price', cleanPrice);
      
      // Format unit
      const cleanUnit = editData.unit.charAt(0).toUpperCase() + editData.unit.slice(1);
      formData.append('price_unit', cleanUnit);
      
      // Deskripsi
      const finalDesc = `Buka: ${editData.openTime} - ${editData.closeTime}. ${safeDescription}`;
      formData.append('description', finalDesc);
      
      // Fasilitas
      if (editData.facilities) {
         formData.append('fasilitas', JSON.stringify(editData.facilities));
      }
      
      formData.append('open_time', editData.openTime || '08:00');
      formData.append('close_time', editData.closeTime || '20:00');

      // 3. LOGIKA UPLOAD GAMBAR
      // Hanya kirim jika gambar adalah file lokal (bukan http)
      if (editData.image && !editData.image.startsWith('http')) {
        const localUri = editData.image;
        const filename = localUri.split('/').pop();
        
        // Tebak tipe file
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
          uri: localUri,
          name: filename || 'update.jpg',
          type: type,
        } as any);
      }

      console.log('📤 Sending FormData Update...');

      // 4. Panggil API
      await api.places.update(parseInt(editData.id), formData, userToken);
      
      // 5. Refresh Data
      await fetchMitraProperties(mitraId, userToken);
      
      setEditVisible(false);
      Alert.alert('Berhasil', 'Data properti telah diperbarui.');

    } catch (error: any) {
      console.error('Error updating property:', error);
      Alert.alert('Error', error.message || 'Gagal memperbarui properti');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.mitra.updateBookingStatus(orderId, newStatus, userToken!);
      await fetchMitraProperties(mitraId!, userToken!);
      Alert.alert('Berhasil', `Status pesanan diubah menjadi ${newStatus}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mengubah status pesanan');
    }
  };

  const handleCancelOrder = (poolId: string, orderId: number, orderCode: string) => {
    Alert.alert(
      "Konfirmasi", 
      `Batalkan pesanan ${orderCode}?`, 
      [
        { text: "Batal" },
        { 
          text: "Ya, Hapus", 
          style: 'destructive', 
          onPress: async () => {
            try {
              await api.mitra.deleteBooking(orderId, userToken!);
              setPools(pools.map((p: Pool) => 
                p.id === poolId 
                  ? { ...p, orders: p.orders.filter((o: Order) => o.orderId !== orderId) } 
                  : p
              ));
              Alert.alert('Berhasil', 'Pesanan telah dibatalkan');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Gagal membatalkan pesanan');
            }
          }
        }
      ]
    );
  };

  const handleDeleteProperty = (poolId: string, poolName: string) => {
    Alert.alert(
      "Hapus Properti",
      `Yakin ingin menghapus "${poolName}"?`,
      [
        { text: "Batal" },
        {
          text: "Hapus",
          style: 'destructive',
          onPress: async () => {
            try {
              await api.places.delete(parseInt(poolId), userToken!);
              await fetchMitraProperties(mitraId!, userToken!);
              Alert.alert('Berhasil', 'Properti telah dihapus');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Gagal menghapus properti');
            }
          }
        }
      ]
    );
  };

  if (loading && pools.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#102A63" />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.mainTitle}>Dashboard Mitra</Text>
        
        {/* Header dengan statistik singkat */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="business" size={24} color="#102A63" />
            <Text style={styles.statNumber}>{pools.length}</Text>
            <Text style={styles.statLabel}>Properti</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="receipt" size={24} color="#102A63" />
            <Text style={styles.statNumber}>
              {pools.reduce((acc, p) => acc + p.orders.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Pesanan</Text>
          </View>
        </View>

        {pools.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="fish-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada properti</Text>
            <Text style={styles.emptySubtext}>Klik tab "Tambah Kolam" untuk menambahkan properti pertama Anda</Text>
          </View>
        ) : (
          pools.map((item: Pool) => (
            <View key={item.id} style={styles.cardWrapper}>
              <ImageBackground 
                source={{ uri: item.image }} 
                style={styles.poolCardBase} 
                imageStyle={{ borderRadius: 25 }}
              >
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
                      <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
                    </View>
                  </View>

                  <View style={styles.bottomRow}>
                    <View style={[styles.facilityRow, { flex: 1, flexWrap: 'wrap', alignSelf: 'flex-end' }]}>
                      {item.facilities.map((fac: string, idx: number) => (
                        <View key={idx} style={styles.facilityBadge}>
                          <Text style={styles.facilityText}>{fac}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={[styles.actionGroup, { width: 130, alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>Rp {item.price}/{item.unit}</Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={styles.btnEdit} onPress={() => openEditModal(item)}>
                          <Ionicons name="pencil" size={16} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.btnDelete} 
                          onPress={() => handleDeleteProperty(item.id, item.name)}
                        >
                          <Ionicons name="trash" size={16} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnExpand} onPress={() => toggleExpand(item.id)}>
                          <Ionicons 
                            name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color="#fff" 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>

              {expandedId === item.id && (
                <View style={styles.orderContainer}>
                  <Text style={styles.orderTitle}>Pesanan Masuk ({item.orders.length})</Text>
                  {item.orders.length === 0 ? (
                    <Text style={styles.noOrderText}>Belum ada pesanan</Text>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.table}>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.hCell, { width: 80 }]}>KODE</Text>
                          <Text style={[styles.hCell, { width: 100 }]}>PEMESAN</Text>
                          <Text style={[styles.hCell, { width: 85 }]}>TGL SEWA</Text>
                          <Text style={[styles.hCell, { width: 85 }]}>TOTAL</Text>
                          <Text style={[styles.hCell, { width: 90 }]}>STATUS</Text>
                          <Text style={[styles.hCell, { width: 70 }]}>AKSI</Text>
                        </View>
                        {item.orders.map((order: Order) => (
                          <View key={order.orderId} style={styles.tableRow}>
                            <Text style={[styles.rCell, { width: 80 }]}>{order.id}</Text>
                            <Text style={[styles.rCell, { width: 100 }]}>{order.customer}</Text>
                            <Text style={[styles.rCell, { width: 85 }]}>{order.date}</Text>
                            <Text style={[styles.rCell, { width: 85 }]}>Rp {order.total.toLocaleString('id-ID')}</Text>
                            <TouchableOpacity 
                              style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(order.status) }
                              ]}
                              onPress={() => {
                                Alert.alert(
                                  'Ubah Status',
                                  'Pilih status baru untuk pesanan ini',
                                  [
                                    { text: 'Batal', style: 'cancel' },
                                    { 
                                      text: 'Lunas', 
                                      onPress: () => handleUpdateOrderStatus(order.orderId, 'Lunas') 
                                    },
                                    { 
                                      text: 'Selesai', 
                                      onPress: () => handleUpdateOrderStatus(order.orderId, 'Selesai') 
                                    },
                                  ]
                                );
                              }}
                            >
                              <Text style={styles.statusText}>{order.status}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => handleCancelOrder(item.id, order.orderId, order.id)} 
                              style={{ width: 70, alignItems: 'center' }}
                            >
                              <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* MODAL EDIT */}
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
              <Text style={styles.label}>Nama Kolam</Text>
              <TextInput 
                style={styles.input} 
                value={editData?.name || ''} 
                onChangeText={(t) => setEditData(editData ? {...editData, name: t} : null)} 
              />

              <Text style={styles.label}>Alamat Lengkap</Text>
              <TextInput 
                style={[styles.input, {height: 60, textAlignVertical: 'top'}]} 
                multiline 
                value={editData?.location || ''} 
                onChangeText={(t) => setEditData(editData ? {...editData, location: t} : null)} 
              />

              <View style={styles.row}>
                <View style={{ flex: 2, marginRight: 10 }}>
                  <Text style={styles.label}>Harga (Rp)</Text>
                  <TextInput 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={editData?.price || ''} 
                    onChangeText={(t) => setEditData(editData ? {...editData, price: t} : null)} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Satuan</Text>
                  <View style={styles.unitContainer}>
                    {['jam', 'hari'].map(u => (
                      <TouchableOpacity 
                        key={u} 
                        onPress={() => setEditData(editData ? {...editData, unit: u} : null)} 
                        style={[styles.uBtn, editData?.unit === u && styles.uActive]}
                      >
                        <Text style={{ 
                          fontSize: 10, 
                          color: editData?.unit === u ? '#fff' : '#000', 
                          textTransform: 'capitalize' 
                        }}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Deskripsi</Text>
              <TextInput 
                style={[styles.input, {height: 70, textAlignVertical: 'top'}]} 
                multiline 
                value={editData?.description || ''} 
                onChangeText={(t) => setEditData(editData ? {...editData, description: t} : null)} 
              />

              <View style={styles.row}>
                <TouchableOpacity style={{flex:1, marginRight:10}} onPress={() => setShowPicker('open')}>
                  <Text style={styles.label}>Buka</Text>
                  <View style={styles.input}><Text>{editData?.openTime || '08:00'}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => setShowPicker('close')}>
                  <Text style={styles.label}>Tutup</Text>
                  <View style={styles.input}><Text>{editData?.closeTime || '20:00'}</Text></View>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Fasilitas</Text>
              <View style={styles.facRow}>
                {['Toilet', 'Musholla', 'Parkiran', 'Wifi', 'Kantin'].map(f => (
                  <TouchableOpacity 
                    key={f} 
                    style={[
                      styles.facChip, 
                      editData?.facilities?.includes(f) && styles.facChipActive
                    ]} 
                    onPress={() => toggleFacility(f)}
                  >
                    <Text style={[
                      styles.facChipText, 
                      editData?.facilities?.includes(f) && {color: '#fff'}
                    ]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.btnSave} 
                onPress={handleSaveEdit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnSaveText}>Simpan Perubahan</Text>
                )}
              </TouchableOpacity>
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showPicker && (
        <DateTimePicker 
          value={new Date()} 
          mode="time" 
          is24Hour={true} 
          onChange={(e, d) => {
            setShowPicker(null);
            if (d && editData) {
              const timeStr = d.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
              });
              setEditData({ 
                ...editData, 
                [showPicker === 'open' ? 'openTime' : 'closeTime']: timeStr 
              });
            }
          }} 
        />
      )}
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Menunggu Pembayaran': return '#F59E0B';
    case 'Lunas': return '#10B981';
    case 'Selesai': return '#6B7280';
    case 'Dibatalkan': return '#EF4444';
    default: return '#9CA3AF';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingTop: 50 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { 
    flex: 1, 
    backgroundColor: '#F0F4F8', 
    borderRadius: 15, 
    padding: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#102A63', marginVertical: 5 },
  statLabel: { fontSize: 12, color: '#666' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#666', marginTop: 15 },
  emptySubtext: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'center', paddingHorizontal: 30 },
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
  btnEdit: { backgroundColor: '#3B82F6', padding: 8, borderRadius: 20, width: 36, alignItems: 'center' },
  btnDelete: { backgroundColor: '#EF4444', padding: 8, borderRadius: 20, width: 36, alignItems: 'center' },
  btnExpand: { backgroundColor: 'rgba(16, 42, 99, 0.7)', padding: 6, borderRadius: 20, width: 40, alignItems: 'center' },
  orderContainer: { backgroundColor: '#F8FAFC', marginTop: -25, paddingTop: 40, padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, zIndex: -1, borderWidth: 1, borderColor: '#E2E8F0' },
  orderTitle: { fontSize: 14, fontWeight: 'bold', color: '#102A63', marginBottom: 10 },
  noOrderText: { fontSize: 12, color: '#999', textAlign: 'center', marginVertical: 20 },
  table: { minWidth: 510 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E1', paddingBottom: 5 },
  hCell: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  rCell: { fontSize: 11, color: '#1E293B' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, width: 90, alignItems: 'center' },
  statusText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.85 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A63' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#F9F9F9', justifyContent: 'center' },
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
    borderWidth: 1,
    borderColor: '#DDD',
    height: 48,
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