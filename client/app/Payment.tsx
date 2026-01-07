import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import FooterBPC from "../components/FooterBPC";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Helper untuk ambil string
  const getStringParam = (
    value: string | string[] | undefined,
    fallback = ""
  ) => {
    if (Array.isArray(value)) return value[0] || fallback;
    return value ?? fallback;
  };

  const totalHarga = getStringParam(params.total, "0");

  // UI States
  const [isVaOpen, setIsVaOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [paymentLabel, setPaymentLabel] = useState<null | string>(null);
  const [selectedBank, setSelectedBank] = useState("");

  const handleToConfirmation = () => {
    if (!paymentLabel || !selectedBank) {
      Alert.alert(
        "Pilih Pembayaran",
        "Silakan pilih metode pembayaran terlebih dahulu."
      );
      return;
    }

    // Teruskan semua data dari BookingScreen + data Pembayaran ke Confirmation
    router.push({
      pathname: "/Confirmation",
      params: {
        // Data lama (Pass-through)
        placeId: params.placeId,
        placeName: params.placeName,
        date: params.date,
        duration: params.duration,
        people: params.people,
        total: params.total,
        equipment: params.equipment, // Tetap dalam bentuk JSON string

        // Data Baru (Pembayaran)
        paymentMethod: paymentLabel,
        bankName: selectedBank,
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Pembayaran" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topInfoCard}>
          <View>
            <Text style={styles.infoLabel}>Total Harga</Text>
            <Text style={styles.infoValueMain}>
              Rp.{Number(totalHarga).toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.infoLabel}>Tempat</Text>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumberText}>
                {getStringParam(params.placeName, "Booking")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSectionCard}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>

          {/* Virtual Account */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              isVaOpen && styles.dropdownHeaderActive,
            ]}
            onPress={() => {
              setIsVaOpen(!isVaOpen);
              setIsQrOpen(false);
            }}
          >
            <Text style={styles.dropdownTitleText}>Virtual Account</Text>
            <Ionicons
              name={isVaOpen ? "caret-up" : "caret-down"}
              size={18}
              color="#4B5563"
            />
          </TouchableOpacity>

          {isVaOpen && (
            <View style={styles.dropdownContent}>
              {[
                {
                  name: "BRI",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/1280px-BANK_BRI_logo.svg.png",
                },
                {
                  name: "BCA",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png",
                },
                { 
                  id: 'mandiri', 
                  name: 'Mandiri', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png' 
                },
              ].map((bank) => (
                <TouchableOpacity
                  key={bank.name}
                  style={styles.bankItem}
                  onPress={() => {
                    setPaymentLabel("Virtual Account");
                    setSelectedBank(bank.name);
                  }}
                >
                  <View style={styles.bankLogoPlaceholder}>
                    <Image
                      source={{ uri: bank.logo }}
                      style={styles.bankImage}
                    />
                  </View>
                  <Text style={styles.bankNameText}>{bank.name}</Text>
                  <View style={styles.radioButtonContainer}>
                    <View style={styles.radioButton}>
                      {selectedBank === bank.name && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* QR Code */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { marginTop: 15 },
              isQrOpen && styles.dropdownHeaderActive,
            ]}
            onPress={() => {
              setIsQrOpen(!isQrOpen);
              setIsVaOpen(false);
            }}
          >
            <Text style={styles.dropdownTitleText}>QR Code</Text>
            <Ionicons
              name={isQrOpen ? "caret-up" : "caret-down"}
              size={18}
              color="#4B5563"
            />
          </TouchableOpacity>

          {isQrOpen && (
            <View style={styles.dropdownContent}>
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => {
                  setPaymentLabel("QR Code");
                  setSelectedBank("QRIS");
                }}
              >
                <View style={styles.bankLogoPlaceholder}>
                  <Image
                    source={{
                      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png",
                    }}
                    style={styles.bankImage}
                  />
                </View>
                <Text style={styles.bankNameText}>QRIS</Text>
                <View style={styles.radioButtonContainer}>
                  <View style={styles.radioButton}>
                    {selectedBank === "QRIS" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <FooterBPC
        buttonLabel={
          paymentLabel
            ? `Bayar Dengan ${selectedBank}`
            : "Pilih Metode Pembayaran"
        }
        disabled={!paymentLabel}
        onPress={handleToConfirmation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  topInfoCard: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  infoLabel: { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  infoValueMain: { fontSize: 20, fontWeight: "bold", color: "#000" },
  orderNumberBadge: {
    backgroundColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderNumberText: { fontSize: 14, fontWeight: "bold", color: "#1F2937" },
  paymentSectionCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
  dropdownHeaderActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  dropdownTitleText: { fontSize: 16, fontWeight: "600", color: "#000" },
  dropdownContent: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    backgroundColor: "#fff",
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  bankLogoPlaceholder: {
    width: 60,
    height: 35,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  bankImage: { width: 40, height: 20, resizeMode: "contain" },
  bankNameText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#000" },
  radioButtonContainer: {
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#102A63",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#102A63",
  },
});
