import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Interface untuk Item Tambahan
interface ExtraItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  type: 'Peralatan' | 'Umpan';
}

export default function TambahKolam() {
  const router = useRouter();

  // --- STATE FORM ---
  const [namaTempat, setNamaTempat] = useState('');
  const [harga, setHarga] = useState('');
  const [satuan, setSatuan] = useState('Jam');
  const [alamat, setAlamat] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jamBuka, setJamBuka] = useState('');
  const [jamTutup, setJamTutup] = useState('');
  
  // State Fasilitas (Multiple Check)
  const [facilities, setFacilities] = useState<string[]>([]);
  
  // State Item Tambahan (Dynamic)
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);

  // Fungsi Toggle Fasilitas
  const toggleFacility = (item: string) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter(f => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  // Fungsi Tambah Form Item Baru
  const addNewItem = () => {
    const newItem: ExtraItem = {
      id: Math.random().toString(),
      name: '',
      price: '',
      unit: '',
      type: 'Peralatan'
    };
    setExtraItems([...extraItems, newItem]);
  };

  // Fungsi Update Data Item Spesifik
  const updateExtraItem = (id: string, field: keyof ExtraItem, value: string) => {
    const updated = extraItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setExtraItems(updated);
  };

  const handleSimpan = () => {
    Alert.alert("Berhasil", "Data kolam baru telah ditambahkan ke daftar Anda.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerTitle: "Tambah Kolam Baru",
        headerTintColor: '#102A63',
        headerShadowVisible: false 
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Informasi Properti</Text>

          {/* INPUT NAMA */}
          <Text style={styles.label}>Nama Tempat / Kolam</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Contoh: Kolam Ikan Mas Premium" 
            value={namaTempat}
            onChangeText={setNamaTempat}
          />

          {/* UPLOAD FOTO */}
          <Text style={styles.label}>Foto Lokasi Utama</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="camera" size={32} color="#CBD5E1" />
            <Text style={styles.uploadText}>Klik untuk upload foto</Text>
          </TouchableOpacity>

          {/* HARGA & SATUAN */}
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Harga</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Rp 0" 
                keyboardType="numeric"
                value={harga}
                onChangeText={setHarga}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Satuan</Text>
              <View style={styles.pickerFake}>
                <Text style={{fontSize: 14}}>{satuan}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </View>
            </View>
          </View>

          {/* ALAMAT & DESKRIPSI */}
          <Text style={styles.label}>Alamat Lengkap</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline 
            placeholder="Jl. Raya Pemancingan No. 1..." 
            onChangeText={setAlamat}
          />

          <Text style={styles.label}>Deskripsi Tempat</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline 
            placeholder="Ceritakan keunggulan kolam Anda..." 
            onChangeText={setDeskripsi}
          />

          {/* JAM OPERASIONAL */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Jam Buka</Text>
              <TextInput style={styles.input} placeholder="08:00" onChangeText={setJamBuka} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Jam Tutup</Text>
              <TextInput style={styles.input} placeholder="20:00" onChangeText={setJamTutup} />
            </View>
          </View>

          {/* FASILITAS (Multiple Check) */}
          <Text style={[styles.label, {marginTop: 20}]}>Fasilitas</Text>
          <View style={styles.facilityContainer}>
            {['Toilet', 'Musholla', 'Parkiran'].map((f) => (
              <TouchableOpacity 
                key={f} 
                style={[styles.checkBtn, facilities.includes(f) && styles.checkBtnActive]}
                onPress={() => toggleFacility(f)}
              >
                <Ionicons 
                  name={facilities.includes(f) ? "checkbox" : "square-outline"} 
                  size={18} 
                  color={facilities.includes(f) ? "#102A63" : "#64748B"} 
                />
                <Text style={[styles.checkText, facilities.includes(f) && styles.checkTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* DYNAMIC ITEMS (Peralatan/Umpan) */}
          <Text style={styles.sectionSubTitle}>Item Tambahan (Sewa/Beli)</Text>
          
          {extraItems.map((item, index) => (
            <View key={item.id} style={styles.extraItemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Item #{index + 1}</Text>
                <TouchableOpacity onPress={() => setExtraItems(extraItems.filter(i => i.id !== item.id))}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <TextInput 
                style={styles.inputSmall} 
                placeholder="Nama Item (ex: Joran Melengkung)" 
                onChangeText={(v) => updateExtraItem(item.id, 'name', v)}
              />
              
              <View style={styles.row}>
                <TextInput 
                  style={[styles.inputSmall, {flex: 1, marginRight: 5}]} 
                  placeholder="Harga" 
                  keyboardType="numeric"
                  onChangeText={(v) => updateExtraItem(item.id, 'price', v)}
                />
                <TextInput 
                  style={[styles.inputSmall, {flex: 1}]} 
                  placeholder="Unit (per jam/pcs)" 
                  onChangeText={(v) => updateExtraItem(item.id, 'unit', v)}
                />
              </View>

              <View style={styles.typeRow}>
                <TouchableOpacity 
                  style={[styles.typeBtn, item.type === 'Peralatan' && styles.typeBtnActive]}
                  onPress={() => updateExtraItem(item.id, 'type', 'Peralatan')}
                >
                  <Text style={[styles.typeBtnText, item.type === 'Peralatan' && styles.typeBtnTextActive]}>Peralatan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.typeBtn, item.type === 'Umpan' && styles.typeBtnActive]}
                  onPress={() => updateExtraItem(item.id, 'type', 'Umpan')}
                >
                  <Text style={[styles.typeBtnText, item.type === 'Umpan' && styles.typeBtnTextActive]}>Umpan</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.btnAddItem} onPress={addNewItem}>
            <Ionicons name="add-circle-outline" size={20} color="#102A63" />
            <Text style={styles.btnAddItemText}>Tambah Item Peralatan/Umpan</Text>
          </TouchableOpacity>

          {/* TOMBOL SIMPAN */}
          <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan}>
            <Text style={styles.btnSimpanText}>Simpan & Terbitkan Kolam</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scrollContent: { padding: 16 },
  formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#102A63', marginBottom: 20, textAlign: 'center' },
  sectionSubTitle: { fontSize: 16, fontWeight: 'bold', color: '#102A63', marginBottom: 15 },
  
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 15, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, backgroundColor: '#F8FAFC', fontSize: 14 },
  inputSmall: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, backgroundColor: '#FFF', fontSize: 13, marginBottom: 8 },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  uploadBox: { height: 140, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', marginTop: 5 },
  uploadText: { marginTop: 8, fontSize: 12, color: '#94A3B8' },

  row: { flexDirection: 'row' },
  pickerFake: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, backgroundColor: '#F8FAFC' },

  facilityContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  checkBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#FFF' },
  checkBtnActive: { borderColor: '#102A63', backgroundColor: '#EFF6FF' },
  checkText: { marginLeft: 6, fontSize: 13, color: '#64748B' },
  checkTextActive: { color: '#102A63', fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 25 },

  // STYLE ITEM DINAMIS
  extraItemCard: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemNumber: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  typeRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  typeBtn: { flex: 1, padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#102A63', borderColor: '#102A63' },
  typeBtnText: { fontSize: 11, color: '#64748B' },
  typeBtnTextActive: { color: '#FFF', fontWeight: 'bold' },

  btnAddItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderSize: 1, borderColor: '#102A63', borderStyle: 'dashed', borderRadius: 10, marginTop: 10 },
  btnAddItemText: { marginLeft: 8, color: '#102A63', fontWeight: 'bold', fontSize: 13 },

  btnSimpan: { backgroundColor: '#102A63', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, elevation: 3 },
  btnSimpanText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});