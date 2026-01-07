import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "@/components/CustomHeader";
import { api } from "@/api/config";

type StatusPesanan = "Menunggu Pembayaran" | "Lunas" | "Dibatalkan" | "Selesai";

interface Pesanan {
  id_pesanan: string;
  nomor_pesanan: string;
  nama_pemesan: string;
  id_tempat: string;
  nama_tempat: string;
  tanggal_mulai: string;
  jumlah_orang: number;
  total_harga: number;
  status_pesanan: StatusPesanan;
  metode_pembayaran: string;
}

interface Tempat {
  id_tempat: string;
  nama_tempat: string;
}

export default function PesananMitra() {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [tempatList, setTempatList] = useState<Tempat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTempatId, setSelectedTempatId] = useState<string | null>(null);
  const [mitraId, setMitraId] = useState<string | null>(null);

  useEffect(() => {
    const loadPesanan = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem("userToken");
        const storedMitraId = await AsyncStorage.getItem("userId");

        if (!token || !storedMitraId) return;

        setMitraId(storedMitraId);

        const response = await api.mitra.getPropertyBookings(
          storedMitraId,
          token
        );

        const bookings = Array.isArray(response)
          ? response
          : response?.data || response?.bookings || [];

        const mappedPesanan: Pesanan[] = bookings.map((item: any) => ({
          id_pesanan: String(item.id_pesanan || item.id || ""),
          nomor_pesanan: item.nomor_pesanan || item.order_number || "N/A",
          nama_pemesan: item.nama_pemesan || item.user_name || "Unknown",
          id_tempat: String(item.id_tempat || item.place_id || ""),
          nama_tempat: item.nama_tempat || item.place_name || "N/A",
          tanggal_mulai: item.tgl_mulai_sewa || item.tanggal_mulai || "",
          jumlah_orang: Number(item.jumlah_orang || item.num_people || 0),
          total_harga: Number(item.total_biaya || item.total_harga || 0),
          status_pesanan:
            item.status_pesanan || item.status || "Menunggu Pembayaran",
          metode_pembayaran:
            item.metode_pembayaran || item.payment_method || "N/A",
        }));

        setPesananList(mappedPesanan);

        const uniqueTempatMap = new Map(
          mappedPesanan.map((p) => [
            p.id_tempat,
            { id_tempat: p.id_tempat, nama_tempat: p.nama_tempat },
          ])
        );
        const uniqueTempat = Array.from(uniqueTempatMap.values());
        setTempatList(uniqueTempat);

        if (uniqueTempat.length > 0) {
          setSelectedTempatId(uniqueTempat[0].id_tempat);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Gagal memuat data pesanan");
      } finally {
        setLoading(false);
      }
    };

    loadPesanan();
  }, []);

  const filteredPesanan = pesananList.filter(
    (p) => p.id_tempat === selectedTempatId
  );

  const handleUpdateStatus = async (
    id: string,
    currentStatus: StatusPesanan
  ) => {
    const statusFlow: StatusPesanan[] = [
      "Menunggu Pembayaran",
      "Lunas",
      "Selesai",
    ];

    const currentIndex = statusFlow.indexOf(currentStatus);

    if (
      currentIndex === -1 ||
      currentStatus === "Selesai" ||
      currentStatus === "Dibatalkan"
    ) {
      const msg = "Status ini sudah final dan tidak dapat diubah lagi.";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Info", msg);
      return;
    }

    const nextStatus = statusFlow[currentIndex + 1];
    if (!nextStatus) return;

    const message = `Ubah status pesanan menjadi "${nextStatus}"?`;
    let confirmUpdate = false;

    if (Platform.OS === "web") {
      confirmUpdate = window.confirm(message);
    } else {
      confirmUpdate = await new Promise((resolve) => {
        Alert.alert("Konfirmasi Perubahan", message, [
          { text: "Batal", onPress: () => resolve(false), style: "cancel" },
          { text: "Ya, Update", onPress: () => resolve(true) },
        ]);
      });
    }

    if (!confirmUpdate) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Sesi login berakhir");

      await api.mitra.updateBookingStatus(id, nextStatus, token);

      setPesananList((prev) =>
        prev.map((p) =>
          p.id_pesanan === id ? { ...p, status_pesanan: nextStatus } : p
        )
      );

      const successMsg = `Berhasil! Pesanan sekarang berstatus: ${nextStatus}`;
      Platform.OS === "web"
        ? window.alert(successMsg)
        : Alert.alert("Sukses", successMsg);
    } catch (err: any) {
      const errorMsg = err.message || "Terjadi gangguan pada koneksi server.";
      Platform.OS === "web"
        ? window.alert(errorMsg)
        : Alert.alert("Error", errorMsg);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "lunas") return "#4ADE80";
    if (s === "menunggu pembayaran") return "#FACC15";
    if (s === "dibatalkan") return "#EF4444";
    if (s === "selesai") return "#6366F1";
    return "#9CA3AF";
  };

  const getStatusLabel = (status: string) => {
    return status || "N/A";
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Manage Pesanan" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#102A63" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Manage Pesanan" showBackButton={false} />

      {tempatList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>Belum ada pesanan</Text>
        </View>
      ) : (
        <>
          <View style={styles.tabsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsScroll}
            >
              {tempatList.map((tempat) => (
                <TouchableOpacity
                  key={tempat.id_tempat}
                  style={[
                    styles.tab,
                    selectedTempatId === tempat.id_tempat && styles.tabActive,
                  ]}
                  onPress={() => setSelectedTempatId(tempat.id_tempat)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTempatId === tempat.id_tempat &&
                        styles.tabTextActive,
                    ]}
                  >
                    {tempat.nama_tempat}
                  </Text>
                  {selectedTempatId === tempat.id_tempat && (
                    <View style={styles.tabIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {filteredPesanan.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Tidak ada pesanan</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.tableContainer}>
                  {/* TABLE HEADER */}
                  <View style={styles.tableHeader}>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 100 },
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 120 },
                      ]}
                    >
                      Pemesan
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 120 },
                      ]}
                    >
                      Tanggal
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 80 },
                      ]}
                    >
                      Orang
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 140 },
                      ]}
                    >
                      Total
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 140 },
                      ]}
                    >
                      Pembayaran
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { width: 160 },
                      ]}
                    >
                      Status
                    </Text>
                  </View>

                  {/* TABLE BODY */}
                  {filteredPesanan.map((pesanan) => (
                    <View key={pesanan.id_pesanan} style={styles.tableRow}>
                      <Text
                        style={[styles.tableCell, { width: 100 }]}
                        numberOfLines={1}
                      >
                        {pesanan.nomor_pesanan}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 120 }]}
                        numberOfLines={1}
                      >
                        {pesanan.nama_pemesan}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 120 }]}
                        numberOfLines={1}
                      >
                        {new Date(pesanan.tanggal_mulai).toLocaleDateString(
                          "id-ID"
                        )}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 80 }]}
                        numberOfLines={1}
                      >
                        {pesanan.jumlah_orang}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 140 }]}
                        numberOfLines={1}
                      >
                        Rp {pesanan.total_harga.toLocaleString("id-ID")}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 140 }]}
                        numberOfLines={1}
                      >
                        {pesanan.metode_pembayaran}
                      </Text>
                      <View style={[styles.tableCell, { width: 160 }]}>
                        <TouchableOpacity
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                pesanan.status_pesanan
                              ),
                              flexDirection: "row",
                              gap: 4,
                            },
                          ]}
                          onPress={() =>
                            handleUpdateStatus(
                              pesanan.id_pesanan,
                              pesanan.status_pesanan
                            )
                          }
                        >
                          <Text style={styles.statusBadgeText}>
                            {getStatusLabel(pesanan.status_pesanan)}
                          </Text>
                          {pesanan.status_pesanan !== "Selesai" &&
                            pesanan.status_pesanan !== "Dibatalkan" && (
                              <Ionicons
                                name="chevron-forward-circle"
                                size={12}
                                color="white"
                              />
                            )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
  tabsContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#102A63",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#102A63",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#102A63",
  },
  scrollContent: {
    padding: 16,
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    ...Platform.select({
      web: { cursor: "pointer", outlineStyle: "none" } as any,
    }),
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#102A63",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  tableCell: {
    paddingHorizontal: 6,
    fontSize: 12,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
});
