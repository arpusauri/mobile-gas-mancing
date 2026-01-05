import { StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, api } from "../../api/config";
import CustomHeader from "@/components/CustomHeader";

/* ================= TYPE ================= */
type StatusPesanan = "Lunas" | "Menunggu" | "Dibatalkan";

type Pesanan = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: StatusPesanan;
  image: string;
};

export default function PesananSayaScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= FETCH PESANAN ================= */
  const fetchPesanan = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      // userId tidak lagi dibutuhkan untuk parameter fungsi API
      // const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        setOrders([]);
        return;
      }

      // PANGGIL FUNGSI BARU (Hanya butuh token)
      const result = await api.booking.getByUserId(token);

      console.log("DATA PESANAN DARI SERVER:", result);

      // result dari apiCall biasanya sudah mengeluarkan '.data'
      // Jadi kita pastikan result itu sendiri adalah array
      const list = Array.isArray(result) ? result : [];

      const mappedOrders: Pesanan[] = list.map((item: any) => ({
        // Sesuaikan dengan properti yang di-return PesananModel.findAllByUserId
        id: String(item.id_pesanan),
        title: item.place_name || "-",
        location: item.place_location || "-",
        price: Number(item.total_harga || 0),
        status: item.status || "Menunggu",
        image: item.place_image
          ? `${API_URL}/uploads/${item.place_image.trim()}`
          : "https://via.placeholder.com/400",
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("FETCH PESANAN ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case "Lunas":
        return "#4ADE80";
      case "Menunggu":
        return "#FACC15";
      case "Dibatalkan":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  /* ================= CANCEL PESANAN ================= */
  const handleCancel = async (id: string) => {
    let confirmCancel = false;

    if (Platform.OS === "web") {
      // Web: gunakan window.confirm
      confirmCancel = window.confirm(
        "Apakah Anda yakin ingin membatalkan pesanan ini?"
      );
    } else {
      // Android/iOS: gunakan Alert.alert
      confirmCancel = await new Promise((resolve) => {
        Alert.alert(
          "Batalkan Pesanan?",
          "Apakah Anda yakin ingin membatalkan pesanan ini?",
          [
            { text: "Tidak", style: "cancel", onPress: () => resolve(false) },
            {
              text: "Ya, Batalkan",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ]
        );
      });
    }

    if (!confirmCancel) return;

    // Panggil API cancel
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await api.booking.cancel(id, token);
      fetchPesanan();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal membatalkan pesanan");
    }
  };



  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="Pesanan Saya" showCart />

      {orders.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text>Belum ada pesanan</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.imageOverlay} />

              <View style={styles.cardInner}>
                {/* TOP */}
                <View style={styles.topRow}>
                  <Text style={styles.orderIdText}>
                    No. Pesanan : {item.id}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                {/* MIDDLE */}
                <View>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="white" />
                    <Text style={styles.locationText}> {item.location}</Text>
                  </View>
                </View>

                {/* BOTTOM */}
                <View style={styles.bottomRow}>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>
                      Total : Rp. {item.price.toLocaleString("id-ID")}
                    </Text>
                  </View>

                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.btnDetail}
                      onPress={() =>
                        router.push({
                          pathname: "/DetailPesananSaya",
                          params: item,
                        })
                      }
                    >
                      <Text style={styles.btnText}>Lihat Detail</Text>
                    </TouchableOpacity>

                    {item.status !== "Dibatalkan" &&
                      item.status !== "Lunas" && (
                        <TouchableOpacity
                          style={styles.btnBatal}
                          onPress={() => handleCancel(item.id)}
                        >
                          <Text style={styles.btnText}>Batal</Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F1F5F9" },
  scrollContent: { padding: 16 },
  card: {
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "white",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderIdText: { color: "#E2E8F0", fontSize: 12 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: "bold" },
  titleText: { color: "white", fontSize: 22, fontWeight: "bold" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { color: "#F1F5F9", fontSize: 12 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceBadge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
  },
  priceText: { fontSize: 12, fontWeight: "bold" },
  buttonGroup: { flexDirection: "row", gap: 8 },
  btnDetail: {
    backgroundColor: "#102A63",
    padding: 8,
    borderRadius: 8,
  },
  btnBatal: {
    backgroundColor: "#DC2626",
    padding: 8,
    borderRadius: 8,
  },
  btnText: { color: "white", fontSize: 12, fontWeight: "bold" },
});
