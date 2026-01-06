import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomHeader from "../components/CustomHeader";
import FooterBPC from "../components/FooterBPC";
import { API_URL, api } from "../api/config";

const width = Dimensions.get("window").width;

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        if (!params.id) return;

        const data = await api.places.getById(params.id);
        setPlace(data);
      } catch (err: any) {
        console.error("FETCH PLACE ERROR:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [params.id]);

  // ==========================================
  // STATE & LOGIKA
  // ==========================================
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(1);
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const mainImage = place?.images?.[0]
    ? `${API_URL}/uploads/${place.images[0].trim()}`
    : "https://via.placeholder.com/800";

  const [equipment, setEquipment] = useState<any[]>([]);

  useEffect(() => {
    if (place?.item_sewa?.length > 0) {
      const eq = place.item_sewa.map((item: any) => ({
        id: item.id_item,
        name: item.nama_item,
        price: item.price,
        count: 0,
        image: item.image ? `${API_URL}/uploads/${item.image.trim()}` : null,
      }));
      setEquipment(eq);
    }
  }, [place]);

  // Hitung Harga
  useEffect(() => {
    if (!place) return; // Pastikan data place sudah ada

    // Ambil base price dari API, fallback ke 15000 kalau tidak ada
    const BASE_PRICE_PER_HOUR = place.base_price || 15000;

    // Total tiket = harga dasar * jumlah orang * durasi
    const ticketTotal = BASE_PRICE_PER_HOUR * people * duration;

    // Total equipment
    let equipmentTotal = 0;
    equipment.forEach((item) => {
      equipmentTotal += item.price * item.count;
    });

    // Total keseluruhan
    setTotalPrice(ticketTotal + equipmentTotal);
  }, [duration, people, equipment, place]);

  // Logic Tanggal
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === "android") setShowDatePicker(false);
    setDate(currentDate);
  };
  const formatDate = (rawDate: Date) => {
    return rawDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Logic Stepper
  const updateDuration = (type: "plus" | "minus") => {
    if (type === "plus") setDuration(duration + 1);
    if (type === "minus" && duration > 1) setDuration(duration - 1);
  };
  const updatePeople = (type: "plus" | "minus") => {
    if (type === "plus") setPeople(people + 1);
    if (type === "minus" && people > 1) setPeople(people - 1);
  };
  const updateEquipment = (id: number, type: "plus" | "minus") => {
    const newData = equipment.map((item) => {
      if (item.id === id) {
        if (type === "plus") return { ...item, count: item.count + 1 };
        if (type === "minus" && item.count > 0)
          return { ...item, count: item.count - 1 };
      }
      return item;
    });
    setEquipment(newData);
  };

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER IMAGE SINGLE */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri: place?.image_url
                ? `${API_URL}/uploads/${place.image_url.trim()}`
                : "https://via.placeholder.com/800",
            }}
            style={styles.headerImage}
            resizeMode="cover"
            onError={(e) => console.log("IMAGE ERROR:", e.nativeEvent.error)}
          />

          {/* Tombol Back & Judul */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <CustomHeader title="Booking" transparent={true} />
          </View>

          {/* Info Lokasi & Rating */}
          {place && (
            <View style={styles.headerInfo}>
              <View>
                <Text style={styles.locationTitle}>{place.title}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={16} color="white" />
                  <Text style={styles.locationSubtitle}>{place.location}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {place.average_rating
                      ? Number(place.average_rating).toFixed(1)
                      : "0.0"}
                  </Text>
                  <Text style={styles.ratingCount}>
                    ({place.review_count || 0})
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* FORM DETAIL */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Detail Booking</Text>
          <View style={styles.separator} />

          {/* Tanggal */}
          <Text style={styles.label}>Tanggal</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#1F2937" />
            {Platform.OS === "web" ? (
              <View style={styles.webInputOverlay}>
                {React.createElement("input", {
                  type: "date",
                  value: date.toISOString().split("T")[0],
                  onChange: (e: any) => setDate(new Date(e.target.value)),
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 100,
                  },
                })}
              </View>
            ) : (
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => setShowDatePicker(true)}
              />
            )}
          </View>

          {Platform.OS !== "web" && showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* 2. DURASI */}
          {place?.price_unit === "Jam" && (
            <>
              <Text style={styles.label}>Durasi (Jam)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>{duration}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.spinnerContainer}>
                    <TouchableOpacity
                      onPress={() => updateDuration("plus")}
                      style={styles.spinnerUp}
                    >
                      <Ionicons name="caret-up" size={12} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateDuration("minus")}
                      style={styles.spinnerDown}
                    >
                      <Ionicons name="caret-down" size={12} color="#555" />
                    </TouchableOpacity>
                  </View>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#1F2937"
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            </>
          )}

          {/* Jumlah Orang */}
          <Text style={styles.label}>Jumlah Orang</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>{people}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.spinnerContainer}>
                <TouchableOpacity
                  onPress={() => updatePeople("plus")}
                  style={styles.spinnerUp}
                >
                  <Ionicons name="caret-up" size={12} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updatePeople("minus")}
                  style={styles.spinnerDown}
                >
                  <Ionicons name="caret-down" size={12} color="#555" />
                </TouchableOpacity>
              </View>
              <Ionicons
                name="people-outline"
                size={20}
                color="#1F2937"
                style={{ marginLeft: 10 }}
              />
            </View>
          </View>
        </View>

        {/* Peralatan Tambahan */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Peralatan Tambahan</Text>
          <View style={styles.gridContainer}>
            {equipment.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{
                    uri: item.image || "https://via.placeholder.com/120",
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardPrice}>
                    Rp.{item.price.toLocaleString()}
                  </Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => updateEquipment(item.id, "minus")}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterText}>{item.count}</Text>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => updateEquipment(item.id, "plus")}
                    >
                      <Text style={{ color: "#0056b3" }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER */}
      <FooterBPC
        totalPrice={totalPrice}
        buttonLabel="Lanjut Ke Pembayaran"
        onPress={() => {
          router.push({
            pathname: "/Payment",
            params: {
              total: totalPrice,
              people: people,
              date: formatDate(date),
              equipment: JSON.stringify(equipment),
            },
          });
        }}
      />
    </GestureHandlerRootView>
  );
}
// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  webInputOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    width: "100%",
    height: "100%",
  },
  // HEADER
  headerContainer: {
    height: 375,
    width: "100%",
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1, // Tetap di atas gambar
  },
  headerInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 2,
  },
  locationTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationSubtitle: {
    color: "white",
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  ratingCount: {
    fontSize: 10,
    color: "#666",
  },
  // SECTION
  sectionContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
    marginTop: 10,
  },
  // INPUT
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    height: 44,
    position: "relative",
  },
  inputText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  spinnerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#EEE",
    paddingRight: 8,
  },
  spinnerUp: {
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  spinnerDown: {
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  // GRID
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },
  cardContent: {
    alignItems: "center",
    width: "100%",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardPrice: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  counterBtn: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontWeight: "bold",
  },
});
