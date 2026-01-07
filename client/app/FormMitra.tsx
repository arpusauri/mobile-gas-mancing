import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  Alert, Image, Dimensions, Platform 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { api } from '../api/config'; // Import API config

const { width } = Dimensions.get('window');

export default function FormMitra() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPicker, setShowPicker] = useState<'open' | 'close' | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // STATE DATA FORM
  // ==========================================
  const [formData, setFormData] = useState({
    // Data Properti (Step 1)
    namaProperti: '',
    alamatProperti: '',
    hargaSewa: '',
    satuanSewa: 'Jam',
    jamBuka: '08:00',
    jamTutup: '20:00',
    deskripsi: '',
    fotoProperti: null as { uri: string; name: string; type: string } | null,
    fasilitas: [] as string[],
    items: [] as any[],

    // Data Pemilik (Step 2)
    nama_lengkap: '',
    email: '',
    password_hash: '',
    no_telepon: '',
    alamat: '',
    nama_bank: '',
    no_rekening: '',
    atas_nama_rekening: '',
  });

  // ==========================================
  // FUNGSI-FUNGSI LOGIKA
  // ==========================================

  const pickImage = async (type: 'main' | 'item', itemId?: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });

    if (!result.canceled) {
      if (type === 'main') {
        const uri = result.assets[0].uri;
        const name = uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(name);
        const fileType = match ? `image/${match[1]}` : 'image/jpeg';

        setFormData({ 
          ...formData, 
          fotoProperti: {
            uri,
            name,
            type: fileType
          }
        });
      } else {
        const updatedItems = formData.items.map(item => 
          item.id === itemId ? { ...item, image: result.assets[0].uri } : item
        );
        setFormData({ ...formData, items: updatedItems });
      }
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(null);
    if (selectedDate) {
      const timeString = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (showPicker === 'open') setFormData({ ...formData, jamBuka: timeString });
      else setFormData({ ...formData, jamTutup: timeString });
    }
  };

  const toggleFacility = (facility: string) => {
    const exists = formData.fasilitas.includes(facility);
    setFormData({
      ...formData,
      fasilitas: exists ? formData.fasilitas.filter(f => f !== facility) : [...formData.fasilitas, facility]
    });
  };

  const addItem = () => {
    const newItem = { 
      id: Date.now(), 
      name: '', 
      price: '', 
      unit: 'Pcs', 
      type: 'Peralatan', 
      image: null 
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (id: number) => {
    setFormData({ ...formData, items: formData.items.filter(i => i.id !== id) });
  };

  const updateItem = (id: number, field: string, value: string) => {
    const updatedItems = formData.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  // ==========================================
  // HANDLE SUBMIT FORM → BACKEND
  // ==========================================
  const handleSubmit = async () => {
    // Validasi Data
    if (!formData.nama_lengkap || !formData.email || !formData.password_hash) {
      Alert.alert('Error', 'Data pemilik tidak lengkap!');
      return;
    }
    if (!formData.namaProperti || !formData.hargaSewa) {
      Alert.alert('Error', 'Data properti tidak lengkap!');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      
      // ========================================
      // DATA MITRA (LANGKAH 1 DI BACKEND)
      // ========================================
      data.append('nama_lengkap', formData.nama_lengkap);
      data.append('email', formData.email);
      data.append('password_hash', formData.password_hash);
      data.append('no_telepon', formData.no_telepon);
      data.append('alamat', formData.alamat);
      
      // Data Bank
      data.append('nama_bank', formData.nama_bank);
      data.append('no_rekening', formData.no_rekening);
      data.append('atas_nama_rekening', formData.atas_nama_rekening);

      // ========================================
      // DATA PROPERTI (LANGKAH 2 DI BACKEND)
      // ========================================
      data.append('namaProperti', formData.namaProperti);
      data.append('alamatProperti', formData.alamatProperti);
      data.append('hargaSewa', formData.hargaSewa);
      data.append('satuanSewa', formData.satuanSewa);
      data.append('jamBuka', formData.jamBuka);
      data.append('jamTutup', formData.jamTutup);
      data.append('deskripsi', formData.deskripsi);

      // Fasilitas & Items (Kirim sebagai JSON String)
      data.append('fasilitas', JSON.stringify(formData.fasilitas));
      data.append('items', JSON.stringify(formData.items));

      // Foto Properti (PENTING: Field 'fotoProperti' sesuai multer backend)
      if (formData.fotoProperti) {
        data.append('fotoProperti', {
          uri: Platform.OS === 'android' ? formData.fotoProperti.uri : formData.fotoProperti.uri.replace('file://', ''),
          name: formData.fotoProperti.name,
          type: formData.fotoProperti.type,
        } as any);
      }

      // ========================================
      // KIRIM KE BACKEND PAKAI API CONFIG
      // ========================================
      const result = await api.mitra.register(data);

      // Simpan token ke AsyncStorage
      await AsyncStorage.setItem('userToken', result.token);
      await AsyncStorage.setItem('userRole', 'mitra');
      await AsyncStorage.setItem('userData', JSON.stringify(result.mitra));

      Alert.alert('Berhasil!', 'Pendaftaran mitra berhasil!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(mitra)'),
        },
      ]);

    } catch (error: any) {
      console.error('❌ Error Submit:', error);
      Alert.alert('Gagal', error.message || 'Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER CONTENT PER STEP
  // ==========================================

  const renderStep1 = () => (
    <View>
      <Text style={styles.formTitle}>Informasi Properti</Text>
      
      <Text style={styles.label}>Nama Pemancingan</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Contoh: Pemancingan Telaga Biru" 
        value={formData.namaProperti}
        onChangeText={(v) => setFormData({...formData, namaProperti: v})} 
      />

      <Text style={styles.label}>Foto Lokasi Utama</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage('main')}>
        {formData.fotoProperti ? (
          <Image source={{ uri: formData.fotoProperti.uri }} style={styles.previewImage} />
        ) : (
          <>
            <Ionicons name="camera" size={30} color="#666" />
            <Text style={styles.uploadText}>Klik upload foto galeri</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput 
        style={[styles.input, {height: 80}]} 
        multiline 
        placeholder="Gambarkan keunggulan tempat Anda" 
        value={formData.deskripsi}
        onChangeText={(v) => setFormData({...formData, deskripsi: v})}
      />

      <Text style={styles.label}>Alamat Properti</Text>
      <TextInput 
        style={[styles.input, {height: 60}]} 
        multiline 
        placeholder="Alamat lengkap lokasi" 
        value={formData.alamatProperti}
        onChangeText={(v) => setFormData({...formData, alamatProperti: v})}
      />

      <View style={styles.row}>
        <TouchableOpacity style={{flex: 1, marginRight: 10}} onPress={() => setShowPicker('open')}>
          <Text style={styles.label}>Buka</Text>
          <View style={styles.input}><Text>{formData.jamBuka}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => setShowPicker('close')}>
          <Text style={styles.label}>Tutup</Text>
          <View style={styles.input}><Text>{formData.jamTutup}</Text></View>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Harga</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Rp" 
            keyboardType="numeric" 
            value={formData.hargaSewa}
            onChangeText={(v) => setFormData({...formData, hargaSewa: v})}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
           <View style={styles.rowUnit}>
              {['Jam', 'Hari'].map(u => (
                <TouchableOpacity 
                  key={u} 
                  style={[styles.unitBtn, formData.satuanSewa === u && styles.unitActive]}
                  onPress={() => setFormData({...formData, satuanSewa: u})}
                >
                  <Text style={{fontSize: 12, color: formData.satuanSewa === u ? '#fff' : '#666'}}>{u}</Text>
                </TouchableOpacity>
              ))}
           </View>
        </View>
      </View>

      <Text style={styles.label}>Fasilitas</Text>
      <View style={styles.facilityRow}>
        {['Toilet', 'Musholla', 'Parkiran', 'Kantin', 'Wifi'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.checkItem, formData.fasilitas.includes(f) && styles.checkActive]}
            onPress={() => toggleFacility(f)}
          >
            <Ionicons 
              name={formData.fasilitas.includes(f) ? "checkbox" : "square-outline"} 
              size={18} 
              color={formData.fasilitas.includes(f) ? "#102A63" : "#666"} 
            />
            <Text style={{marginLeft: 5, fontSize: 12}}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Item Tambahan (Alat/Umpan)</Text>
      {formData.items.map((item, idx) => (
        <View key={item.id} style={styles.extraItemCard}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.miniUpload} onPress={() => pickImage('item', item.id)}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.fullImg} />
              ) : (
                <Ionicons name="camera" size={20} color="#666" />
              )}
            </TouchableOpacity>
            <View style={{flex: 1, marginLeft: 10}}>
              <TextInput 
                placeholder="Nama Item" 
                style={styles.inputSmall} 
                value={item.name}
                onChangeText={(v) => updateItem(item.id, 'name', v)}
              />
              <TextInput 
                placeholder="Harga" 
                keyboardType="numeric" 
                style={styles.inputSmall}
                value={item.price}
                onChangeText={(v) => updateItem(item.id, 'price', v)}
              />
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
        <Text style={styles.addItemText}>+ Tambah Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.formTitle}>Informasi Pemilik & Akun</Text>
      
      <Text style={styles.label}>Nama Lengkap Mitra</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nama sesuai KTP" 
        value={formData.nama_lengkap}
        onChangeText={(v) => setFormData({...formData, nama_lengkap: v})} 
      />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="email@gmail.com" 
        keyboardType="email-address" 
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(v) => setFormData({...formData, email: v})} 
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="******" 
        secureTextEntry 
        value={formData.password_hash}
        onChangeText={(v) => setFormData({...formData, password_hash: v})} 
      />

      <Text style={styles.label}>No. Telepon</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0812..." 
        keyboardType="phone-pad" 
        value={formData.no_telepon}
        onChangeText={(v) => setFormData({...formData, no_telepon: v})} 
      />

      <Text style={styles.label}>Alamat Pemilik</Text>
      <TextInput 
        style={[styles.input, {height: 60}]} 
        multiline 
        placeholder="Alamat lengkap pemilik" 
        value={formData.alamat}
        onChangeText={(v) => setFormData({...formData, alamat: v})}
      />

      <View style={styles.divider} />
      <Text style={styles.subTitle}>Informasi Rekening</Text>

      <Text style={styles.label}>Nama Bank</Text>
      <TextInput 
        style={styles.input} 
        placeholder="BCA / Mandiri / BRI" 
        value={formData.nama_bank}
        onChangeText={(v) => setFormData({...formData, nama_bank: v})} 
      />

      <Text style={styles.label}>No. Rekening</Text>
      <TextInput 
        style={styles.input} 
        placeholder="12345678" 
        keyboardType="numeric" 
        value={formData.no_rekening}
        onChangeText={(v) => setFormData({...formData, no_rekening: v})} 
      />

      <Text style={styles.label}>Atas Nama</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nama pemilik rekening" 
        value={formData.atas_nama_rekening}
        onChangeText={(v) => setFormData({...formData, atas_nama_rekening: v})} 
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.formTitle}>Konfirmasi Data</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.sumTitle}>PROPERTI</Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Nama:</Text> {formData.namaProperti || '-'}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Harga:</Text> Rp {formData.hargaSewa} / {formData.satuanSewa}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Jam:</Text> {formData.jamBuka} - {formData.jamTutup}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Fasilitas:</Text> {formData.fasilitas.join(', ') || '-'}
        </Text>
        
        <View style={styles.dividerSmall} />
        
        <Text style={styles.sumTitle}>PEMILIK & BANK</Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Nama:</Text> {formData.nama_lengkap || '-'}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Email:</Text> {formData.email || '-'}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Kontak:</Text> {formData.no_telepon || '-'}
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>Bank:</Text> {formData.nama_bank} ({formData.no_rekening})
        </Text>
        <Text style={styles.sumText}>
          <Text style={{fontWeight:'bold'}}>A.N:</Text> {formData.atas_nama_rekening}
        </Text>
      </View>

      <Text style={styles.infoText}>
        Pastikan semua data sudah benar sebelum mengirimkan pendaftaran.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* STEPPER INDICATOR */}
        <View style={styles.stepperContainer}>
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <View style={[styles.stepCircle, currentStep >= s ? styles.stepActive : styles.stepInactive]}>
                <Text style={[styles.stepText, currentStep < s && {color: '#666'}]}>{s}</Text>
                <Text style={styles.stepLabel}>
                  {s === 1 ? 'Properti' : s === 2 ? 'Pemilik' : 'Konfirmasi'}
                </Text>
              </View>
              {s < 3 && <View style={[styles.stepLine, currentStep > s ? styles.lineActive : styles.lineInactive]} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.mainCard}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* BUTTONS ACTION */}
          <View style={styles.buttonRow}>
            {currentStep === 1 ? (
              <TouchableOpacity style={styles.btnNextFull} onPress={() => setCurrentStep(2)}>
                <Text style={styles.btnNextText}>Lanjut ke Data Pemilik</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.splitButtonContainer}>
                <TouchableOpacity 
                  style={styles.btnBack} 
                  onPress={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                >
                  <Text style={styles.btnBackText}>Kembali</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btnNextSplit, loading && { opacity: 0.7 }]} 
                  onPress={() => {
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.btnNextText}>
                      {currentStep === 3 ? 'Kirim Pendaftaran' : 'Lanjut'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={{height: 40}} />
      </ScrollView>

      {showPicker && (
        <DateTimePicker 
          value={new Date()} 
          mode="time" 
          is24Hour={true} 
          display="default" 
          onChange={onTimeChange} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDE5F4' },
  scrollContent: { padding: 20, paddingTop: 60 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  stepCircle: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  stepActive: { backgroundColor: '#102A63' },
  stepInactive: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC' },
  stepText: { color: '#FFF', fontWeight: 'bold' },
  stepLabel: { position: 'absolute', top: 40, fontSize: 10, width: 70, textAlign: 'center', color: '#666' },
  stepLine: { height: 2, width: 50, marginHorizontal: 5 },
  lineActive: { backgroundColor: '#102A63' },
  lineInactive: { backgroundColor: '#CCC' },
  mainCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A63', textAlign: 'center', marginBottom: 20 },
  subTitle: { fontSize: 15, fontWeight: 'bold', color: '#102A63', marginVertical: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#F9F9F9', justifyContent: 'center' },
  uploadBox: { height: 140, borderWidth: 2, borderColor: '#DDD', borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  uploadText: { marginTop: 10, color: '#666', fontSize: 12 },
  row: { flexDirection: 'row', marginTop: 5 },
  rowUnit: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 8, padding: 2, height: 45, width: '100%' },
  unitBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  unitActive: { backgroundColor: '#102A63' },
  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  checkItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  checkActive: { borderColor: '#102A63', backgroundColor: '#F0F4FF' },
  addItemBtn: { borderWidth: 1, borderColor: '#102A63', borderStyle: 'dashed', borderRadius: 8, padding: 12, marginTop: 20, alignItems: 'center' },
  addItemText: { color: '#102A63', fontWeight: '600', fontSize: 13 },
  extraItemCard: { padding: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, marginTop: 10, backgroundColor: '#FAFAFA' },
  miniUpload: { width: 50, height: 50, backgroundColor: '#EEE', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  fullImg: { width: '100%', height: '100%' },
  inputSmall: { borderBottomWidth: 1, borderColor: '#DDD', fontSize: 12, padding: 4, marginBottom: 5 },
  
  buttonRow: { marginTop: 30, width: '100%' },
  splitButtonContainer: { flexDirection: 'row', alignItems: 'center' },
  btnNextFull: { backgroundColor: '#102A63', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: '100%' },
  btnNextSplit: { backgroundColor: '#102A63', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1.5, marginLeft: 12 },
  btnBack: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#102A63', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1 },
  btnNextText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnBackText: { color: '#102A63', fontWeight: 'bold', fontSize: 14 },

  summaryCard: { backgroundColor: '#F0F4FF', padding: 15, borderRadius: 10, marginVertical: 10 },
  sumTitle: { fontSize: 11, fontWeight: 'bold', color: '#102A63', marginBottom: 5 },
  sumText: { fontSize: 13, color: '#333', marginBottom: 3 },
  infoText: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  dividerSmall: { height: 1, backgroundColor: '#DDE5F4', marginVertical: 10 }
});