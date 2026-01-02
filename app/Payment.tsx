import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  SafeAreaView
} from 'react-native';
import { 
  Stack, 
  useRouter, 
  useLocalSearchParams 
} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalHarga = params.total || "0"; 

  // State Dropdown
  const [isVaOpen, setIsVaOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false); 
  
  // State Logika Tombol (Awalnya null)
  const [paymentLabel, setPaymentLabel] = useState<null | string>(null);
  const [selectedBank, setSelectedBank] = useState('');

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen 
        options={{ 
          headerShown: false 
        }} 
      />
      
      {/* --- HEADER (IDENTIK DENGAN BOOKING) --- */}
      <View style={styles.headerTopBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            router.push("/Booking");
          }}
        >
          {/* 🔴 TODO: GANTI ICON BACK JIKA PERLU */}
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>

        <Text style={styles.headerTitleText}>
          Pembayaran
        </Text>

        <View 
          style={{ 
            width: 40 
          }} 
        /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* --- CARD INFO HARGA --- */}
        <View style={styles.topInfoCard}>
          <View>
            <Text style={styles.infoLabel}>
              Total Harga
            </Text>
            <Text style={styles.infoValueMain}>
              Rp.{Number(totalHarga).toLocaleString('id-ID')}
            </Text>
          </View>

          <View 
            style={{ 
              alignItems: 'flex-end' 
            }}
          >
            <Text style={styles.infoLabel}>
              #NomorPesanan
            </Text>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumberText}>
                B-21231123
              </Text>
            </View>
          </View>
        </View>

        {/* --- SECTION METODE PEMBAYARAN --- */}
        <View style={styles.paymentSectionCard}>
          <Text style={styles.sectionTitle}>
            Metode Pembayaran
          </Text>

          {/* 1. DROPDOWN VIRTUAL ACCOUNT */}
          <TouchableOpacity 
            style={[
              styles.dropdownHeader, 
              isVaOpen && styles.dropdownHeaderActive
            ]} 
            onPress={() => {
              setIsVaOpen(!isVaOpen);
              setIsQrOpen(false); 
            }}
          >
            <Text style={styles.dropdownTitleText}>
              Virtual Account
            </Text>
            {/* 🔴 TODO: GANTI ICON PANAH VA */}
            <Ionicons 
              name={isVaOpen ? "caret-up" : "caret-down"} 
              size={18} 
              color="#4B5563" 
            />
          </TouchableOpacity>

          {isVaOpen && (
            <View style={styles.dropdownContent}>
              {[
                { 
                  name: 'BRI', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_Logo.svg/1200px-BRI_Logo.svg.png' 
                },
                { 
                  name: 'BNI', 
                  logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png' 
                },
                { 
                  name: 'BCA', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png' 
                }
              ].map((bank) => (
                <TouchableOpacity 
                  key={bank.name} 
                  style={styles.bankItem} 
                  onPress={() => {
                    setPaymentLabel('Virtual Account');
                    setSelectedBank(bank.name);
                  }}
                >
                  <View style={styles.bankLogoPlaceholder}>
                    {/* 🔴 TODO: GANTI SOURCE LOGO BANK KAMU */}
                    <Image 
                      source={{ 
                        uri: bank.logo 
                      }} 
                      style={styles.bankImage} 
                    />
                  </View>
                  <Text style={styles.bankNameText}>
                    {bank.name}
                  </Text>
                  
                  {/* --- PEMBUNGKUS RADIO BUTTON --- */}
                  <View style={styles.radioButtonContainer}>
                    <View style={styles.radioButton}>
                      {selectedBank === bank.name && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 2. DROPDOWN QR CODE */}
          <TouchableOpacity 
            style={[
              styles.dropdownHeader, 
              { marginTop: 15 }, 
              isQrOpen && styles.dropdownHeaderActive
            ]} 
            onPress={() => {
              setIsQrOpen(!isQrOpen);
              setIsVaOpen(false); 
            }}
          >
            <Text style={styles.dropdownTitleText}>
              QR Code
            </Text>
            {/* 🔴 TODO: GANTI ICON PANAH QR */}
            <Ionicons 
              name={isQrOpen ? "caret-up" : "caret-down"} 
              size={18} 
              color="#4B5563" 
            />
          </TouchableOpacity>

          {isQrOpen && (
            <View style={styles.dropdownContent}>
              <TouchableOpacity 
                style={styles.bankItem} 
                onPress={() => {
                  setPaymentLabel('QR Code');
                  setSelectedBank('QRIS');
                }}
              >
                <View style={styles.bankLogoPlaceholder}>
                  {/* 🔴 TODO: GANTI LOGO QRIS KAMU */}
                  <Image 
                    source={{ 
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png' 
                    }} 
                    style={styles.bankImage} 
                  />
                </View>
                <Text style={styles.bankNameText}>
                  QRIS
                </Text>
                
                {/* --- PEMBUNGKUS RADIO BUTTON --- */}
                <View style={styles.radioButtonContainer}>
                  <View style={styles.radioButton}>
                    {selectedBank === 'QRIS' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- FOOTER (IDENTIK DENGAN BOOKING) --- */}
      <View style={styles.footerContainer}>
         <TouchableOpacity 
            disabled={!paymentLabel}
            style={[
              styles.fullWidthButton,
              !paymentLabel && { opacity: 0.6 }
            ]}
            onPress={() => {
              router.push({
                pathname: "/Confirmation",
                params: {
                    total: totalHarga,
                    equipment: params.equipment,
                    people: params.people,
                    date: params.date
                }
              });
            }}
         >
            <Text style={styles.fullWidthButtonText}>
              {paymentLabel 
                ? `Bayar Dengan ${paymentLabel}` 
                : "Pilih Metode Pembayaran"}
            </Text>
         </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    marginTop: Platform.OS === 'android' ? 15 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  topInfoCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginBottom: 4 
  },
  infoValueMain: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  orderNumberBadge: { 
    backgroundColor: '#D1D5DB', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  orderNumberText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  paymentSectionCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#000'
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  dropdownHeaderActive: { 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    borderBottomWidth: 0 
  },
  dropdownTitleText: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#000'
  },
  dropdownContent: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    backgroundColor: '#fff',
  },
  bankItem: { 
    flexDirection: 'row', 
    alignItems: 'center', // Mengunci logo & teks tetap di tengah baris
    paddingVertical: 12, 
    height: 60, // Kunci tinggi baris agar radio button tidak geser
    borderBottomWidth: 1, 
    borderBottomColor: '#F9FAFB' 
  },
  bankLogoPlaceholder: { 
    width: 60, 
    height: 35, 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#F3F4F6', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  bankImage: { 
    width: 40, 
    height: 20, 
    resizeMode: 'contain' 
  },
  bankNameText: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: '600',
    color: '#000'
  },
  // --- PERBAIKAN: KHUSUS UNTUK RADIO BUTTON AGAR LURUS TOTAL ---
  radioButtonContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end', // Narik ke pojok kanan tapi tetep center secara vertikal
  },
  radioButton: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    borderWidth: 2, 
    borderColor: '#102A63', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioButtonInner: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#102A63' 
  },
  // --------------------------------
  footerContainer: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    backgroundColor: '#102A63',
    padding: 20,
    paddingBottom: 27,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  fullWidthButtonText: {
    color: '#102A63',
    fontWeight: 'bold',
    fontSize: 14,
  },
});