import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  Image, Alert, Dimensions, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// Interface untuk Item Tambahan agar rapi
interface ExtraItem {
  id: string;
  name: string;
  price: string;
  unit: 'Pcs' | 'Unit' | 'Jam';
  type: 'Peralatan' | 'Umpan';
  image: string | null;
}

export default function TambahKolam() {
  const router = useRouter();

  // --- STATE PROPERTI UTAMA ---
  const [namaTempat, setNamaTempat] = useState('');
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [harga, setHarga] = useState('');
  const [satuan, setSatuan] = useState('Jam');
  const [alamat, setAlamat] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jamBuka, setJamBuka] = useState('08:00');
  const [jamTutup, setJamTutup] = useState('20:00');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState<'open' | 'close' | null>(null);

  // --- STATE ITEM TAMBAHAN ---
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);

  // Fungsi Ambil Foto (Main atau Item)
  const pickImage = async (itemId: string | 'main') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      if (itemId === 'main') {
        setMainPhoto(result.assets[0].uri);
      } else {
        setExtraItems(extraItems.map(item => 
          item.id === itemId ? { ...item, image: result.assets[0].uri } : item
        ));
      }
    }
  };

  // Fungsi Tambah Row Item Baru
  const addNewItem = () => {
    const newItem: ExtraItem = {
      id: Math.random().toString(),
      name: '',
      price: '',
      unit: 'Pcs',
      type: 'Peralatan',
      image: null
    };
    setExtraItems([...extraItems, newItem]);
  };

  const toggleFacility = (f: string) => {
    setFacilities(facilities.includes(f) ? facilities.filter(x => x !== f) : [...facilities, f]);
  };

// TambahKolam.tsx - Update Fungsi handleSimpan

const handleSimpan = async () => {
  if (!namaTempat || !harga || !mainPhoto) {
    Alert.alert("Error", "Nama, Harga, dan Foto Utama wajib diisi!");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();

    // 1. DATA UTAMA (Sesuai req.body di Controller)
    // Ambil id_mitra dari storage/context kamu (contoh: '1')
    formData.append('id_mitra', '1'); 
    formData.append('title', namaTempat);
    formData.append('location', alamat);
    formData.append('base_price', harga.replace(/[^0-9]/g, '')); // Bersihkan titik
    formData.append('price_unit', satuan);
    formData.append('description', deskripsi);
    formData.append('jam_buka', jamBuka);
    formData.append('jam_tutup', jamTutup);

    // 2. FOTO UTAMA (Key harus 'image_url' sesuai controller)
    const mainUri = Platform.OS === 'ios' ? mainPhoto.replace('file://', '') : mainPhoto;
    formData.append('image_url', {
      uri: mainUri,
      name: 'main_place.jpg',
      type: 'image/jpeg',
    } as any);

    // 3. FASILITAS (Kirim Array ID sebagai JSON string)
    // NOTE: Sesuaikan mapping ID ini dengan tabel `fasilitas` di DB kamu
    const facilityMapping: { [key: string]: number } = {
      'Toilet': 1,
      'Musholla': 2,
      'Parkiran': 3,
      'Kantin': 4,
      'Wifi': 5
    };
    const selectedFacilityIds = facilities.map(f => facilityMapping[f]);
    formData.append('fasilitas', JSON.stringify(selectedFacilityIds));

    // 4. ITEM SEWA (Format: items[i][field])
    extraItems.forEach((item, index) => {
      formData.append(`items[${index}][nama_item]`, item.name);
      formData.append(`items[${index}][price]`, item.price.replace(/[^0-9]/g, ''));
      formData.append(`items[${index}][price_unit]`, item.unit);
      
      // Jika ada gambar per item (karena controller kamu mendukung item[i][image_url])
      if (item.image) {
        formData.append(`items[${index}][image_url]`, {
          uri: item.image,
          name: `item_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      }
    });

    console.log("🚀 Mengirim Data...");

    const response = await axios.post('http://ALAMAT_IP_BACKEND:3000/api/places', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
    });

    if (response.data.success) {
      Alert.alert("Berhasil", "Properti Kolam Berhasil Diterbitkan!");
      router.back();
    }
  } catch (error: any) {
    console.error("❌ Error Detail:", error.response?.data || error.message);
    Alert.alert("Gagal", error.response?.data?.message || "Terjadi kesalahan koneksi");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
      <Stack.Screen options={{ headerTitle: "Tambah Properti Baru", headerTintColor: '#102A63' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION 1: NAMA & FOTO */}
        <View style={styles.section}>
          <Text style={styles.label}>Nama Tempat / Kolam</Text>
          <TextInput style={styles.input} placeholder="Contoh: Pemancingan Galatama Jaya" value={namaTempat} onChangeText={setNamaTempat} />
          
          <Text style={styles.label}>Foto Utama Lokasi</Text>
          <TouchableOpacity style={styles.mainUpload} onPress={() => pickImage('main')}>
            {mainPhoto ? (
              <Image source={{ uri: mainPhoto }} style={styles.previewMain} />
            ) : (
              <View style={{alignItems:'center'}}>
                <Ionicons name="camera" size={40} color="#CBD5E1" />
                <Text style={styles.uploadText}>Klik untuk upload foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SECTION 2: HARGA & ALAMAT */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Harga Sewa (Rp)</Text>
              <TextInput style={styles.input} placeholder="Contoh: 50000" keyboardType="numeric" value={harga} onChangeText={setHarga} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Satuan</Text>
              <View style={styles.toggleRow}>
                {['Jam', 'Hari'].map(u => (
                  <TouchableOpacity key={u} style={[styles.toggleBtn, satuan === u && styles.toggleActive]} onPress={() => setSatuan(u)}>
                    <Text style={[styles.toggleText, satuan === u && {color:'#fff'}]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.label}>Alamat Lengkap</Text>
          <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Jl. Raya Pemancingan No. 123..." value={alamat} onChangeText={setAlamat} />
        </View>

        {/* SECTION 3: DETAIL LAINNYA */}
        <View style={styles.section}>
          <Text style={styles.label}>Deskripsi Tempat</Text>
          <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Ceritakan keunggulan kolam lu..." value={deskripsi} onChangeText={setDeskripsi} />

          <View style={styles.row}>
            <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => setShowPicker('open')}>
              <Text style={styles.label}>Jam Buka</Text>
              <View style={styles.input}><Text>{jamBuka}</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowPicker('close')}>
              <Text style={styles.label}>Jam Tutup</Text>
              <View style={styles.input}><Text>{jamTutup}</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: FASILITAS */}
        <View style={styles.section}>
          <Text style={styles.label}>Fasilitas (Pilih yang tersedia)</Text>
          <View style={styles.facRow}>
            {['Toilet', 'Musholla', 'Parkiran', 'Kantin', 'Wifi'].map(f => (
              <TouchableOpacity key={f} style={[styles.facChip, facilities.includes(f) && styles.facChipActive]} onPress={() => toggleFacility(f)}>
                <Ionicons name={facilities.includes(f) ? "checkbox" : "square-outline"} size={16} color={facilities.includes(f) ? "#fff" : "#64748B"} />
                <Text style={[styles.facText, facilities.includes(f) && {color:'#fff'}]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTION 5: ITEM TAMBAHAN (DYNAMICS) */}
        <View style={styles.section}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15}}>
            <Text style={styles.sectionTitle}>Item Tambahan</Text>
            <TouchableOpacity style={styles.btnAddItem} onPress={addNewItem}>
              <Text style={styles.btnAddItemText}>+ Tambah Item</Text>
            </TouchableOpacity>
          </View>

          {extraItems.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.itemPhotoBox} onPress={() => pickImage(item.id)}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                  ) : (
                    <Ionicons name="camera" size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <TextInput 
                    style={styles.inputSmall} 
                    placeholder="Nama Item (cth: Joran)" 
                    onChangeText={(v) => {
                      const newItems = [...extraItems];
                      newItems[index].name = v;
                      setExtraItems(newItems);
                    }} 
                  />
                  <TextInput 
                    style={styles.inputSmall} 
                    placeholder="Harga" 
                    keyboardType="numeric"
                    onChangeText={(v) => {
                      const newItems = [...extraItems];
                      newItems[index].price = v;
                      setExtraItems(newItems);
                    }} 
                  />
                </View>
                <TouchableOpacity onPress={() => setExtraItems(extraItems.filter(i => i.id !== item.id))}>
                  <Ionicons name="trash" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View style={[styles.row, {marginTop: 10, gap: 10}]}>
                {/* Tipe Item */}
                <View style={{flex: 1}}>
                  <Text style={styles.labelSmall}>Tipe</Text>
                  <View style={styles.miniToggle}>
                    {['Peralatan', 'Umpan'].map(t => (
                      <TouchableOpacity 
                        key={t} 
                        style={[styles.miniBtn, item.type === t && styles.miniActive]}
                        onPress={() => {
                          const newItems = [...extraItems];
                          newItems[index].type = t as any;
                          setExtraItems(newItems);
                        }}
                      >
                        <Text style={[styles.miniText, item.type === t && {color:'#fff'}]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Satuan Item */}
                <View style={{flex: 1}}>
                  <Text style={styles.labelSmall}>Satuan</Text>
                  <View style={styles.miniToggle}>
                    {['Pcs', 'Unit', 'Jam'].map(s => (
                      <TouchableOpacity 
                        key={s} 
                        style={[styles.miniBtn, item.unit === s && styles.miniActive]}
                        onPress={() => {
                          const newItems = [...extraItems];
                          newItems[index].unit = s as any;
                          setExtraItems(newItems);
                        }}
                      >
                        <Text style={[styles.miniText, item.unit === s && {color:'#fff'}]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan}>
          <Text style={styles.btnSimpanText}>Terbitkan Properti Kolam</Text>
        </TouchableOpacity>

        <View style={{height: 50}} />
      </ScrollView>

      {/* TIME PICKER MODAL */}
      {showPicker && (
        <DateTimePicker 
          value={new Date()} 
          mode="time" 
          is24Hour={true} 
          onChange={(e, d) => {
            setShowPicker(null);
            if(d) {
              const s = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              showPicker === 'open' ? setJamBuka(s) : setJamTutup(s);
            }
          }} 
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, backgroundColor: '#F8FAFC' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#102A63' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8, marginTop: 10 },
  labelSmall: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, backgroundColor: '#F8FAFC', fontSize: 14 },
  inputSmall: { borderBottomWidth: 1, borderColor: '#E2E8F0', padding: 4, fontSize: 13, marginBottom: 8 },
  mainUpload: { height: 160, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', marginTop: 5 },
  previewMain: { width: '100%', height: '100%', borderRadius: 10 },
  uploadText: { fontSize: 12, color: '#94A3B8', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4, height: 48 },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#102A63' },
  toggleText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  facRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  facChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 6 },
  facChipActive: { backgroundColor: '#102A63', borderColor: '#102A63' },
  facText: { fontSize: 12, color: '#64748B' },
  btnAddItem: { backgroundColor: '#EFF6FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#102A63' },
  btnAddItemText: { color: '#102A63', fontSize: 12, fontWeight: 'bold' },
  itemCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  itemPhotoBox: { width: 60, height: 60, backgroundColor: '#E2E8F0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  miniToggle: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 8, padding: 2 },
  miniBtn: { flex: 1, paddingVertical: 4, alignItems: 'center', borderRadius: 6 },
  miniActive: { backgroundColor: '#102A63' },
  miniText: { fontSize: 10, color: '#64748B', fontWeight: 'bold' },
  btnSimpan: { backgroundColor: '#102A63', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 4 },
  btnSimpanText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});