import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image,
  Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FormMitra() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // ==========================================
  // STATE DATA FORM
  // ==========================================
  const [formData, setFormData] = useState({
    // Step 1: Properti
    propName: '',
    propPrice: '',
    propUnit: 'Jam', // Jam atau Hari
    propAddress: '',
    propDesc: '',
    propOpen: '',
    propClose: '',
    facilities: [] as string[],
    additionalItems: [] as any[],
    // Step 2: Pemilik & Akun
    ownerName: '',
    ownerEmail: '',
    ownerPass: '',
    ownerPhone: '',
    ownerAddress: '',
    bankName: '',
    bankAccNo: '',
    bankAccName: '',
    regDate: new Date().toISOString(), // current_timestamp
  });

  // Fungsi toggle fasilitas
  const toggleFacility = (facility: string) => {
    if (formData.facilities.includes(facility)) {
      setFormData({...formData, facilities: formData.facilities.filter(f => f !== facility)});
    } else {
      setFormData({...formData, facilities: [...formData.facilities, facility]});
    }
  };

  // Fungsi tambah item (Dummy logic untuk memunculkan input baru)
  const addItem = () => {
    const newItem = { id: Date.now(), name: '', price: '', unit: '', type: 'Peralatan' };
    setFormData({...formData, additionalItems: [...formData.additionalItems, newItem]});
  };

  // ==========================================
  // RENDER STEPPER INDICATOR
  // ==========================================
  const renderStepper = () => (
    <View style={styles.stepperContainer}>
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View style={[styles.stepCircle, currentStep >= s ? styles.stepActive : styles.stepInactive]}>
            <Text style={styles.stepText}>{s}</Text>
            <Text style={styles.stepLabel}>{s === 1 ? 'Properti' : s === 2 ? 'Pemilik' : 'Konfirmasi'}</Text>
          </View>
          {s < 3 && <View style={[styles.stepLine, currentStep > s ? styles.lineActive : styles.lineInactive]} />}
        </React.Fragment>
      ))}
    </View>
  );

  // ==========================================
  // RENDER CONTENT PER STEP
  // ==========================================
  
  const renderStep1 = () => (
    <View>
      <Text style={styles.formTitle}>Informasi Properti</Text>
      
      <Text style={styles.label}>Nama Pemancingan</Text>
      <TextInput style={styles.input} placeholder="Contoh: Pemancingan Telaga Biru" onChangeText={(v) => setFormData({...formData, propName: v})} />

      <Text style={styles.label}>Foto Lokasi Utama</Text>
      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="camera" size={30} color="#666" />
        <Text style={styles.uploadText}>Klik upload foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Gambarkan keunggulan tempat Anda" />

      <Text style={styles.label}>Alamat</Text>
      <TextInput style={[styles.input, {height: 60}]} multiline placeholder="Alamat lengkap lokasi" />

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Buka</Text>
          <TextInput style={styles.input} placeholder="08:00" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Tutup</Text>
          <TextInput style={styles.input} placeholder="20:00" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Harga</Text>
          <TextInput style={styles.input} placeholder="Rp" keyboardType="numeric" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Satuan</Text>
          <View style={styles.pickerContainer}>
             <Text>Per Jam</Text> 
             <Ionicons name="chevron-down" size={16} />
          </View>
        </View>
      </View>

      <Text style={styles.label}>Fasilitas</Text>
      <View style={styles.facilityRow}>
        {['Toilet', 'Musholla', 'Parkiran'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.checkItem, formData.facilities.includes(f) && styles.checkActive]}
            onPress={() => toggleFacility(f)}
          >
            <Ionicons name={formData.facilities.includes(f) ? "checkbox" : "square-outline"} size={20} color={formData.facilities.includes(f) ? "#102A63" : "#666"} />
            <Text style={{marginLeft: 5}}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
        <Text style={styles.addItemText}>+ Tambah Item (Alat/Umpan)</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.formTitle}>Informasi Pemilik & Akun</Text>
      
      <Text style={styles.label}>Nama Lengkap Mitra</Text>
      <TextInput style={styles.input} placeholder="Nama sesuai KTP" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="email@gmail.com" keyboardType="email-address" />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="******" secureTextEntry />

      <Text style={styles.label}>No. Telepon</Text>
      <TextInput style={styles.input} placeholder="0812..." keyboardType="phone-pad" />

      <View style={styles.divider} />
      <Text style={styles.subTitle}>Informasi Rekening (Untuk Pencairan)</Text>

      <Text style={styles.label}>Nama Bank</Text>
      <TextInput style={styles.input} placeholder="BCA / Mandiri / BRI" />

      <Text style={styles.label}>No. Rekening</Text>
      <TextInput style={styles.input} placeholder="12345678" keyboardType="numeric" />

      <Text style={styles.label}>Atas Nama</Text>
      <TextInput style={styles.input} placeholder="Nama pemilik rekening" />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.formTitle}>Konfirmasi Data</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Nama Properti:</Text>
        <Text style={styles.summaryValue}>{formData.propName || '-'}</Text>
        
        <Text style={styles.summaryLabel}>Mitra:</Text>
        <Text style={styles.summaryValue}>{formData.ownerName || '-'}</Text>

        <Text style={styles.summaryLabel}>Tanggal Daftar:</Text>
        <Text style={styles.summaryValue}>{new Date(formData.regDate).toLocaleDateString('id-ID')}</Text>
      </View>

      <Text style={styles.infoText}>
        Dengan menekan tombol konfirmasi, Anda menyetujui syarat dan ketentuan menjadi mitra Gas Mancing.
      </Text>
    </View>
  );

  const handleFinalConfirm = () => {
    Alert.alert(
      "Berhasil!",
      "Akun Mitra telah dibuat dan tempat pemancingan Anda berhasil didaftarkan. Silakan tunggu verifikasi tim kami.",
      [{ text: "Selesai", onPress: () => router.replace('/Mitra') }]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStepper()}

        <View style={styles.mainCard}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <View style={styles.buttonRow}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.btnBack} onPress={() => setCurrentStep(currentStep - 1)}>
                <Text style={styles.btnBackText}>Kembali</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.btnNext, { flex: currentStep === 1 ? 0 : 1, width: currentStep === 1 ? '100%' : 'auto' }]} 
              onPress={() => {
                if (currentStep < 3) setCurrentStep(currentStep + 1);
                else handleFinalConfirm();
              }}
            >
              <Text style={styles.btnNextText}>{currentStep === 3 ? 'Konfirmasi & Selesai' : 'Lanjut'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDE5F4' }, // Background biru muda spt gambar
  scrollContent: { padding: 20, paddingTop: 60 },
  
  // STEPPER
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  stepCircle: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  stepActive: { backgroundColor: '#102A63' },
  stepInactive: { backgroundColor: '#FFF', borderSize: 1, borderColor: '#CCC' },
  stepText: { color: '#FFF', fontWeight: 'bold' },
  stepLabel: { position: 'absolute', top: 40, fontSize: 10, width: 70, textAlign: 'center', color: '#666' },
  stepLine: { height: 2, width: 60, marginHorizontal: 5 },
  lineActive: { backgroundColor: '#102A63' },
  lineInactive: { backgroundColor: '#CCC' },

  // CARD
  mainCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#102A63', textAlign: 'center', marginBottom: 20 },
  subTitle: { fontSize: 16, fontWeight: 'bold', color: '#102A63', marginVertical: 10 },
  
  // INPUTS
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#F9F9F9' },
  uploadBox: { height: 150, borderWidth: 2, borderColor: '#DDD', borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  uploadText: { marginTop: 10, color: '#666', fontSize: 12 },
  row: { flexDirection: 'row', marginTop: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9F9F9' },
  
  // FACILITIES
  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  checkItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  checkActive: { borderColor: '#102A63', backgroundColor: '#F0F4FF' },
  
  addItemBtn: { borderSize: 1, borderColor: '#102A63', borderStyle: 'dashed', borderRadius: 8, padding: 12, marginTop: 20, alignItems: 'center' },
  addItemText: { color: '#102A63', fontWeight: '600' },

  // BUTTONS
  buttonRow: { flexDirection: 'row', marginTop: 30, gap: 10 },
  btnNext: { backgroundColor: '#102A63', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnNextText: { color: '#FFF', fontWeight: 'bold' },
  btnBack: { flex: 1, backgroundColor: '#FFF', borderSize: 1, borderColor: '#102A63', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnBackText: { color: '#102A63', fontWeight: 'bold' },

  // SUMMARY
  summaryCard: { backgroundColor: '#F0F4FF', padding: 15, borderRadius: 10, marginVertical: 10 },
  summaryLabel: { fontSize: 12, color: '#666' },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  infoText: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 }
});