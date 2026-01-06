import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { API_URL, api } from "../api/config";

type Review = {
  id: number;
  userId: number;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  date: string;
};

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Helper function untuk generate full URL gambar
  const getFullImageUrl = (img: string | undefined) => {
    if (!img) return "https://via.placeholder.com/800";

    const trimmed = img.trim();

    // Pastikan pakai folder uploads/
    return trimmed.startsWith("http")
      ? trimmed
      : `${API_URL}/uploads/${trimmed}`;
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const data = await api.places.getById(params.id);
        setPlace(data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPlace();
  }, [params.id]);

  useEffect(() => {
    const fetchDetailAndReviews = async () => {
      try {
        setLoading(true);
        setLoadingReviews(true);

        // 1️⃣ Ambil detail tempat
        const placeData = await api.places.getById(params.id as string);
        setPlace(placeData);

        // 2️⃣ Ambil review untuk tempat ini
        const reviewResponse = await api.review.getByPlaceId(
          params.id as string
        );

        // Jika API return { success, data: [...] }
        const reviewList = reviewResponse?.data || reviewResponse || [];
        setReviews(reviewList);
      } catch (err) {
        console.error("Gagal ambil detail & review:", err);
        setError("Gagal mengambil data tempat atau review");
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };

    if (params.id) fetchDetailAndReviews();
  }, [params.id]);

  /* LOADING */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#133E87" />
      </View>
    );
  }

  /* ERROR */
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

  /* IMAGE HEADER */
  const singleImage = getFullImageUrl(place.image_url);

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
          {/* HEADER IMAGE */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: getFullImageUrl(place.image_url) }}
              style={{ width: "100%", height: 350 }}
              resizeMode="cover"
              onError={(e) => console.log("IMAGE ERROR:", e.nativeEvent.error)}
            />
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

          {/* BODY */}
          <View style={styles.bodyContainer}>
            <Text style={styles.sectionTitle}>Tentang Lokasi</Text>
            <Text style={styles.descriptionText}>
              {place.full_description || place.description}
            </Text>

            <View style={styles.divider} />

            {/* FASILITAS */}
            {place.fasilitas?.length > 0 && (
              <>
                <Text style={styles.subHeader}>Fasilitas</Text>
                <View style={styles.facilitiesRow}>
                  {place.fasilitas.map((item: string, idx: number) => (
                    <View key={idx} style={styles.facilityChip}>
                      <Text style={styles.facilityText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.divider} />
              </>
            )}

            {/* ITEM SEWA */}
            {place.item_sewa?.length > 0 && (
              <>
                <Text style={styles.subHeader}>Peralatan Tambahan</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {place.item_sewa.map((item: any, idx: number) => (
                    <View key={idx} style={styles.equipmentCard}>
                      <Image
                        source={{ uri: getFullImageUrl(item.image_url) }}
                        style={styles.equipmentBg}
                        resizeMode="cover"
                        onError={(e) =>
                          console.log(
                            "ITEM SEWA IMAGE ERROR:",
                            e.nativeEvent.error
                          )
                        }
                      />
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

            {/* ULASAN */}
            <Text style={styles.subHeader}>Ulasan Pengunjung</Text>

            {loadingReviews ? (
              <ActivityIndicator
                size="small"
                color="#133E87"
                style={{ marginTop: 10 }}
              />
            ) : reviews.length === 0 ? (
              <Text style={{ color: "#666" }}>
                Belum ada ulasan untuk tempat ini.
              </Text>
            ) : (
              <View style={styles.reviewList}>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View>
                          <Text style={styles.reviewerName}>
                            {review.userName}
                          </Text>
                          <View style={styles.reviewRatingRow}>
                            <Ionicons name="star" size={12} color="#F1C94D" />
                            <Text style={styles.reviewRatingText}>
                              {review.rating}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
                      {new Date(review.date).toLocaleDateString("id-ID")}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* FOOTER */}
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

/* STYLES */
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

  // ULASAN
  reviewList: { marginTop: 5 },
  reviewCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#ddd",
  },
  reviewerName: { fontWeight: "bold", fontSize: 14, color: "#333" },
  reviewRatingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
    color: "#555",
  },
  reviewComment: { fontSize: 13, color: "#444", lineHeight: 20 },

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
