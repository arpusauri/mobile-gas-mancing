import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, api } from "../api/config";

type SearchParams = {
  location?: string;
  priceMin?: string;
  priceMax?: string;
  facilities?: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<SearchParams>();

  const { location, priceMin, priceMax, facilities } = params;

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= HANDLE SEARCH =================
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Panggil API search
      const results = await api.places.search(
        location || "",
        priceMin || "",
        priceMax || "",
        facilities || ""
      );

      console.log("Search results:", results);

      setSearchResults(results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Gagal mencari tempat");
    } finally {
      setLoading(false);
    }
  }, [location, priceMin, priceMax, facilities]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // ================= HANDLE PRESS =================
  const handlePress = (placeId: number) => {
    router.push({
      pathname: "/Detail",
      params: { id: placeId },
    });
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }: { item: any }) => {
    const imageUri =
      item.image_url && typeof item.image_url === "string"
        ? `${API_URL}/uploads/${item.image_url.trim()}`
        : "https://via.placeholder.com/300";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress(item.id_tempat)}
      >
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.title}</Text>
          <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
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
          <View style={styles.topNavRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.logoText}>Hasil Pencarian</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.titleContainer}>
              <Text style={styles.pageTitle}>Rekomendasi Spot Mancing</Text>
              {!loading && (
                <Text style={styles.subTitle}>
                  {searchResults.length} tempat ditemukan
                </Text>
              )}
            </View>

            {loading && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#133E87" />
                <Text style={{ marginTop: 10 }}>Mencari tempat...</Text>
              </View>
            )}

            {error && !loading && (
              <View style={styles.centerContainer}>
                <Ionicons name="alert-circle" size={40} color="#FF6B6B" />
                <Text>{error}</Text>
              </View>
            )}

            {!loading && !error && searchResults.length === 0 && (
              <View style={styles.centerContainer}>
                <Ionicons name="search" size={48} color="#CCC" />
                <Text>Data tidak ditemukan</Text>
              </View>
            )}

            {!loading && searchResults.length > 0 && (
              <FlatList
                scrollEnabled={false}
                data={searchResults}
                keyExtractor={(item) => item.id_tempat.toString()}
                renderItem={renderItem}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { padding: 20 },
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: { color: "white", fontSize: 16, fontWeight: "bold" },

  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: { padding: 20 },
  pageTitle: { fontSize: 18, fontWeight: "bold", color: "#133E87" },
  subTitle: { fontSize: 12, color: "#666" },

  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: { height: 140, width: "100%" },
  cardContent: { padding: 12 },
  cardName: { fontWeight: "bold", fontSize: 14 },
  cardLocation: { fontSize: 12, color: "#666" },
});
