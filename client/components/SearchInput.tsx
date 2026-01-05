import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SearchInput() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [facilities, setFacilities] = useState("");

  const handleSearch = () => {
    router.push({
      pathname: "/Search",
      params: {
        location: location.trim(),
        priceMin,
        priceMax,
        facilities: facilities.trim(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* BARIS 1: Lokasi */}
      <View style={styles.inputFullWidth}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#133E87"
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Mau mancing dimana?"
          placeholderTextColor="#999"
          style={[
            styles.textInputClean,
            Platform.OS === "web" && { outlineStyle: "none" },
          ]}
        />
      </View>

      {/* BARIS 2: Harga */}
      <View style={styles.rowPrice}>
        <View style={styles.inputHalf}>
          <Ionicons
            name="wallet-outline"
            size={18}
            color="#133E87"
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={priceMin}
            onChangeText={setPriceMin}
            placeholder="Harga Min"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            style={styles.textInputClean}
          />
        </View>

        <View style={{ width: 10 }} />

        <View style={styles.inputHalf}>
          <Ionicons
            name="wallet-outline"
            size={18}
            color="#133E87"
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={priceMax}
            onChangeText={setPriceMax}
            placeholder="Harga Max"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            style={styles.textInputClean}
          />
        </View>
      </View>

      {/* BARIS 3: Fasilitas */}
      <View style={styles.inputFullWidth}>
        <Ionicons
          name="business-outline"
          size={20}
          color="#133E87"
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={facilities}
          onChangeText={setFacilities}
          placeholder="Fasilitas"
          placeholderTextColor="#AAA"
          style={styles.textInputClean}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.btnText}>Cari</Text>
        <Ionicons
          name="search"
          size={22}
          color="white"
          style={{ position: "absolute", right: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
}

/* === STYLE TETAP SAMA === */
const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  inputFullWidth: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  rowPrice: { flexDirection: "row", marginBottom: 10 },
  inputHalf: {
    flex: 1,
    backgroundColor: "white",
    height: 45,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  textInputClean: {
    flex: 1,
    color: "#333",
    height: "100%",
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  searchButton: {
    backgroundColor: "#608BC1",
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 3,
    marginTop: 5,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
