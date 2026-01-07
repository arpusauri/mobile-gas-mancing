import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";

// ✅ 1. Import useRouter
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SearchInput from "../../components/SearchInput";
import { api, API_URL } from "../../api/config";

const PLACEHOLDER_IMAGE = require("../../assets/images/tempat1.jpg");

interface PopularSpot {
  id: number;
  nama: string;
  lokasi: string;
  harga: number;
  rating: number;
  jumlah_ulasan: number;
  gambar: string | null;
}

interface Tip {
  id_artikel: number;
  judul: string;
  deskripsi: string;
}

export default function HomeScreen() {
  const router = useRouter();

  const [popularSpots, setPopularSpots] = useState<PopularSpot[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);

  const params = useLocalSearchParams();
  const idArtikel = params.id;

  const fetchPopularSpots = async () => {
    try {
      const response = await api.places.getAll();
      // console.log("DATA DARI API:", response);

      const normalized: PopularSpot[] = response.map((item: any) => ({
        id: item.id_tempat || item.id,
        nama: item.title || item.nama || "Tanpa Nama",
        lokasi: item.location || item.lokasi || "-",
        harga: Number(item.base_price || item.harga || 0),
        rating: Number(item.average_rating || item.rating || 0),
        jumlah_ulasan: Number(
          item.total_reviews_count || item.jumlah_ulasan || 0
        ),
        gambar: item.image_url ? `${API_URL}/uploads/${item.image_url}` : null,
      }));

      const sorted = normalized.sort((a, b) => b.rating - a.rating);
      setPopularSpots(sorted.slice(0, 5));
    } catch (error) {
      console.error("Error fetch tempat populer:", error);
    }
  };

  const fetchTips = async () => {
    try {
      const data = await api.ensiklopedia.getAll();
      setTips(data || []);
    } catch (error) {
      console.error("Error fetch tips:", error);
    }
  };

  useEffect(() => {
    fetchPopularSpots();
    fetchTips();
  }, []);

  // ✅ 3. Fungsi Navigasi ke Detail
  const handlePressDetail = (id: number) => {
    router.push({
      pathname: "/Detail",
      params: { id: id }, // Kirim ID tempat
    });
  };

  return (
    <LinearGradient
      colors={["#133E87", "#050F21"]}
      locations={[0.1, 0.4]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.fixedHeader}>
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/icon/logo_header_putih.png")}
              style={{ width: 32, height: 18, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Gas Mancing</Text>
          </View>
          <SearchInput />
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 25 }}
          >
            {/* TEMPAT POPULER */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tempat Populer</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 20 }}
            >
              {popularSpots.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.cardPopular}
                  // ✅ 4. Pasang OnPress ke Detail
                  onPress={() => handlePressDetail(item.id)}
                >
                  <ImageBackground
                    source={
                      item.gambar ? { uri: item.gambar } : PLACEHOLDER_IMAGE
                    }
                    style={styles.cardImage}
                    imageStyle={{ borderRadius: 20 }}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.nama}</Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          <Ionicons
                            name="location-sharp"
                            size={12}
                            color="white"
                          />
                          <Text style={styles.cardLocation}>{item.lokasi}</Text>
                        </View>
                      </View>

                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#F1C94D" />
                        <Text style={styles.ratingText}>
                          {item.rating.toFixed(1)}{" "}
                          <Text style={{ color: "#999", fontWeight: "normal" }}>
                            ({item.jumlah_ulasan})
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>
                        Rp. {item.harga.toLocaleString("id-ID")}/hari
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* TIPS MANCING */}
            <View style={[styles.sectionHeader, { marginTop: 25 }]}>
              <Text style={styles.sectionTitle}>Tips Mancing</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 20 }}
            >
              {tips.map((item) => (
                <View key={item.id_artikel} style={styles.cardTips}>
                  <View style={styles.iconBox}>
                    <Ionicons name="book-outline" size={24} color="white" />
                  </View>

                  <Text style={styles.tipsTitle}>{item.judul}</Text>
                  <Text style={styles.tipsDesc} numberOfLines={3}>
                    {item.deskripsi}
                  </Text>

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/DetailEnsiklopedia",
                        params: { id: item.id_artikel },
                      })
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 12,
                        color: "#133E87",
                        marginRight: 5,
                      }}
                    >
                      Baca Selengkapnya
                    </Text>
                    <Ionicons name="arrow-forward" size={12} color="#133E87" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* BANNER */}
            <View style={styles.bannerBox}>
              <Text style={styles.bannerTitle}>Daftarkan Properti Anda!</Text>
              <Text style={styles.bannerDesc}>
                Bergabunglah menjadi mitra kami.
              </Text>
              <TouchableOpacity
                style={styles.bannerBtn}
                // ✅ 5. Pasang OnPress ke Mitra
                onPress={() => router.push("/Mitra")}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                >
                  Gabung Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: { color: "white", fontSize: 20, fontWeight: "bold" },

  contentContainer: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },

  cardPopular: {
    width: 260,
    height: 320,
    marginRight: 15,
    borderRadius: 20,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: 15,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  cardLocation: {
    fontSize: 12,
    color: "white",
    marginLeft: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ratingBadge: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  ratingText: { fontSize: 11, fontWeight: "bold", marginLeft: 3 },
  priceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceText: { fontSize: 12, fontWeight: "bold", color: "#000" },

  cardTips: {
    width: 160,
    height: 180,
    backgroundColor: "white",
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    justifyContent: "space-between",
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#133E87",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  tipsTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 2 },
  tipsDesc: { fontSize: 11, color: "#666", lineHeight: 16 },

  bannerBox: {
    backgroundColor: "#D9D9D9",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: "flex-start",
  },
  bannerTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  bannerDesc: { fontSize: 12, color: "#444", marginBottom: 15 },
  bannerBtn: {
    backgroundColor: "#133E87",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
});