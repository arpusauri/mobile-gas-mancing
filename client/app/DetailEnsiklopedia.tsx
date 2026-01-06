import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { api, API_URL } from "../api/config";

const { height, width } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.55;

type ArtikelDetail = {
  id_artikel: string | number;
  judul: string;
  description: string;
  image_url?: string;
  tgl_terbit?: string;
};

export default function DetailEnsiklopediaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [artikel, setArtikel] = useState<ArtikelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const artikelId = params.id as string; // ambil id dari params

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        setLoading(true);
        const data = await api.ensiklopedia.getById(artikelId); // panggil API backend
        setArtikel(data);
      } catch (err) {
        console.error("Gagal mengambil detail artikel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtikel();
  }, [artikelId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#133E87" />
        <Text style={{ marginTop: 10, color: "#666" }}>Memuat artikel...</Text>
      </View>
    );
  }

  if (!artikel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Tidak dapat menampilkan artikel</Text>
      </View>
    );
  }

  const imageUri = artikel.image_url
    ? `${API_URL}/uploads/${artikel.image_url.trim()}`
    : "https://via.placeholder.com/400";

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.headerImage}
            resizeMode="cover"
          />

          <View style={styles.gradientOverlay} pointerEvents="none">
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
              style={styles.topGradient}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.bottomGradient}
            />
          </View>

          {/* Navbar */}
          <View style={styles.headerTopBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons
                name="book"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitleText}>Detail Ensiklopedia</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Nama Artikel */}
          <View style={styles.fishNameWrapper} pointerEvents="none">
            <Text style={styles.fishNameText}>{artikel.judul}</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          {/* TANGGAL TERBIT */}
          {artikel.tgl_terbit && (
            <Text style={styles.tanggalTerbitText}>
              Terbit:{" "}
              {new Date(artikel.tgl_terbit).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          )}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {artikel.description ||
              "Tidak ada deskripsi tersedia untuk artikel ini."}
          </Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5F7FA" },
  scrollContent: { paddingBottom: 40 },

  // HEADER
  headerContainer: {
    height: HEADER_HEIGHT,
    width: "100%",
    position: "relative",
    backgroundColor: "#000",
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    zIndex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  topGradient: { height: 120, width: "100%" },
  bottomGradient: { height: 160, width: "100%" },

  // Navbar
  headerTopBar: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerTitleText: { fontSize: 16, fontWeight: "bold", color: "white" },

  // Nama artikel
  fishNameWrapper: {
    position: "absolute",
    bottom: 50,
    left: 25,
    right: 25,
    zIndex: 5,
  },
  fishNameText: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  // CONTENT
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    marginTop: -35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    minHeight: height * 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2937",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
    textAlign: "justify",
  },
  tanggalTerbitText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 10,
  },
});