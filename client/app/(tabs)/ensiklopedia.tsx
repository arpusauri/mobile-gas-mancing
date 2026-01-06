import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api, API_URL } from "../../api/config";

// --- TYPE ARTIKEL ---
type Artikel = {
  id_artikel: number | string;
  judul: string;
  description?: string;
  image_url?: string; // gunakan ini langsung
};

// --- KOMPONEN KARTU ---
const FishCard: React.FC<{ item: Artikel }> = ({ item }) => {
  const [showDesc, setShowDesc] = useState(false);
  const router = useRouter();

  // langsung pakai image_url
  const imageSource = {
    uri: item.image_url
      ? `${API_URL}/uploads/${item.image_url.trim()}`
      : "https://via.placeholder.com/300",
  };

  const handleDetailPress = () => {
    router.push({
      pathname: "/DetailEnsiklopedia",
      params: {
        id: item.id_artikel,
        name: item.judul,
        image: imageSource.uri,
        description: item.description,
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setShowDesc(!showDesc)}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={imageSource}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />
        {showDesc ? (
          <View style={styles.descriptionOverlay}>
            <Text style={styles.descTitle}>{item.judul}</Text>
            <Text style={styles.descText} numberOfLines={4}>
              {item.description || "Tidak ada deskripsi"}
            </Text>
            <Text style={styles.tapHint}>(Ketuk lagi untuk menutup)</Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Text style={styles.fishName}>{item.judul}</Text>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={handleDetailPress}
            >
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

// --- KOMPONEN UTAMA ---
export default function EncyclopediaScreen() {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Artikel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data: Artikel[] = await api.ensiklopedia.getAll();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Gagal mengambil data");
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.judul.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={24} color="#133E87" />
        <Text style={styles.headerTitle}>Ensiklopedia</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Cari artikel"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#133E87" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Memuat artikel...
          </Text>
        </View>
      ) : filteredArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Tidak ada artikel ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id_artikel.toString()}
          renderItem={({ item }) => <FishCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  cardContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  cardImage: { flex: 1, width: "100%", justifyContent: "flex-end" },
  gradientOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  cardContent: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  fishName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    maxWidth: "65%",
  },
  detailButton: {
    backgroundColor: "#133E87",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  detailButtonText: { color: "white", fontWeight: "600", fontSize: 12 },
  descriptionOverlay: {
    flex: 1,
    backgroundColor: "rgba(19, 62, 135, 0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  descTitle: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  descText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  tapHint: { color: "#DDD", fontSize: 10, marginTop: 15, fontStyle: "italic" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 12,
    backgroundColor: "#FFE5E5",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  errorText: {
    marginLeft: 10,
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, fontSize: 16, color: "#999" },
});
