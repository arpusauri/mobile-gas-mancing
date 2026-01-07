import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  transparent?: boolean;
  textColor?: string; // warna teks judul
  backButtonStyle?: ViewStyle; // style tombol kembali
  backIconColor?: string; // warna arrow
  showCart?: boolean;
  showBackButton?: boolean; // ✅ BARU: untuk show/hide tombol kembali
}

export default function CustomHeader({
  title,
  transparent = false,
  textColor = "#000",
  backButtonStyle,
  backIconColor = "#000",
  showCart = false,
  showBackButton = true, // ✅ DEFAULT true agar tidak break komponen lain
}: CustomHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerTopBar,
        {
          height: insets.top + 60,
          paddingTop: insets.top,
          backgroundColor: transparent ? "transparent" : "white",
          borderBottomWidth: transparent ? 0 : 1,
          borderBottomColor: "#F1F5F9",
        },
      ]}
    >
      {/* Tombol Kembali - Hanya tampil jika showBackButton = true */}
      {showBackButton && (
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 8 }, backButtonStyle]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={backIconColor} />
        </TouchableOpacity>
      )}

      {/* Judul Tengah */}
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showCart && (
            <Ionicons
              name="cart"
              size={22}
              color="#102A63"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.headerTitleText, { color: textColor }]}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTopBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  },
  backButton: {
    position: "absolute",
    left: 15,
    width: 40,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 2,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
  },
});
