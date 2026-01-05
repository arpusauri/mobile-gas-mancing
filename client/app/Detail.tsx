import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HeaderCarousel from "../components/HeaderCarousel";
import { api } from "../api/config";

const { width } = Dimensions.get("window");

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const data = await api.places.getById(params.id);
        setPlace(data);
      } catch (err) {
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPlace();
  }, [params.id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#133E87" />
      </View>
    );
  }

  /* ================= ERROR ================= */
  if (error || !place) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>{error || "Data tidak ditemukan"}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= HEADER IMAGES ================= */
  const headerImages =
    place.images && place.images.length > 0
      ? place.images
      : [place.image_url || "https://via.placeholder.com/800"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        >
          {/* ================= HEADER ================= */}
          <View style={styles.headerContainer}>
            <HeaderCarousel images={headerImages} height={350} />

            <View style={styles.headerOverlay} pointerEvents="box-none">
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={styles.gradientBottom}
                pointerEvents="none"
              />

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.headerInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerTitle}>{place.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="location-outline" size={16} color="#ddd" />
                    <Text style={styles.headerLocation}>{place.location}</Text>
                  </View>
                </View>

                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#F1C94D" />
                  <Text style={styles.ratingText}>
                    {place.average_rating || "0.0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================= BODY ================= */}
          <View style={styles.bodyContainer}>
            <Text style={styles.sectionTitle}>Tentang Lokasi</Text>
            <Text style={styles.descriptionText}>
              {place.full_description || place.description}
            </Text>

            <View style={styles.divider} />

            {/* ================= FASILITAS ================= */}
            {place.fasilitas?.length > 0 && (
              <>
                <Text style={styles.subHeader}>Fasilitas</Text>
                <View style={styles.facilitiesRow}>
                  {place.fasilitas.map((item, idx) => (
                    <View key={idx} style={styles.facilityChip}>
                      <Text style={styles.facilityText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.divider} />
              </>
            )}

            {/* ================= ITEM SEWA ================= */}
            {place.item_sewa?.length > 0 && (
              <>
                <Text style={styles.subHeader}>Peralatan Tambahan</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {place.item_sewa.map((item, idx) => (
                    <View key={idx} style={styles.equipmentCard}>
                      <LinearGradient
                        colors={["#2A549E", "#133E87"]}
                        style={styles.equipmentBg}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          {item.nama_item}
                        </Text>
                      </LinearGradient>
                      <View style={styles.equipmentLabel}>
                        <Text style={{ color: "white", fontSize: 11 }}>
                          Rp {item.price?.toLocaleString("id-ID")} /{" "}
                          {item.price_unit}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.divider} />
              </>
            )}
          </View>
        </ScrollView>

        {/* ================= FOOTER ================= */}
        <View style={styles.bottomFooter}>
          <View>
            <Text style={styles.priceLabel}>Harga Mulai</Text>
            <Text style={styles.priceText}>
              Rp {place.base_price?.toLocaleString("id-ID")}
              <Text style={styles.priceUnit}> / {place.price_unit}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              router.push({
                pathname: "/Booking",
                params: { id: place.id_tempat },
              })
            }
          >
            <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 10, color: "#FF6B6B", fontSize: 16 },
  backBtn: {
    marginTop: 15,
    backgroundColor: "#133E87",
    padding: 12,
    borderRadius: 8,
  },
  backBtnText: { color: "white", fontWeight: "bold" },

  headerContainer: { height: 350 },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    height: 150,
    left: 0,
    right: 0,
  },
  backButton: {
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "white" },
  headerLocation: { color: "#ddd", marginLeft: 4 },
  ratingBadge: { backgroundColor: "white", padding: 8, borderRadius: 20 },
  ratingText: { fontWeight: "bold" },

  bodyContainer: { padding: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  descriptionText: { color: "#666", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  subHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  facilitiesRow: { flexDirection: "row", flexWrap: "wrap" },
  facilityChip: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: { color: "#133E87", fontWeight: "600", fontSize: 12 },

  equipmentCard: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
  },
  equipmentBg: { flex: 1, justifyContent: "center", alignItems: "center" },
  equipmentLabel: {
    height: 30,
    backgroundColor: "#133E87",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#133E87",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { color: "#B0C4DE", fontSize: 12 },
  priceText: { color: "white", fontSize: 20, fontWeight: "bold" },
  priceUnit: { color: "#B0C4DE", fontSize: 12 },
  bookButton: { backgroundColor: "white", padding: 14, borderRadius: 25 },
  bookButtonText: { color: "#133E87", fontWeight: "bold" },
});
