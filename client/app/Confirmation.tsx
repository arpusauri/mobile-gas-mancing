import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, Platform } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import FooterBPC from "../components/FooterBPC";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api/config";

// --- LOAD ASSET GAMBAR QRIS ---
const QRIS_IMAGE = require("../assets/images/QRISRangga.jpg");

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Ambil token saat load
  useEffect(() => {
    const loadAuth = async () => {
      const userToken = await AsyncStorage.getItem("userToken"); // ✅ BENAR
      const userId = await AsyncStorage.getItem("userId");

      setToken(userToken);
      setUserId(userId);
    };
    loadAuth();
  }, []);

  // --- PARSING DATA DARI URL PARAMS ---
  const placeId = params.placeId as string;
  const totalHarga = Number(params.total || 0);
  const dateString = params.date as string;
  const duration = Number(params.duration || 1);
  const people = Number(params.people || 1);
  const paymentMethod = params.paymentMethod as string;
  const bankName = params.bankName as string;

  // Equipment (perlu di-parse karena dikirim sebagai JSON string)
  const selectedEquipment = params.equipment
    ? JSON.parse(params.equipment as string)
    : [];

  const nomorPesanan = `ORD-${Date.now()}`;
  const displayDate = new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // --- LOGIC API CALL (FINAL) ---
  const handleConfirmAndPay = async () => {
    if (!token || !userId) {
      Alert.alert("Error", "Sesi habis, silakan login ulang.");
      return;
    }

    if (!placeId || isNaN(Number(placeId))) {
      Alert.alert("Error", "Data tempat tidak valid.");
      return;
    }

    setLoading(true);

    // 1. Susun Payload dengan teliti
    const payload = {
      id_tempat: Number(placeId),
      tanggal_mulai: new Date(dateString).toISOString().split("T")[0],
      tanggal_selesai: new Date(dateString).toISOString().split("T")[0],
      jumlah_orang: Number(people) || 1,
      total_harga: Number(totalHarga) || 0,
      id_pengguna: Number(userId),
      nomor_pesanan: nomorPesanan,
      durasi_sewa_jam: Number(duration) || 0,
      metode_pembayaran: bankName, // Diambil dari params PaymentScreen
      items:
        selectedEquipment.length > 0
          ? selectedEquipment.map((item: any) => ({
              id_item: Number(item.id),
              kuantitas: Number(item.count),
              harga_satuan_saat_pesan: Number(item.price),
              subtotal: Number(item.count * item.price),
            }))
          : [],
    };

    console.log("SENDING PAYLOAD:", payload);

    try {
      const res = await api.booking.create(payload, token);
      console.log("BOOKING SUCCESS RESPONSE:", res);

      // 2. Logika Notifikasi & Redirect yang lebih kuat
      setTimeout(() => {
        if (Platform.OS === "web") {
          window.alert("Pesanan berhasil dibuat!");
          router.replace("/PesananSaya");
        } else {
          Alert.alert(
            "Sukses",
            "Pesanan berhasil dibuat!",
            [
              {
                text: "Lihat Pesanan",
                onPress: () => router.replace("/PesananSaya"),
              },
            ],
            { cancelable: false }
          );
        }
      }, 100);
    } catch (err: any) {
      console.error("Booking API Error:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Gagal membuat pesanan.";
      Alert.alert("Gagal", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <CustomHeader title="Konfirmasi Booking" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- INFO HARGA --- */}
        <View style={styles.topInfoCard}>
          <View>
            <Text style={styles.infoLabel}>Total Tagihan</Text>
            <Text style={styles.infoValueMain}>
              Rp.{totalHarga.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.infoLabel}>Metode Bayar</Text>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumberText}>{bankName}</Text>
            </View>
          </View>
        </View>

        {/* --- DETAIL PESANAN --- */}
        <View style={styles.confirmationCard}>
          <Text style={styles.sectionTitle}>Detail Pesanan</Text>
          <Text style={styles.kodeBayarText}>
            No. Order:{" "}
            <Text style={{ fontWeight: "bold" }}>{nomorPesanan}</Text>
          </Text>

          <View style={styles.infoBoxWrapper}>
            {/* Tanggal */}
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={22} color="#102A63" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>Tanggal Sewa</Text>
                <Text style={styles.infoSubText}>{displayDate}</Text>
              </View>
            </View>

            {/* Durasi */}
            <View style={styles.infoRow}>
              <Ionicons name="time" size={22} color="#102A63" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>Durasi</Text>
                <Text style={styles.infoSubText}>{duration} Jam/Unit</Text>
              </View>
            </View>

            {/* Orang */}
            <View style={styles.infoRow}>
              <Ionicons name="people" size={22} color="#102A63" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoBoldTitle}>Orang</Text>
                <Text style={styles.infoSubText}>{people} Orang</Text>
              </View>
            </View>
          </View>

          {/* Peralatan */}
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
            Peralatan yang Disewa :
          </Text>
          {selectedEquipment.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalItems}
            >
              {selectedEquipment.map((item: any, idx: number) => (
                <View key={idx} style={styles.itemSewaCard}>
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.qtyBadge}>x{item.count}</Text>
                    <Image
                      source={{
                        uri: item.image || "https://via.placeholder.com/60",
                      }}
                      style={styles.itemImage}
                    />
                  </View>
                  <View style={styles.itemFooterLabel}>
                    <Text style={styles.itemLabelText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 10, color: "#666" }}>
                      Rp.{item.price.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={30} color="#9CA3AF" />
              <Text style={styles.emptyText}>Tidak Menyewa Peralatan</Text>
            </View>
          )}

          {/* --- TAMPILAN QRIS INLINE --- */}
          {bankName === "QRIS" && (
            <View style={styles.qrSectionInline}>
              <View style={styles.divider} />
              <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 10 }]}>
                Scan QRIS untuk Bayar
              </Text>
              
              <View style={styles.qrContainerInline}>
                <Image 
                  source={QRIS_IMAGE} 
                  style={{ width: '100%', height: '100%' }} 
                  resizeMode="contain" 
                />
              </View>

              <Text style={styles.qrInstructionInline}>
                Total Bayar: <Text style={{fontWeight:'bold'}}>Rp.{totalHarga.toLocaleString("id-ID")}</Text>
              </Text>
              <Text style={styles.qrNote}>
                Silakan scan kode di atas menggunakan aplikasi pembayaran Anda sebelum menekan tombol konfirmasi.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <FooterBPC
        buttonLabel={loading ? "Memproses Pesanan..." : "Konfirmasi & Bayar"}
        disabled={loading}
        onPress={handleConfirmAndPay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  topInfoCard: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  infoLabel: { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  infoValueMain: { fontSize: 20, fontWeight: "bold", color: "#000" },
  orderNumberBadge: {
    backgroundColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderNumberText: { fontSize: 14, fontWeight: "bold", color: "#1F2937" },
  confirmationCard: {
    backgroundColor: "#E5E7EB",
    borderRadius: 30,
    padding: 20,
    minHeight: 450,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  kodeBayarText: { fontSize: 14, color: "#4B5563", marginBottom: 15 },
  infoBoxWrapper: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  infoTextGroup: { marginLeft: 15 },
  infoBoldTitle: { fontSize: 15, fontWeight: "bold", color: "#102A63" },
  infoSubText: { fontSize: 12, color: "#6B7280" },
  horizontalItems: { marginTop: 15 },
  itemSewaCard: {
    width: 130,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  imagePlaceholder: {
    height: 90,
    backgroundColor: "#A5C9FF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBadge: {
    position: "absolute",
    top: 5,
    left: 8,
    fontSize: 12,
    fontWeight: "bold",
    zIndex: 1,
  },
  itemImage: { width: 60, height: 60, resizeMode: "contain" },
  itemFooterLabel: {
    backgroundColor: "#B4D1FF",
    paddingVertical: 6,
    alignItems: "center",
  },
  itemLabelText: { fontSize: 11, fontWeight: "bold", color: "#102A63" },
  emptyContainer: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },
  emptyText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  // STYLES TAMBAHAN UNTUK QRIS
  qrSectionInline: {
    marginTop: 10,
    alignItems: 'center',
  },
  qrContainerInline: {
    width: 220,
    height: 220,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  qrInstructionInline: {
    fontSize: 15,
    color: '#102A63',
    marginBottom: 5,
    textAlign: 'center'
  },
  qrNote: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: 16
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    width: '100%',
    marginVertical: 20,
  }
});