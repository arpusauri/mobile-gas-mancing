import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api/config";
import BackgroundLayout from "../../components/BackgroundLayout";
import { Platform, Alert } from "react-native";

const { width } = Dimensions.get("window");

// Komponen Input Field
const InputField = ({
  icon,
  placeholder,
  isPassword = false,
  iconColor,
  keyboardType = "default",
  value,
  onChangeText,
}: any) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={isPassword}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function UserProfileScreen() {
  // STATE harus di dalam komponen
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState("");

  // LOAD PROFILE
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await api.auth.getProfile(token);
        console.log("Raw response:", response); // <-- sudah benar

        // Ambil user object
        const user = response.user;

        // SET STATE dari user
        setUserId(user.id_pengguna);
        setEmail(user.email || "");
        setUsername(user.nama_lengkap || "");
        setPhone(user.no_telepon || "");
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // HANDLE SUBMIT
  const handleSubmit = async () => {
    try {
      const payload: any = {
        nama_lengkap: username,
        email,
        no_telepon: phone,
      };
      if (password.trim() !== "") payload.password_hash = password;

      await api.users.update(userId, payload);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    const doLogout = async () => {
      await AsyncStorage.multiRemove(["token", "userId"]);

      if (Platform.OS === "web") {
        // ⬅️ INI PENTING: HARD RESET ROUTER
        window.location.href = "/";
        return;
      }

      router.replace("/");
    };

    if (Platform.OS === "web") {
      const ok = window.confirm("Apakah anda yakin ingin keluar?");
      if (!ok) return;
      await doLogout();
      return;
    }

    Alert.alert("Logout", "Apakah kamu yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: doLogout,
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <BackgroundLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER HALAMAN */}
          <View style={styles.header}>
            <Ionicons
              name="person"
              size={32}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.pageTitle}>Profile</Text>
          </View>

          {/* FORM CARD */}
          <LinearGradient
            colors={["#2A5CA8", "#06162e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            <InputField
              icon="mail"
              placeholder="Enter your email"
              iconColor="#000000"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <InputField
              icon="person"
              placeholder="Enter your username"
              iconColor="#000000"
              value={username}
              onChangeText={setUsername}
            />

            <InputField
              icon="call"
              placeholder="Enter your phone"
              iconColor="#000000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

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
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Spacer Bawah */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

// STYLES
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
  },
  formCard: {
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 25,
    width: "100%",
    elevation: 20,
    shadowColor: "#051226",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 20,
    height: 50,
  },
  iconWrapper: {
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    height: "100%",
  },
  submitButton: {
    backgroundColor: "#6495ED",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },

  logoutText: {
    color: "#FF4D4F",
    fontSize: 15,
    fontWeight: "bold",
  },
});

