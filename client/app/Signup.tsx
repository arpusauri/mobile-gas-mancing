import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import BackgroundLayout from "../components/BackgroundLayout";
import { api } from "../api/config";

const { width, height } = Dimensions.get("window");

const isSmallScreen = height < 700;
const padding = isSmallScreen ? 15 : 25;
const paddingTop = isSmallScreen ? 20 : 40;

const InputField = ({
  icon,
  placeholder,
  isPassword = false,
  iconColor,
  value,
  onChangeText,
}: any) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={isPassword}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    if (typeof err === "string") {
      return err;
    }
    return "Gagal membuat akun";
  };

  const handleSignUp = async () => {
    console.log("DEBUG: States:", { email, username, phone, password });

    // 1. Validasi Input
    if (!email || !username || !phone || !password) {
      setError("Semua field harus diisi!");
      return;
    }

    if (email.indexOf("@") === -1) {
      setError("Email tidak valid!");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        nama_lengkap: username,
        email: email,
        password: password,
        no_telepon: phone,
      };

      console.log("📡 Mengirim data ke server...");
      const response = await api.auth.signup(payload);
      console.log("✅ Signup berhasil:", response);

      // Fungsi untuk membersihkan form dan pindah halaman
      const finalizeSignup = () => {
        setEmail("");
        setUsername("");
        setPhone("");
        setPassword("");
        router.replace("/Signin");
      };

      // 2. Penanganan Notifikasi & Navigasi Berdasarkan Platform
      if (Platform.OS === "web") {
        // Di Web, gunakan browser alert agar pasti muncul
        alert("Pendaftaran Berhasil! Akun Anda telah terdaftar.");
        finalizeSignup();
      } else {
        // Di Mobile (Android/iOS), gunakan Alert Native yang rapi
        Alert.alert(
          "Pendaftaran Berhasil",
          "Akun Anda telah terdaftar. Silakan masuk untuk melanjutkan.",
          [
            {
              text: "Login Sekarang",
              onPress: finalizeSignup,
            },
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.error("Signup error detail:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // Jika error bukan karena validasi (misal network error), tampilkan alert error
      if (Platform.OS === "web") {
        alert("Error: " + errorMessage);
      } else {
        Alert.alert("Gagal", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: padding, paddingTop: paddingTop },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require("../assets/icon/logo_halaman_depan.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Gas Mancing</Text>
          </View>

          {/* PAGE TITLE */}
          <Text style={styles.pageTitle}>Sign Up</Text>

          {/* ERROR MESSAGE */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          ) : null}

          {/* FORM CARD DENGAN GRADIENT */}
          <LinearGradient
            colors={["#2A5CA8", "#06162e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            {/* 1. Email */}
            <InputField
              icon="mail"
              placeholder="Enter your email"
              iconColor="#000000"
              value={email}
              onChangeText={setEmail}
            />

            {/* 2. Username */}
            <InputField
              icon="person"
              placeholder="Enter your username"
              iconColor="#000000"
              value={username}
              onChangeText={setUsername}
            />

            {/* 3. Phone */}
            <InputField
              icon="call"
              placeholder="Enter your phone"
              iconColor="#000000"
              value={phone}
              onChangeText={setPhone}
            />

            {/* 4. Password */}
            <InputField
              icon="lock-closed"
              placeholder="Enter your password"
              isPassword={true}
              iconColor="#000000"
              value={password}
              onChangeText={setPassword}
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInRow}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/Signin")}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: "black",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },

  // TITLE
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 25,
  },

  // ERROR BOX
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  errorMessage: {
    marginLeft: 10,
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  // CARD (Gradient Style)
  formCard: {
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "100%",
    elevation: 15,
    shadowColor: "#051226",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  // INPUT
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  iconWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },

  // BUTTON
  submitButton: {
    backgroundColor: "#6495ED",
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  // SIGN IN LINK
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  signInText: {
    color: "white",
    fontSize: 12,
  },
  signInLink: {
    color: "#6495ED",
    fontWeight: "bold",
    fontSize: 12,
  },
});
