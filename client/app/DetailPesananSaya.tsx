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

  const tanggal =
    pesanan?.tgl_mulai_sewa || pesanan?.tanggal_mulai
      ? new Date(
          pesanan?.tgl_mulai_sewa || pesanan?.tanggal_mulai
        ).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A";

  const items = pesanan?.item_sewa || pesanan?.items || [];
  const status = pesanan?.status_pesanan || pesanan?.status || "pending";
  const paymentMethod =
    pesanan?.metode_pembayaran || pesanan?.payment_method || "N/A";

  // ===== GET STATUS UI =====
  const getStatusUI = () => {
    switch (status?.toLowerCase()) {
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
        </View>
      </ScrollView>
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
});
