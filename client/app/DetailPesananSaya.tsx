import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import { API_URL, api } from "../api/config";

export default function DetailPesananSaya() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pesanan, setPesanan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // ✅ FIX: Gunakan "userToken" bukan "token"
        const token = await AsyncStorage.getItem("userToken");

        if (!token || !id) {
          console.warn("⚠️ Token atau ID tidak ditemukan");
          return;
        }

        console.log("🔐 Fetching with token:", token ? "✅ Ada" : "❌ Kosong");
        console.log("📦 Booking ID:", id);

        // Fetch booking detail
        const res = await api.booking.getById(id, token);
        console.log("📥 Booking response:", res);

        setPesanan(res);
      } catch (err) {
        console.error("❌ Gagal ambil detail pesanan:", err);
        Alert.alert("Error", "Gagal memuat data pesanan");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Detail Pesanan" showCart={true} />
        <View style={styles.centerContent}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!pesanan) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Detail Pesanan" showCart={true} />
        <View style={styles.centerContent}>
          <Text>Data pesanan tidak ditemukan</Text>
        </View>
      </View>
    );
  }

  // ===== MAPPING DATA DENGAN FALLBACK =====
  const orderId = pesanan?.nomor_pesanan || pesanan?.order_number || "N/A";
  const title = pesanan?.place_name || pesanan?.tempat_name || "Tempat";
  const locationText = pesanan?.location || pesanan?.lokasi || "";
  const price = pesanan?.total_biaya || pesanan?.total_harga || 0;
  const jumlahOrang = pesanan?.num_people || pesanan?.jumlah_orang || 0;

  const imageUri =
    pesanan?.image_url && typeof pesanan.image_url === "string"
      ? `${API_URL}/uploads/${pesanan.image_url.trim()}`
      : "https://via.placeholder.com/600x400";

  const tanggal = pesanan?.tgl_mulai_sewa || pesanan?.tanggal_mulai
    ? new Date(pesanan?.tgl_mulai_sewa || pesanan?.tanggal_mulai).toLocaleDateString("id-ID")
    : "N/A";

  const items = pesanan?.item_sewa || pesanan?.items || [];
  const status = pesanan?.status_pesanan || pesanan?.status || "pending";
  const paymentMethod =
    pesanan?.metode_pembayaran || pesanan?.payment_method || "N/A";

  // ===== GET STATUS UI (DIPERBARUI DENGAN STATUS SELESAI) =====
  const getStatusUI = () => {
    switch (status?.toLowerCase()) {
      case "selesai": // ✅ TAMBAHAN STATUS SELESAI
        return {
          backgroundColor: "#102A63", // Biru Dongker
          textColor: "#FFF",
          label: "Selesai",
        };
      case "lunas":
        return {
          backgroundColor: "#4ADE80",
          textColor: "#FFF",
          label: "Sudah Lunas",
        };
      case "dibatalkan":
        return {
          backgroundColor: "#EF4444",
          textColor: "#FFF",
          label: "Dibatalkan",
        };
      default:
        return {
          backgroundColor: "#FACC15",
          textColor: "#000",
          label: "Menunggu Pembayaran",
        };
    }
  };

  const ui = getStatusUI();

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("Beri Rating", "Silakan Pilih Bintang");
      return;
    }
    setSubmitting(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      if (!userToken) {
        Alert.alert("Error", "Sesi login berakhir. Silakan login ulang.");
        return;
      }

      const payload = {
        id_tempat: pesanan?.id_tempat,
        id_booking: id,
        rating: rating,
        ulasan: comment,
        token: userToken
      };
      await api.review.create(payload); 
      Alert.alert("Berhasil", "Terima kasih ulasannya!");
      setModalVisible(false);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Review Error:", err);
      Alert.alert("Gagal", "Gagal kirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Detail Pesanan" showCart={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{title}</Text>
            <View style={styles.heroLocationRow}>
              <Ionicons name="location-sharp" size={16} color="white" />
              <Text style={styles.heroLocationText}>{locationText}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: ui.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: ui.textColor }]}>
              {ui.label}
            </Text>
          </View>
        </View>

        {/* AREA CARD PUTIH */}
        <View style={styles.mainCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>Informasi Pembayaran</Text>
            <Text style={styles.orderIdText}>{orderId}</Text>
          </View>

          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.labelDimmed}>Total Harga</Text>
              <Text style={styles.valueBold}>
                Rp. {Number(price).toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.labelDimmed}>Metode Pembayaran</Text>
              <Text style={styles.valueBold}>{paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Informasi Sewa</Text>
          <View style={styles.rentGrid}>
            <View style={styles.rowSejajar}>
              <View style={styles.rentCol}>
                <View style={styles.rentItem}>
                  <Ionicons name="calendar" size={20} color="#102A63" />
                  <View style={styles.rentTextCol}>
                    <Text style={styles.labelDimmed}>Tanggal</Text>
                    <Text style={styles.rentValueLabel}>{tanggal}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rentCol}>
                <View style={styles.rentItem}>
                  <Ionicons name="people" size={20} color="#102A63" />
                  <View style={styles.rentTextCol}>
                    <Text style={styles.labelDimmed}>Orang</Text>
                    <Text style={styles.rentValueLabel}>
                      {jumlahOrang} Orang
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.rentItemMargin}>
              <Ionicons name="location" size={20} color="#102A63" />
              <View style={styles.rentTextCol}>
                <Text style={styles.labelDimmed}>Lokasi</Text>
                <Text style={styles.rentValueLabel}>{locationText}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Peralatan Yang Disewa:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.equipmentScroll}
          >
            {items.length === 0 ? (
              <Text style={{ color: "#888", fontSize: 12, marginTop: 8 }}>
                Tidak ada peralatan yang disewa
              </Text>
            ) : (
              items.map((item: any, idx: number) => {
                const imageUri =
                  item.image_url && typeof item.image_url === "string"
                    ? `${API_URL}/uploads/${item.image_url.trim()}`
                    : "https://via.placeholder.com/120";

                return (
                  <View key={idx} style={styles.itemCard}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemLabel}>
                      <Text
                        style={styles.itemText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name || item.nama_item || "Item"}
                      </Text>
                      {item.quantity && (
                        <Text style={styles.itemSubText}>
                          Jumlah: {item.quantity}
                        </Text>
                      )}
                      {item.subtotal && (
                        <Text style={styles.itemSubText}>
                          Rp {Number(item.subtotal).toLocaleString("id-ID")}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* ✅ TAMBAHAN SECTION ULASAN */}
          <View style={styles.divider} />

          {status?.toLowerCase() === "selesai" ? (
            <TouchableOpacity 
              style={styles.btnUlasan}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="star" size={20} color="white" />
              <Text style={styles.btnUlasanText}>Tulis Ulasan Pengalaman</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.infoUlasanBox}>
              <Ionicons name="information-circle-outline" size={18} color="#94A3B8" />
              <Text style={styles.infoUlasanText}>
                Ulasan dapat diberikan setelah pesanan Selesai.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- TEMPEL MODAL DI SINI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Beri Ulasan</Text>
            <Text style={styles.modalQuestion}>Bagaimana pengalaman Anda?</Text>
            
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons 
                    name={s <= rating ? "star" : "star-outline"} 
                    size={35} 
                    color={s <= rating ? "#FACC15" : "#CCC"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.textInputUlasan}
              multiline
              placeholder="Ceritakan pengalaman Anda..."
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.btnBatalModal} onPress={() => setModalVisible(false)}>
                <Text>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnKirimModal} onPress={handleSubmitReview} disabled={submitting}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Kirim Ulasan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: { height: 280, width: "100%", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroContent: { position: "absolute", bottom: 55, left: 20 },
  heroTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  heroLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  heroLocationText: { color: "white", fontSize: 14, marginLeft: 5 },
  statusBadge: {
    position: "absolute",
    bottom: 50,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  statusText: { fontWeight: "bold", fontSize: 11 },
  mainCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -40,
    padding: 20,
    paddingBottom: 40, // Ditambah sedikit padding bawah
    flex: 1,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  orderIdText: { color: "#94A3B8", fontSize: 14 },
  paymentRow: { flexDirection: "row", justifyContent: "space-between" },
  alignRight: { alignItems: "flex-end" },
  labelDimmed: { color: "#94A3B8", fontSize: 12, marginBottom: 4 },
  valueBold: { fontSize: 18, fontWeight: "bold", color: "#000" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 20 },
  rentGrid: { marginTop: 10 },
  rowSejajar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  rentCol: { flex: 1 },
  rentItem: { flexDirection: "row", alignItems: "center" },
  rentItemMargin: { flexDirection: "row", alignItems: "center" },
  rentTextCol: { marginLeft: 10 },
  rentValueLabel: { fontSize: 14, color: "#475569", fontWeight: "600" },
  equipmentScroll: { marginTop: 15 },
  itemCard: {
    width: 110,
    marginRight: 15,
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemImage: { width: "100%", height: 80 },
  itemLabel: { paddingVertical: 8, alignItems: "center" },
  itemText: { fontSize: 12, fontWeight: "bold", color: "#102A63" },
  itemSubText: { fontSize: 11, color: "#475569", marginTop: 2 },
  // ✅ STYLES BARU UNTUK ULASAN
  btnUlasan: {
    backgroundColor: "#102A63", // Biru Dongker
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    elevation: 2,
  },
  btnUlasanText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  infoUlasanBox: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoUlasanText: {
    color: "#64748B",
    fontSize: 13,
    marginLeft: 8,
    fontStyle: "italic",
  },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center' 
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#102A63', marginBottom: 20 },
  modalQuestion: { fontSize: 16, marginBottom: 15 },
  starsRow: { flexDirection: 'row', marginBottom: 20 },
  textInputUlasan: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 12, 
    padding: 12, 
    height: 100, 
    textAlignVertical: 'top' 
  },
  modalButtonRow: { flexDirection: 'row', marginTop: 20, gap: 40 },
  btnBatalModal: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  btnKirimModal: { 
    flex: 5, 
    backgroundColor: '#102A63', 
    paddingVertical: 12,
    borderRadius: 12, 
    alignItems: 'center' 
  },
});