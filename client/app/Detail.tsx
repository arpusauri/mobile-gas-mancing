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

  const getFullImageUrl = (img?: string) => {
    if (!img) return "https://via.placeholder.com/800";
    const trimmed = img.trim();
    return trimmed.startsWith("http")
      ? trimmed
      : `${API_URL}/uploads/${trimmed}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!params.id) return;
        const placeData = await api.places.getById(params.id as string);
        setPlace(placeData);

        const reviewResponse = await api.review.getByPlaceId(
          params.id as string
        );
        const reviewList = reviewResponse?.data || reviewResponse || [];
        setReviews(reviewList);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#133E87" />
      </View>
    );
  }

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
              style={styles.headerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={styles.gradientBottom}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Header info */}
            <View style={styles.headerInfo}>
              <View>
                <Text style={styles.headerTitle}>{place.title}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Ionicons name="location-outline" size={14} color="#ddd" />
                  <Text style={styles.headerLocation}>{place.location}</Text>
                </View>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F1C94D" />
                <Text style={styles.ratingText}>
                  {place.average_rating != null
                    ? parseFloat(place.average_rating).toFixed(1)
                    : "0.0"}
                </Text>
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
            <Text style={styles.subHeader}>Fasilitas</Text>
            {place.fasilitas && place.fasilitas.length > 0 ? (
              <View style={styles.facilitiesRow}>
                {place.fasilitas.map((item: string, idx: number) => (
                  <View key={idx} style={styles.facilityChip}>
                    <Text style={styles.facilityText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: "#666", fontStyle: "italic" }}>
                Tidak ada fasilitas
              </Text>
            )}
            <View style={styles.divider} />

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
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <View style={styles.reviewRatingRow}>
                      <Ionicons name="star" size={12} color="#F1C94D" />
                      <Text style={styles.reviewRatingText}>
                        {place.average_rating
                          ? Number(place.average_rating).toFixed(1)
                          : "0.0"}
                      </Text>
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

  headerContainer: { height: 350, position: "relative" },
  headerImage: { width: "100%", height: "100%" },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
  headerLocation: { color: "#ddd", fontSize: 14 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
    color: "#333",
  },

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

  reviewList: { marginTop: 5 },
  reviewCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
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
