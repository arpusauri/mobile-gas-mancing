import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  keyboardType = "default",
  autoCapitalize = "none",
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
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
    />
  </View>
);

export default function SignInScreen() {
  const router = useRouter();
  
  // Toggle Customer/Mitra
  const [userType, setUserType] = useState<'customer' | 'mitra'>('customer');
  
  // Form states
  const [email, setEmail] = useState("");
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
    return "Gagal login";
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (userType === 'customer') {
        // LOGIN CUSTOMER
        console.log("🔵 Attempting customer login...");
        const response = await api.auth.signin({
          email: email.trim(),
          password,
        });

        console.log("✅ Customer login response:", response);

        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userId", response.user.id_pengguna.toString());
        await AsyncStorage.setItem("userRole", "customer");
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));

        console.log("✅ Customer token saved, redirecting to /(tabs)...");

        router.replace("/(tabs)");
      } else {
        // LOGIN MITRA
        console.log("🟢 Attempting mitra login...");
        const response = await api.mitra.login({
          email: email.trim(),
          password,
        });

        console.log("✅ Mitra login response:", response);

        // Simpan dengan structure yang benar
        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userRole", "mitra");
        
        // Pastikan response.mitra ada
        if (response.mitra) {
          await AsyncStorage.setItem("userId", response.mitra.id_mitra.toString());
          await AsyncStorage.setItem("userData", JSON.stringify(response.mitra));
        }

        console.log("✅ Mitra token saved, redirecting to /(mitra)...");

        // Redirect ke mitra tabs
        router.replace("/(mitra)");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
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
          <Text style={styles.pageTitle}>Sign In</Text>

          {/* TOGGLE CUSTOMER / MITRA */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'customer' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('customer')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="person" 
                size={18} 
                color={userType === 'customer' ? '#fff' : '#666'} 
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  userType === 'customer' && styles.toggleButtonTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'mitra' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('mitra')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="business" 
                size={18} 
                color={userType === 'mitra' ? '#fff' : '#666'} 
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  userType === 'mitra' && styles.toggleButtonTextActive,
                ]}
              >
                Mitra
              </Text>
            </TouchableOpacity>
          </View>

          {/* ERROR MESSAGE */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          ) : null}

          {/* FORM CARD */}
          <LinearGradient
            colors={["#2A5CA8", "#06162e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            {/* Email */}
            <InputField
              icon="mail"
              placeholder="Enter your email"
              iconColor="#000000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password */}
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
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          {/* FOOTER LINKS */}
          <View style={styles.footerLinks}>
            {userType === 'customer' ? (
              <TouchableOpacity onPress={() => router.push("/Signup")}>
                <Text style={styles.linkText}>
                  Don't have an account?{" "}
                  <Text style={styles.boldLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.push("/FormMitra")}>
                <Text style={styles.linkText}>
                  Belum punya akun mitra?{" "}
                  <Text style={styles.boldLink}>Daftar Sekarang</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    marginBottom: 20,
  },

  // TOGGLE CUSTOMER/MITRA
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8EDF5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
    alignSelf: 'center',
    width: '80%',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#2A5CA8',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
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

  // CARD GRADIENT
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

  // INPUT STYLES
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

  // FOOTER LINKS
  footerLinks: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#333",
    fontSize: 14,
  },
  boldLink: {
    fontWeight: "bold",
    color: "#2A5CA8",
  },
});