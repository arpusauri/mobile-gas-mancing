import React from 'react';
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
import { 
  Ionicons 
} from '@expo/vector-icons';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 1. Ambil Data dari Params (SINKRONISASI)
  const totalHarga = params.total || "0"; 
  const tanggalBooking = params.date || "03/01/2026";
  const jumlahOrang = params.people || "1";

  // 2. Ambil Data Peralatan (Parsing JSON)
  const equipmentData = params.equipment 
    ? JSON.parse(params.equipment as string) 
    : [];
  
  // Filter peralatan yang di-klik (count > 0)
  const selectedEquipment = equipmentData.filter(
    (item: any) => item.count > 0
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen 
        options={{ 
          headerShown: false 
        }} 
      />
      
      {/* --- HEADER (IDENTIK) --- */}
      <View style={styles.headerTopBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            router.back();
          }}
        >
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
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- CARD INFO HARGA ATAS --- */}
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
                {/* 🔴 TODO: AMBIL NOMOR PESANAN DARI API */}
                B-21231123
              </Text>
            </View>
          </View>
        </View>

        {/* --- DETAIL PESANAN (KARTU ABU-ABU) --- */}
        <View style={styles.confirmationCard}>
          <Text style={styles.sectionTitle}>
            Detail Pesanan
          </Text>
          <Text style={styles.kodeBayarText}>
            Kode Bayar: 
            <Text style={{ fontWeight: 'bold' }}>
              {/* 🔴 TODO: GENERATE KODE BAYAR */}
              PAY-12345
            </Text>
          </Text>

          {/* BOX INFO PUTIH */}
          <View style={styles.infoBoxWrapper}>
            <View style={styles.infoRow}>
              <Ionicons 
                name="location" 
                size={22} 
                color="#102A63" 
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>
                  Lokasi
                </Text>
                <Text style={styles.infoSubText}>
                  {/* 🔴 TODO: HUBUNGKAN KE DATA LOKASI JIKA DINAMIS */}
                  Ancol, Jakarta barat
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons 
                name="calendar" 
                size={22} 
                color="#102A63" 
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>
                  Tanggal
                </Text>
                <Text style={styles.infoSubText}>
                  {/* DATA SUDAH SINKRON */}
                  {tanggalBooking}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons 
                name="people" 
                size={22} 
                color="#102A63" 
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>
                  Orang
                </Text>
                <Text style={styles.infoSubText}>
                  {/* DATA SUDAH SINKRON */}
                  {jumlahOrang}
                </Text>
              </View>
            </View>
          </View>

          {/* PERALATAN SECTION */}
          <Text 
            style={[
              styles.sectionTitle, 
              { marginTop: 25 }
            ]}
          >
            Peralatan yang Disewa :
          </Text>
          
          {selectedEquipment.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.horizontalItems}
            >
              {selectedEquipment.map((item: any, index: number) => (
                <View 
                  key={index} 
                  style={styles.itemSewaCard}
                >
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.qtyBadge}>
                      x{item.count}
                    </Text>
                    {/* 🔴 TODO: GANTI LOGIC GAMBAR SESUAI ITEM */}
                    <Image 
                      source={{ 
                        uri: 'https://img.freepik.com/free-vector/fishing-equipment-concept_1284-13233.jpg' 
                      }} 
                      style={styles.itemImage} 
                    />
                  </View>
                  <View style={styles.itemFooterLabel}>
                    <Text style={styles.itemLabelText}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="cart-outline" 
                size={30} 
                color="#9CA3AF" 
              />
              <Text style={styles.emptyText}>
                Tidak Menyewa Peralatan
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* --- FOOTER (IDENTIK DENGAN PAYMENT) --- */}
      <View style={styles.footerContainer}>
         <TouchableOpacity 
            style={styles.fullWidthButton} 
            onPress={() => {
              // 🔴 TODO: NAVIGASI KE PAGE SUCCESS
              alert("Pembayaran Berhasil!");
            }}
         >
            <Text style={styles.fullWidthButtonText}>
              Bayar Sekarang
            </Text>
         </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
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
    alignItems: 'center' 
  },
  headerTitleText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 150 
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
  confirmationCard: { 
    backgroundColor: '#E5E7EB', 
    borderRadius: 30, 
    padding: 20, 
    minHeight: 450 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  kodeBayarText: { 
    fontSize: 14, 
    color: '#4B5563', 
    marginBottom: 15 
  },
  infoBoxWrapper: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 18, 
    elevation: 2 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  infoTextGroup: { 
    marginLeft: 15 
  },
  infoBoldTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#102A63' 
  },
  infoSubText: { 
    fontSize: 12, 
    color: '#6B7280' 
  },
  horizontalItems: { 
    marginTop: 15 
  },
  itemSewaCard: { 
    width: 130, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    marginRight: 15, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#D1D5DB' 
  },
  imagePlaceholder: { 
    height: 90, 
    backgroundColor: '#A5C9FF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qtyBadge: { 
    position: 'absolute', 
    top: 5, 
    left: 8, 
    fontSize: 12, 
    fontWeight: 'bold', 
    zIndex: 1 
  },
  itemImage: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain' 
  },
  itemFooterLabel: { 
    backgroundColor: '#B4D1FF', 
    paddingVertical: 6, 
    alignItems: 'center' 
  },
  itemLabelText: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#102A63' 
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 20, 
    padding: 30,
    marginTop: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#9CA3AF',
  },
  emptyText: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
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
    alignItems: 'center' 
  },
  fullWidthButtonText: { 
    color: '#102A63', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});